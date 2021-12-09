import {
  ArenaMatch,
  arenaPlayerKeys,
  ArenaTeam,
  DetailedTeamRatingObject,
  EnemyTeamData,
  MatchSessions,
  ModdedArenaMatch,
  ModdedArenaTeam,
  RatingChangeDataset,
  RatingChangeObj,
  SplitNames,
  TeamCompDataset,
  TeamPerformanceStats,
  TeamRatingObject,
  TeamsDataset,
} from "../Types/ArenaTypes";
import { hashFromStrings } from "./hashGeneration";

const DISCONNECTED = "!disconnected";
const DC_TEAM_NAME = "~DC~";
// export const ARENA_INSTANCE_KEYS = ["572", "562", "559"];
export const ARENA_INSTANCE_IDS = {
  [572 as number]: "Ruins of Lordaeron",
  [562 as number]: "Blade's Edge Arena",
  [559 as number]: "Nagrand Arena",
};
const PLAYER_KEYS: arenaPlayerKeys[] = [
  "player1",
  "player2",
  "player3",
  "player4",
  "player5",
];
export const CHART_TYPES = [
  ["Matches", "/arena-stat-parser/matches"],
  ["Team comps", "/arena-stat-parser/team-comps"],
  ["Rating change", "/arena-stat-parser/rating-change"],
  ["Teams", "/arena-stat-parser/teams"],
];

export function modifyDataAndAddIds(data: ArenaMatch[]): ModdedArenaMatch[] {
  const filteredData = data.filter(
    (match) =>
      Object.keys(ARENA_INSTANCE_IDS).includes(String(match.instanceID)) &&
      match.hasOwnProperty("purpleTeam") &&
      match.hasOwnProperty("goldTeam")
  );
  const moddedArenaMatches = getModdedArenaMatches(filteredData);

  // Calculate hash values for each match, add as unique ID
  return moddedArenaMatches.map((match) => {
    const { instanceID, myTeamName, enemyTeamName, myTeam, enemyTeam } = match;
    const {
      MMR: myTeamMMR,
      rating: myTeamRating,
      newRating: myTeamNewRating,
    } = getTeamRatingValues(myTeam);
    const {
      MMR: enemyTeamMMR,
      rating: enemyTeamRating,
      newRating: enemyTeamNewRating,
    } = getTeamRatingValues(enemyTeam);

    match.matchID = hashFromStrings([
      myTeamName,
      enemyTeamName,
      String(instanceID),
      String(myTeamMMR),
      String(myTeamRating),
      String(myTeamNewRating),
      String(enemyTeamMMR),
      String(enemyTeamRating),
      String(enemyTeamNewRating),
    ]);
    return match;
  });
}

export function getModdedArenaMatches(data: ArenaMatch[]): ModdedArenaMatch[] {
  const modifiedData: ModdedArenaMatch[] = [];
  data.forEach((match) => {
    const moddedMatch: ModdedArenaMatch = {
      matchID: 0,
      enteredTime: match.enteredTime,
      instanceID: match.instanceID,
      instanceName: match.instanceName,
      playerName: match.playerName,
      enemyTeamComp: [],
      enemyTeamName: "",
      enemyPlayerNames: [],
      enemyTeamRating: 0,
      enemyTeamMMR: 0,
      myTeamComp: [],
      myTeamName: "",
      bracket: 0,
      myTeam: {},
      enemyTeam: {},
      win: false,
    };

    const moddedMatchData = getModdedArenaData(match);
    Object.assign(moddedMatch, moddedMatchData);

    // Filter out skirmish matches
    if (
      !(
        moddedMatch.myTeam.player1?.teamMMR === 0 &&
        moddedMatch.enemyTeam.player1?.teamMMR === 0
      )
    ) {
      modifiedData.push(moddedMatch);
    }
  });
  return modifiedData;
}

