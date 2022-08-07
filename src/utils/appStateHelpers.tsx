import {
  ArenaMatch,
  ArenaMatchCompact,
  ArenaMatchRaw,
  MatchSessions,
  PlayerCompact,
  RawTeam,
  TeamCompact,
} from "../types/ArenaTypes";
import { rawArenaMatchTypeGuard } from "./dataParsingHelpers";
import { normalizeString } from "./miscHelperFunctions";
import {
  ARENA_INSTANCE_IDS,
  classCompressionMapLC,
  DC_TEAM_NAME,
  raceCompressionMap,
} from "./constants";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { hashFromStrings } from "./fileHelpers";
dayjs.extend(isBetween);

export function modifyMatchData(data: ArenaMatchRaw[]): ArenaMatchCompact[] {
  const filteredData = data.filter(
    (match) =>
      Object.keys(ARENA_INSTANCE_IDS).includes(String(match?.instanceID)) &&
      match.hasOwnProperty("purpleTeam") &&
      match.hasOwnProperty("goldTeam") &&
      rawArenaMatchTypeGuard(match)
  );
  if (filteredData.length) {
    return getModdedArenaMatches(filteredData);
  }

  throw new Error("Log file wasn't parsed, nothing has been added to app state. Check file type.")
}

export function getModdedArenaMatches(
  data: ArenaMatchRaw[]
): ArenaMatchCompact[] {
  const moddedMatches: ArenaMatchCompact[] = [];
  data.forEach((match) => {
    const compactMatch = getCompactArenaData(match);

    // Filter out skirmish matches
    if (!(compactMatch.m.m === 0 && compactMatch.e.m === 0)) {
      moddedMatches.push(compactMatch);
    }
  });
  return moddedMatches;
}

export function filterMatchData(
  data: ArenaMatch[],
  selectedTeam: string
): ArenaMatch[] {
  return data.filter((match) => match.myTeam.teamName === selectedTeam);
}

export function matchArrayFromSelectedSessions(
  sessionData: MatchSessions
): ArenaMatch[] {
  const filteredMatches: ArenaMatch[] = [];

  sessionData.forEach((session) => {
    filteredMatches.push(...session);
  });

  return filteredMatches;
}

function getCompactArenaData(match: ArenaMatchRaw): ArenaMatchCompact {
  const myCharName = match.playerName;
  let {
    myTeamRaw,
    enemyTeamRaw,
    win: w,
  } = getSpecificTeamData(match, myCharName);
  const myTeamNames: string[] = Object.keys(myTeamRaw);
  const enemyTeamNames: string[] = Object.keys(enemyTeamRaw);
  const myTeamPlayerCount = myTeamNames.length;
  const enemyTeamPlayerCount = enemyTeamNames.length;
  const bracket = Math.max(myTeamPlayerCount, enemyTeamPlayerCount);
  fillNameArraysWithDcStrings(myTeamNames, enemyTeamNames, bracket);

  //Modded arena team data
  const t = match.enteredTime;
  const n = match.instanceID;
  const m = getTeamData(myTeamRaw, myTeamNames);
  const e = getTeamData(enemyTeamRaw, enemyTeamNames);
  // Create match ID as hash value
  const i = hashFromStrings([
    m.n,
    e.n,
    String(n),
    String(m.m),
    String(m.r),
    String(m.e),
    String(e.m),
    String(e.r),
    String(e.e),
  ]);

  return {
    i,
    t,
    n,
    w,
    m,
    e,
  };
}

function getSpecificTeamData(
  match: ArenaMatchRaw,
  myCharName: string
): {
  myTeamRaw: RawTeam;
  myTeamName: string;
  enemyTeamRaw: RawTeam;
  win: boolean;
} {
  let myTeamRaw, myTeamName, enemyTeamRaw, win;
  if (match.goldTeam.hasOwnProperty(myCharName)) {
    myTeamRaw = match.goldTeam;
    myTeamName = match.goldTeam[myCharName].teamName;
    enemyTeamRaw = match.purpleTeam;
    win = !!match.winningFaction;
  } else {
    myTeamRaw = match.purpleTeam;
    myTeamName = match.purpleTeam[myCharName].teamName;
    enemyTeamRaw = match.goldTeam;
    win = !match.winningFaction;
  }
  return { myTeamRaw, myTeamName, enemyTeamRaw, win };
}

function getTeamData(
  teamRawData: RawTeam,
  teamPlayerNames: string[]
): TeamCompact {
  let teamName = "",
    teamRating = 0,
    newTeamRating = 0,
    teamMMR = 0;
  const players: (PlayerCompact | null)[] = teamPlayerNames.map((name) => {
    if (name === DC_TEAM_NAME) {
      return null;
    }
    const playerRaw = teamRawData[name];
    const playerClass =
      classCompressionMapLC[
        normalizeString(playerRaw.class) as keyof typeof classCompressionMapLC
      ];
    const playerRace = playerRaw.race
      ? raceCompressionMap[
          normalizeString(playerRaw.race) as keyof typeof raceCompressionMap
        ]
      : undefined;
    const player: PlayerCompact = {
      n: name,
      c: playerClass,
      r: playerRace,
      d: playerRaw.damage,
      h: playerRaw.healing,
    };
    if (!teamName && !teamRating && !newTeamRating && !teamMMR) {
      teamName = playerRaw.teamName;
      teamRating = playerRaw.teamRating;
      newTeamRating = playerRaw.newTeamRating;
      teamMMR = playerRaw.teamMMR;
    }
    return player;
  });

  return {
    n: teamName,
    r: teamRating,
    e: newTeamRating,
    m: teamMMR,
    p: players,
  };
}

function fillNameArraysWithDcStrings(
  myTeamNames: string[],
  enemyTeamNames: string[],
  arenaBracket: number
): void {
  if (myTeamNames.length < arenaBracket) {
    for (let i = 0; i < arenaBracket - myTeamNames.length; i++) {
      myTeamNames.push(DC_TEAM_NAME);
    }
  }
  if (enemyTeamNames.length < arenaBracket) {
    for (let i = 0; i < arenaBracket - enemyTeamNames.length; i++) {
      enemyTeamNames.push(DC_TEAM_NAME);
    }
  }
}

export function getSessions(matches: ArenaMatch[]): MatchSessions {
  const matchSessions: MatchSessions = new Map();
  matches.sort((a, b) => a.enteredTime - b.enteredTime);

  let sessionKey: number | null = null;
  let prevMatch: ArenaMatch;
  matches.every((match) => {
    if (sessionKey) {
      // If session object is present, find if new match fits that session time frame
      const prevMatchEnterTime = dayjs.unix(prevMatch.enteredTime);
      const matchIsWithinOldSession = dayjs
        .unix(match.enteredTime)
        .isBetween(prevMatchEnterTime, prevMatchEnterTime.add(1, "hour"));

      // If match fits, add it to old session
      if (matchIsWithinOldSession) {
        matchSessions.get(sessionKey)?.push(match);
        prevMatch = match;
        return true;
      }
    }

    // If match doesn't fit or session key is null, create new session
    sessionKey = match.enteredTime;
    prevMatch = match;
    matchSessions.set(sessionKey, [match]);
    return true;
  });

  return matchSessions;
}
