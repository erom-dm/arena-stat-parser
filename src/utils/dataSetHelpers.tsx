import {
  ArenaMatch,
  arenaPlayerKeys,
  ArenaTeam,
  MatchSessions,
  ModdedArenaMatch,
  ModdedArenaTeam,
  TeamCompDataset,
} from "../Types/ArenaTypes";

const DISCONNECTED = "!disconnected";
const DC_TEAM_NAME = "~DC~";
const ARENA_INSTANCE_IDS: number[] = [572, 562, 559]; // "Ruins of Lordaeron", "Blade's Edge Arena", "Nagrand Arena"
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
      ARENA_INSTANCE_IDS.includes(match.instanceID) &&
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

export function filterArenaMatches(
  sessionData: MatchSessions,
  myTeamSelection: string
): ModdedArenaMatch[] {
  const filteredMatches: ModdedArenaMatch[] = [];

  sessionData.forEach((session) => {
    const filteredByTeamName = session.filter(
      (match) => match.myTeamName === myTeamSelection
    );
    filteredMatches.push(...filteredByTeamName);
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
    const enemyTeamCompString = teamcompArrToString(match.enemyTeamComp);
    if (hasDCedPlayers) {
      fillTeamCompObject(dataset, "DC", match);
    } else {
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
  if (obj[key]) {
    obj[key].matchCount += 1;
    match.win && obj[key].wins++;
  } else {
    obj[key] = { matchCount: 1, wins: Number(match.win) };
  }
}

function teamcompArrToString(arr: string[]): string {
  return arr.reduce((a, b) => a.concat(" \\ ", b));
}