export function filterMatchData(
  data: ModdedArenaMatch[],
  selectedTeam: string
): ModdedArenaMatch[] {
  return data.filter((match) => match.myTeamName === selectedTeam);
}

export function matchArrayFromSelectedSessions(
  sessionData: MatchSessions
): ModdedArenaMatch[] {
  const filteredMatches: ModdedArenaMatch[] = [];

  sessionData.forEach((session) => {
    filteredMatches.push(...session);
  });

  return filteredMatches;
}

function getModdedArenaData(match: ArenaMatch): any {
  const myCharName = match.playerName;
  let { myTeam, enemyTeam, win, myTeamName } = getSpecificTeamData(
    match,
    myCharName
  );

  const myTeamNames: string[] = Object.keys(myTeam);
  const enemyTeamNames: string[] = Object.keys(enemyTeam);
  const myTeamPlayerCount = myTeamNames.length;
  const enemyTeamPlayerCount = enemyTeamNames.length;
  const bracket = Math.max(myTeamPlayerCount, enemyTeamPlayerCount);
  fillNameArraysWithBlanks(myTeamNames, enemyTeamNames, bracket);

  // modded arena team
  let myModdedTeam: ModdedArenaTeam = {};
  let myTeamComp: string[] = [];
  let enemyModdedTeam: ModdedArenaTeam = {};
  let enemyTeamComp: string[] = [];
  let enemyTeamName: string = "";
  let enemyTeamMMR: number = 0;
  let enemyTeamRating: number = 0;
  let enemyPlayerNames: string[] = [];
  myTeamNames.forEach((name, idx) =>
    getModdedTeamsAndTeamComps(name, idx, myTeam, myModdedTeam, myTeamComp)
  );
  enemyTeamNames.forEach((name, idx) => {
    if (name !== DC_TEAM_NAME) {
      enemyTeamName = enemyTeam[name].teamName;
      enemyTeamMMR = enemyTeam[name].teamMMR;
      enemyTeamRating = enemyTeam[name].teamRating;
      enemyPlayerNames.push(name);
    }
    getModdedTeamsAndTeamComps(
      name,
      idx,
      enemyTeam,
      enemyModdedTeam,
      enemyTeamComp
    );
  });
  return {
    bracket,
    win,
    myTeamName,
    enemyTeamName,
    enemyPlayerNames,
    enemyTeamMMR,
    enemyTeamRating,
    myTeam: myModdedTeam,
    myTeamComp: myTeamComp.sort(),
    enemyTeam: enemyModdedTeam,
    enemyTeamComp: enemyTeamComp.sort(),
  };
}

function getSpecificTeamData(
  match: ArenaMatch,
  myCharName: string
): {
  myTeam: ArenaTeam;
  myTeamName: string;
  enemyTeam: ArenaTeam;
  win: boolean;
} {
  let myTeam, myTeamName, enemyTeam, win;
  if (match.goldTeam.hasOwnProperty(myCharName)) {
    myTeam = match.goldTeam;
    myTeamName = match.goldTeam[myCharName].teamName;
    enemyTeam = match.purpleTeam;
    win = !!match.winningFaction;
  } else {
    myTeam = match.purpleTeam;
    myTeamName = match.purpleTeam[myCharName].teamName;
    enemyTeam = match.goldTeam;
    win = !match.winningFaction;
  }
  return { myTeam, myTeamName, enemyTeam, win };
}

function getModdedTeamsAndTeamComps(
  name: string,
  idx: number,
  teamObj: ArenaTeam,
  moddedTeamObj: ModdedArenaTeam,
  compArr: string[]
) {
  const playerDCed = name === DC_TEAM_NAME;
  moddedTeamObj[PLAYER_KEYS[idx]] = playerDCed
    ? null
    : {
        name: name,
        ...teamObj[name],
      };
  compArr.push(playerDCed ? DISCONNECTED : teamObj[name].class);
}

