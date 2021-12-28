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
  CharClasses,
  MathupDataset,
  ClassDistributionDataset,
  ClassDistributionChartInputData,
  TeamCompsChartInputData,
  ColorRangeInfo,
} from "../Types/ArenaTypes";
import { hashFromStrings } from "./hashGeneration";
import generateChartColors from "./colorGeneration";
import { interpolateTurbo } from "d3-scale-chromatic";

const DC_TEAM_NAME = "~DC~";
const DISCONNECT = "DISCONNECT";
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
export const CHART_ROUTES = [
  ["Matches", "/matches"],
  ["Team comps", "/team-comps"],
  ["Rating change", "/rating-change"],
  ["Teams", "/teams"],
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
  compArr.push(playerDCed ? CharClasses.disconnected : teamObj[name].class);
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

export function createMatchupDataSet(data: ModdedArenaMatch[]): MathupDataset {
  return data.reduce(
    (dataset, match) => {
      const hasDCedPlayers =
        match.enemyTeamComp.includes(CharClasses.disconnected) ||
        match.myTeamComp.includes(CharClasses.disconnected);
      if (hasDCedPlayers) {
        fillTeamCompDatasetObject(dataset, DISCONNECT, match);
      } else {
        const enemyTeamCompString = teamcompArrToString(match.enemyTeamComp);
        fillTeamCompDatasetObject(dataset, enemyTeamCompString, match);
      }

      fillClassDistributionData(dataset, match);
      return dataset;
    },
    { teamCompsDataset: {}, classDistributionDataset: {} } as MathupDataset
  );
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

function fillClassDistributionData(
  obj: MathupDataset,
  match: ModdedArenaMatch
) {
  const { enemyTeamComp } = match;
  const { classDistributionDataset: dataset } = obj;
  enemyTeamComp.forEach((el) => {
    if (dataset[el]) {
      dataset[el]++;
    } else {
      dataset[el] = 1;
    }
  });
}

function fillTeamCompDatasetObject(
  matchupDataset: MathupDataset,
  key: string,
  match: ModdedArenaMatch
): void {
  const { teamCompsDataset } = matchupDataset;
  const DC_MATCH = key === DISCONNECT;
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

  const entry = teamCompsDataset[key];

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
    teamCompsDataset[key] = {
      matchCount: 1,
      wins: Number(win),
      performanceStats: TeamPerformanceStats,
      zoneStats: { [instanceID]: { matches: 1, wins: Number(win) } },
    };
  }
}

export function getClassDistributionChartInputData(
  dataset: ClassDistributionDataset
): ClassDistributionChartInputData {
  const sortedEntries = Object.entries(dataset).sort((a, b) => b[1] - a[1]);
  return sortedEntries.reduce(
    (obj, entry) => {
      obj.labels.push([entry[0]]); // Push classname into label array
      obj.data.push(entry[1]); // Push classname corresponding match count to data array
      return obj;
    },
    { labels: [], data: [] } as ClassDistributionChartInputData
  );
}

export function getTeamCompsChartInputData(
  dataset: TeamCompDataset
): TeamCompsChartInputData {
  const colorRangeInfo: ColorRangeInfo = {
    colorStart: 0.1,
    colorEnd: 0.85,
    useEndAsStart: true,
  };
  const sortedEntries = Object.entries(dataset).sort(
    (a, b) => b[1].matchCount - a[1].matchCount
  );
  const reducedEntries = sortedEntries.reduce(
    (data, entry) => {
      const [teamComp, { matchCount, wins, zoneStats, performanceStats }] =
        entry;
      data.totalMatchNumber += matchCount;
      data.totalWins += wins;
      data.labelArr.push([teamComp]);
      data.dataArr.push(matchCount);
      data.winsArr.push(wins);
      data.zoneStatsArr.push(zoneStats);
      data.performanceStatsArr.push(performanceStats);
      generateChartColors(
        sortedEntries.length,
        interpolateTurbo,
        colorRangeInfo,
        data.colorArray
      );
      return data;
    },
    {
      totalMatchNumber: 0,
      totalWins: 0,
      labelArr: [],
      dataArr: [],
      winsArr: [],
      zoneStatsArr: [],
      performanceStatsArr: [],
      colorArray: [],
    } as TeamCompsChartInputData
  );
  reducedEntries.totalLosses =
    reducedEntries.totalMatchNumber - reducedEntries.totalWins;
  reducedEntries.totalWinrate = calcWinrate(
    reducedEntries.totalMatchNumber,
    reducedEntries.totalWins
  );
  return reducedEntries;
}

export function formatTeamCompsChartTooltip(tooltip: any): string[] {
  const index = tooltip.dataIndex;
  const wins = tooltip.dataset.wins[index];
  const matchCount = tooltip.dataset.data[index];
  const zoneStats = tooltip.dataset.zoneStats[index];
  const performanceStats = tooltip.dataset.performanceStats[index];
  const winrate: string = calcWinrate(matchCount, wins);

  const zoneStatsStringArr: string[] = [];
  Object.keys(zoneStats).forEach((key) => {
    zoneStatsStringArr.push(
      `${ARENA_INSTANCE_IDS[Number(key)]}: ${calcWinrate(
        zoneStats[key].matches,
        zoneStats[key].wins
      )}%`
    );
  });

  const performanceStatsStringArr: string[] = [];
  Object.keys(performanceStats).forEach((key) => {
    const avgDamage = +(performanceStats[key].damage / matchCount).toFixed(0);
    const avgHealing = +(performanceStats[key].healing / matchCount)
      .toFixed(0)
      .toLocaleString();
    performanceStatsStringArr.push(
      `${key}: damage: ${avgDamage.toLocaleString()} | healing: ${avgHealing.toLocaleString()}`
    );
  });

  return [
    `Wins: ${wins}, Losses: ${matchCount - wins}`,
    `Winrate: ${winrate}%`,
    " ",
    "Zone win rates:",
    ...zoneStatsStringArr,
    " ",
    "Average performance stats:",
    ...performanceStatsStringArr,
  ];
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
    currentStats[player].healing += currentMatchStats[player]?.healing;
    currentStats[player].damage += currentMatchStats[player]?.damage;
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
