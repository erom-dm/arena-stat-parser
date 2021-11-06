import {
  ArenaMatch,
  arenaPlayerKeys,
  ArenaTeam,
  MatchSessions,
  ModdedArenaMatch,
  ModdedArenaTeam,
  TeamCompDataset,
  TeamPerformanceStats,
} from "../Types/ArenaTypes";

const DISCONNECTED = "!disconnected";
const DC_TEAM_NAME = "~DC~";
export const ARENA_INSTANCE_KEYS = ["572", "562", "559"];
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

export function filterJunkData(data: ArenaMatch[]): ArenaMatch[] {
  return data.filter(
    (match) =>
      Object.keys(ARENA_INSTANCE_IDS).includes(String(match.instanceID)) &&
      match.hasOwnProperty("purpleTeam") &&
      match.hasOwnProperty("goldTeam")
  );
}

export function getModdedArenaMatches(data: ArenaMatch[]): ModdedArenaMatch[] {
  const modifiedData: ModdedArenaMatch[] = [];
  data.forEach((match) => {
    const moddedMatch: ModdedArenaMatch = {
      enteredTime: match.enteredTime,
      instanceID: match.instanceID,
      instanceName: match.instanceName,
      playerName: match.playerName,
      enemyTeamComp: [],
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
  let filteredMatchData = data.filter(
    (match) => match.myTeamName === selectedTeam
  );
  return filteredMatchData;
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
  let myTeam: ArenaTeam, enemyTeam: ArenaTeam, win: boolean, myTeamName: string;
  const myCharName = match.playerName;
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
  myTeamNames.forEach((name, idx) =>
    getModdedTeamsAndTeamComps(name, idx, myTeam, myModdedTeam, myTeamComp)
  );
  enemyTeamNames.forEach((name, idx) =>
    getModdedTeamsAndTeamComps(
      name,
      idx,
      enemyTeam,
      enemyModdedTeam,
      enemyTeamComp
    )
  );
  return {
    bracket,
    win,
    myTeamName,
    myTeam: myModdedTeam,
    myTeamComp: myTeamComp.sort(),
    enemyTeam: enemyModdedTeam,
    enemyTeamComp: enemyTeamComp.sort(),
  };
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

export function createBasicChartDataset(
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

function teamcompArrToString(arr: string[]): string {
  return arr.reduce((a, b) => a.concat(" \\ ", b));
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