function fillNameArraysWithBlanks(
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

export function createTeamCompDataSet(
  data: ModdedArenaMatch[]
): TeamCompDataset {
  const dataset: TeamCompDataset = {};
  data.forEach((match) => {
    const hasDCedPlayers =
      match.enemyTeamComp.includes(DISCONNECTED) ||
      match.myTeamComp.includes(DISCONNECTED);
    if (hasDCedPlayers) {
      fillTeamCompObject(dataset, "DC", match);
    } else {
      const enemyTeamCompString = teamcompArrToString(match.enemyTeamComp);
      fillTeamCompObject(dataset, enemyTeamCompString, match);
    }
  });

  return dataset;
}

export function createRatingChangeDataSet(
  data: ModdedArenaMatch[]
): RatingChangeDataset {
  const dataset: RatingChangeDataset = [];
  data.forEach((match) => {
    fillRatingChangeArray(dataset, match);
  });

  return dataset;
}

function fillTeamCompObject(
  obj: TeamCompDataset,
  key: string,
  match: ModdedArenaMatch
): void {
  const DC_MATCH = key === "DC";
  const { instanceID, myTeam, win, bracket } = match;
  // get performance stats for match
  const TeamPerformanceStats: TeamPerformanceStats = {};
  if (!DC_MATCH) {
    for (let i = 0; i < bracket; i++) {
      const player = myTeam[PLAYER_KEYS[i]];
      if (player) {
        TeamPerformanceStats[player.name] = {
          healing: player.healing,
          damage: player.damage,
        };
      } else {
        TeamPerformanceStats["DC"] = { healing: 0, damage: 0 };
      }
    }
  }

  const entry = obj[key];

  if (entry) {
    // overall stats
    entry.matchCount += 1;
    if (win) {
      entry.wins++;
    }

    // zone stats
    if (entry.zoneStats[instanceID]) {
      entry.zoneStats[instanceID].matches++;
      if (win) {
        entry.zoneStats[instanceID].wins++;
      }
    } else {
      entry.zoneStats[instanceID] = { matches: 1, wins: Number(win) };
    }

    // team performance stats
    !DC_MATCH &&
      mergePlayerPerformanceStats(entry.performanceStats, TeamPerformanceStats);
  } else {
    obj[key] = {
      matchCount: 1,
      wins: Number(win),
      performanceStats: TeamPerformanceStats,
      zoneStats: { [instanceID]: { matches: 1, wins: Number(win) } },
    };
  }
}

function fillRatingChangeArray(
  arr: RatingChangeDataset,
  match: ModdedArenaMatch
): void {
  const { enteredTime: timestamp, enemyTeamComp, myTeam, bracket, win } = match;
  let newTeamRating = -1;
  let teamMMR = -1;
  for (let i = 0; i < bracket; i++) {
    const player = myTeam[PLAYER_KEYS[i]];
    if (player) {
      newTeamRating = player.newTeamRating;
      teamMMR = player.teamMMR;
    }
  }
  const RatingChangeObject: RatingChangeObj = {
    timestamp,
    newTeamRating,
    teamMMR,
    win,
    enemyTeamComp: teamcompArrToString(enemyTeamComp),
  };
  arr.push(RatingChangeObject);
}

function teamcompArrToString(arr: string[]): string {
  return arr.reduce((a, b) => a.concat(" \\ ", b));
}

export function createTeamsDataSet(data: ModdedArenaMatch[]): TeamsDataset {
  const dataset: TeamsDataset = {};
  data.forEach((match) => {
    const { win } = match;
    const enemyTeamData: EnemyTeamData = getEnemyTeamData(match);

    if (dataset[enemyTeamData.teamName]) {
      const teamEntry = dataset[enemyTeamData.teamName];
      dataset[enemyTeamData.teamName] = {
        teamName: teamEntry.teamName,
        enemyTeamComp: teamEntry.enemyTeamComp,
        enemyPlayerNames: Array.from(
          new Set([
            ...teamEntry.enemyPlayerNames,
            ...enemyTeamData.enemyPlayerNames,
          ])
        ),
        teamMMR: fillDetailedTeamRatingObject(
          enemyTeamData.enemyTeamMMR,
          teamEntry.teamMMR
        ),
        teamRating: fillDetailedTeamRatingObject(
          enemyTeamData.enemyTeamRating,
          teamEntry.teamRating
        ),
        matchesPlayed: teamEntry.matchesPlayed + 1,
        wins: teamEntry.wins + Number(win),
      };
    } else {
      const teamMMR = fillDetailedTeamRatingObject(enemyTeamData.enemyTeamMMR);
      const teamRating = fillDetailedTeamRatingObject(
        enemyTeamData.enemyTeamRating
      );
      dataset[enemyTeamData.teamName] = {
        teamName: enemyTeamData.teamName,
        enemyTeamComp: enemyTeamData.enemyTeamComp,
        enemyPlayerNames: enemyTeamData.enemyPlayerNames,
        teamMMR: teamMMR,
        teamRating: teamRating,
        matchesPlayed: 1,
        wins: Number(win),
      };
    }
  });
  return dataset;
}

function getEnemyTeamData(match: ModdedArenaMatch): EnemyTeamData {
  const {
    enemyTeamComp,
    enemyPlayerNames,
    enemyTeamMMR,
    enemyTeamName,
    enemyTeamRating,
  } = match;
  return {
    enemyTeamComp: teamcompArrToString(enemyTeamComp),
    teamName: enemyTeamName,
    enemyPlayerNames,
    enemyTeamMMR,
    enemyTeamRating,
  };
}

function fillDetailedTeamRatingObject(
  rating: number,
  prevRatingObj?: DetailedTeamRatingObject
): DetailedTeamRatingObject {
  const obj: DetailedTeamRatingObject = {
    min: 0,
    max: 0,
    average: 0,
    total: 0,
    matchCount: 0,
  };
  if (!prevRatingObj) {
    obj.min = rating;
    obj.average = rating;
    obj.max = rating;
    obj.total = rating;
    obj.matchCount = 1;
  } else {
    obj.matchCount = prevRatingObj.matchCount + 1;
    obj.min = Math.min(prevRatingObj.min, rating);
    obj.max = Math.max(prevRatingObj.max, rating);
    obj.average = Number(
      (rating / obj.matchCount + prevRatingObj.total / obj.matchCount).toFixed(
        0
      )
    );
    obj.total = prevRatingObj.total + rating;
  }
  return obj;
}

function mergePlayerPerformanceStats(
  currentStats: TeamPerformanceStats,
  currentMatchStats: TeamPerformanceStats
): void {
  Object.keys(currentStats).forEach((player) => {
    currentStats[player].healing += currentMatchStats[player].healing;
    currentStats[player].damage += currentMatchStats[player].damage;
  });
}

export function calcWinrate(matchCount: number, wins: number): string {
  return ((wins / matchCount) * 100).toFixed(1);
}

export function separateNamesFromRealm(inputArr: string[]): SplitNames {
  const obj: SplitNames = { names: [], realm: "" };
  inputArr.forEach((name) => {
    const arr = name.split("-");
    obj.names.push(arr[0]);
    obj.realm = arr[1];
  });
  return obj;
}

export function getTeamRatingValues(
  team: ModdedArenaTeam | ArenaTeam
): TeamRatingObject {
  const returnObject: TeamRatingObject = {
    MMR: 0,
    rating: 0,
    newRating: 0,
    ratingChange: 0,
  };
  const players = Object.values(team);
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    if (player && player.class) {
      returnObject.MMR = player.teamMMR;
      returnObject.rating = player.teamRating;
      returnObject.newRating = player.newTeamRating;
      returnObject.ratingChange = player.newTeamRating - player.teamRating;
      break;
    }
  }

  return returnObject;
}
