import {
  ArenaMatch,
  arenaPlayerKeys,
  ArenaTeam,
  ModdedArenaMatch,
  ModdedArenaTeam,
  TeamCompDataset,
} from "../Types/ArenaTypes";

const DISCONNECTED = "!disconnected";
// const MY_TEAMMATE_NAME: string = "Induator";
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

export function filterArenaMatches(
  data: ArenaMatch[],
  myCharName: string,
  filterSkirmish: boolean
): ModdedArenaMatch[] {
  const filteredData = data.filter((match) => {
    return match.playerName === myCharName;
  });
  let modifiedData: ModdedArenaMatch[] = [];
  filteredData.forEach((match) => {
    const moddedMatch: ModdedArenaMatch = {
      enteredTime: match.enteredTime,
      instanceID: match.instanceID,
      instanceName: match.instanceName,
      playerName: match.playerName,
      enemyTeamComp: [],
      myTeamComp: [],
      bracket: 0,
      myTeam: {},
      enemyTeam: {},
      win: false,
    };

    const moddedMatchData = getModdedArenaData(match);
    Object.assign(moddedMatch, moddedMatchData);
    modifiedData.push(moddedMatch);
  });
  if (filterSkirmish) {
    const filteredSkirmishes = modifiedData.filter(
      (match) =>
        !(
          match.myTeam.player1?.teamMMR === 0 &&
          match.enemyTeam.player1?.teamMMR === 0
        )
    );
    modifiedData = filteredSkirmishes;
  }
  return modifiedData;
}

function getModdedArenaData(match: ArenaMatch): any {
  let myTeam: ArenaTeam, enemyTeam: ArenaTeam, win: boolean;
  const myCharName = match.playerName;
  if (match.goldTeam.hasOwnProperty(myCharName)) {
    myTeam = match.goldTeam;
    enemyTeam = match.purpleTeam;
    win = !!match.winningFaction; //WIN
  } else {
    myTeam = match.purpleTeam;
    enemyTeam = match.goldTeam;
    win = !match.winningFaction; //WIN
  }

  const myTeamNames: (string | null)[] = Object.keys(myTeam);
  const enemyTeamNames: (string | null)[] = Object.keys(enemyTeam);
  const myTeamPlayerCount = myTeamNames.length;
  const enemyTeamPlayerCount = enemyTeamNames.length;
  const bracket = Math.max(myTeamPlayerCount, enemyTeamPlayerCount); // BRACKET
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
    myTeam: myModdedTeam,
    myTeamComp: myTeamComp.sort(),
    enemyTeam: enemyModdedTeam,
    enemyTeamComp: enemyTeamComp.sort(),
  };
}

function getModdedTeamsAndTeamComps(
  name: string | null,
  idx: number,
  teamObj: ArenaTeam,
  moddedTeamObj: ModdedArenaTeam,
  compArr: string[]
) {
  const playerDCed = name === null;
  moddedTeamObj[PLAYER_KEYS[idx]] = playerDCed
    ? null
    : {
        name: name,
        ...teamObj[name],
      };
  compArr.push(playerDCed ? DISCONNECTED : teamObj[name].class);
}

function fillNameArraysWithBlanks(
  myTeamNames: (string | null)[],
  enemyTeamNames: (string | null)[],
  arenaBracket: number
): void {
  if (myTeamNames.length < arenaBracket) {
    for (let i = 0; i < arenaBracket - myTeamNames.length; i++) {
      myTeamNames.push(null);
    }
  }
  if (enemyTeamNames.length < arenaBracket) {
    for (let i = 0; i < arenaBracket - enemyTeamNames.length; i++) {
      enemyTeamNames.push(null);
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
