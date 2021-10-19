import {
  ArenaMatch,
  ModdedArenaTeam,
  arenaPlayerKeys,
  ModdedArenaMatch,
  ArenaTeam,
} from "../Types/ArenaTypes";

const MY_CHARACTER_NAME: string = "Slít";
const ARENA_INSTANCE_IDS: number[] = [572, 562, 559]; // "Ruins of Lordaeron", "Blade's Edge Arena", "Nagrand Arena"
const PLAYER_KEYS: arenaPlayerKeys[] = [
  "player1",
  "player2",
  "player3",
  "player4",
  "player5",
];

export function filterRawData(data: ArenaMatch[]): ModdedArenaMatch[] {
  const filteredData = data.filter(
    (match) =>
      ARENA_INSTANCE_IDS.includes(match.instanceID) &&
      match.playerName === MY_CHARACTER_NAME &&
      match.hasOwnProperty("purpleTeam") &&
      match.hasOwnProperty("goldTeam")
  );
  const modifiedData: ModdedArenaMatch[] = [];
  filteredData.forEach((match) => {
    const moddedMatch: ModdedArenaMatch = {
      enteredTime: match.enteredTime,
      instanceID: match.instanceID,
      instanceName: match.instanceName,
      playerName: match.playerName,
    };

    const moddedMatchData = getModdedArenaData(match);
    Object.assign(moddedMatch, moddedMatchData);
    modifiedData.push(moddedMatch);
  });

  return modifiedData;
}

// function arraysOfStringsAreEqual(teamComp1: string[], teamComp2: string[]) {
//   teamComp1.sort();
//   teamComp2.sort();
//   let areEqual = true;
//
//   teamComp1.forEach((el, idx) => {
//     if (el.toLowerCase() !== teamComp2[idx].toLowerCase()) {
//       areEqual = false;
//     }
//   });
//   return areEqual;
// }
//
// const a = ["MAGE", "ROGUE"];
// const b = ["ROGUE", "MAGE"];
// const c = ["WARRIOR", "DRUID"];

function getModdedArenaData(match: ArenaMatch): any {
  let myTeam: ArenaTeam, enemyTeam: ArenaTeam, win: boolean;
  if (match.goldTeam.hasOwnProperty(MY_CHARACTER_NAME)) {
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
  compArr.push(playerDCed ? "disconnected" : teamObj[name].class);
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
