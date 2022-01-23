import {
  ArenaMatch,
  ArenaMatchCompact,
  ArenaMatchRaw,
  ClassDistributionChartInputData,
  ClassDistributionDataset,
  ColorRangeInfo,
  DetailedTeamRatingObject,
  EnemyTeamData,
  keyOfCharClasses,
  LineChartInputData,
  MatchSessions,
  MathupDataset,
  PlayerCompact,
  RaceDistributionObject,
  RatingChangeDataset,
  RatingChangeObj,
  RawTeam,
  SplitNames,
  TeamCompact,
  TeamCompDataset,
  TeamCompsChartInputData,
  TeamPerformanceStats,
  TeamsDataset,
} from "../Types/ArenaTypes";
import { hashFromStrings } from "./hashGeneration";
import generateChartColors from "./colorGeneration";
import { interpolateTurbo } from "d3-scale-chromatic";
import { rawArenaMatchTypeGuard } from "./parseData";
import { normalizeString } from "./stateHelpers";
import {
  ARENA_INSTANCE_IDS,
  classColorMap,
  classCompressionMapLC,
  DC_TEAM_NAME,
  raceCompressionMap,
} from "./constants";

export function modifyMatchData(data: ArenaMatchRaw[]): ArenaMatchCompact[] {
  const filteredData = data.filter(
    (match) =>
      Object.keys(ARENA_INSTANCE_IDS).includes(String(match.instanceID)) &&
      match.hasOwnProperty("purpleTeam") &&
      match.hasOwnProperty("goldTeam") &&
      rawArenaMatchTypeGuard(match)
  );
  if (filteredData.length) {
    return getModdedArenaMatches(filteredData);
  }

  return [];
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

export function getMyTeamNames(matches: ArenaMatch[]): string[] {
  return [...new Set(matches.map((match) => match.myTeam.teamName))];
}

export function createMatchupDataSet(data: ArenaMatch[]): MathupDataset {
  return data.reduce(
    (dataset, match) => {
      fillTeamCompDatasetObject(dataset, match);
      fillClassDistributionData(dataset, match);
      return dataset;
    },
    { teamCompsDataset: {}, classDistributionDataset: {} } as MathupDataset
  );
}

export function createMatchRatingChangeDataSet(
  data: ArenaMatch[]
): RatingChangeDataset {
  const dataset: RatingChangeDataset = [];
  data.forEach((match) => {
    fillRatingChangeArray(dataset, match);
  });

  return dataset;
}

export function createSessionRatingChangeDataSet(
  data: MatchSessions
): RatingChangeDataset {
  const relevantMatches: ArenaMatch[] = [];
  data.forEach((session) => {
    // start/end session variant
    // relevantMatches.push(session[0]);
    // session.length > 1 && relevantMatches.push(session[session.length - 1]);
    relevantMatches.push(session[session.length - 1]);
  });
  const dataset: RatingChangeDataset = [];
  relevantMatches.forEach((match) => {
    fillRatingChangeArray(dataset, match);
  });
  return dataset;
}

function fillClassDistributionData(
  obj: MathupDataset,
  match: ArenaMatch
): void {
  const { enemyTeam } = match;
  const { teamCompArray: enemyTeamCompArr, players } = enemyTeam;
  const { classDistributionDataset: dataset } = obj;
  // new
  players.forEach((player) => {
    if (player) {
      const { class: playerClass, race } = player;
      if (!dataset[playerClass]) {
        dataset[playerClass] = {
          total: 1,
          inMatches: 0,
          raceDistribution: {} as RaceDistributionObject,
        };
      } else {
        dataset[playerClass].total++;
      }
      if (race) {
        if (dataset[playerClass].raceDistribution[race]) {
          dataset[playerClass].raceDistribution[race]++;
        } else {
          dataset[playerClass].raceDistribution[race] = 1;
        }
      }
    }
  });
  const teamCompSet = new Set(
    enemyTeamCompArr.filter((el) => el !== "disconnected")
  );
  teamCompSet.forEach((el) => {
    dataset[el].inMatches++;
  });
}

function fillTeamCompDatasetObject(
  matchupDataset: MathupDataset,
  match: ArenaMatch
): void {
  const { teamCompsDataset } = matchupDataset;
  const DC_MATCH =
    match.enemyTeam.players.includes(null) ||
    match.myTeam.players.includes(null);
  const { instanceID, myTeam, win } = match;

  // get performance stats for match
  const TeamPerformanceStats: TeamPerformanceStats = {};
  if (!DC_MATCH) {
    myTeam.players.forEach((player) => {
      if (player) {
        TeamPerformanceStats[player.name] = {
          healing: player.healing,
          damage: player.damage,
        };
      } else {
        TeamPerformanceStats["DC"] = { healing: 0, damage: 0 };
      }
    });
  }

  const entryKey = DC_MATCH ? "Disconnect" : match.enemyTeam.teamCompString;
  const entry = teamCompsDataset[entryKey];

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
    teamCompsDataset[entryKey] = {
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
  const sortedEntries = Object.entries(dataset).sort(
    (a, b) => b[1].total - a[1].total
  );
  return sortedEntries.reduce(
    (obj, entry) => {
      obj.labels.push([entry[0]]); // Push classname into label array
      obj.totalData.push(entry[1].total); // Push corresponding total class count
      obj.inMatchesData.push(entry[1].inMatches); // Push corresponding match count
      obj.raceDistributionData.push(entry[1].raceDistribution); // Push race distribution object
      obj.colorArray.push(classColorMap[entry[0] as keyOfCharClasses]);
      return obj;
    },
    {
      labels: [],
      totalData: [],
      inMatchesData: [],
      raceDistributionData: [],
      colorArray: [],
    } as ClassDistributionChartInputData
  );
}

export function getLineChartInputData(
  dataset: RatingChangeDataset
): LineChartInputData {
  return dataset
    .sort((a, b) => a.timestamp - b.timestamp)
    .reduce(
      (data, current, index) => {
        const { enemyTeamComp, newTeamRating, win } = current;

        data.teamRatingArr.push(newTeamRating);
        data.enemyTeamCompArr.push(enemyTeamComp);
        data.labelArr.push(String(index + 1));
        data.winArray.push(win);

        const teamMMR = dataset[index + 1]?.teamMMR;
        teamMMR && data.teamMMRArr.push(teamMMR);
        return data;
      },
      {
        teamRatingArr: [],
        teamMMRArr: [],
        enemyTeamCompArr: [],
        labelArr: [],
        winArray: [],
      } as LineChartInputData
    );
}

export function getTeamCompsChartInputData(
  dataset: TeamCompDataset
): TeamCompsChartInputData {
  const colorRangeInfo: ColorRangeInfo = {
    colorStart: 0.05,
    colorEnd: 0.87,
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

export function formatClassDistributionChartTooltip(tooltip: any): string[] {
  const index = tooltip.dataIndex;
  const classCount = tooltip.dataset.data[index];
  const inMatchesClassCount = tooltip.dataset.inMatchesData[index];
  const { totalClassCount, totalMatchNumber } = tooltip.dataset;
  const percentOfTotal = ((classCount / totalClassCount) * 100).toFixed(1);
  const percentOfMatches = (
    (inMatchesClassCount / totalMatchNumber) *
    100
  ).toFixed(1);
  const RaceDistributionObject: RaceDistributionObject =
    tooltip.dataset.raceDistribution[index];
  const raceData = Object.entries(RaceDistributionObject)
    .sort((a, b) => b[1] - a[1])
    .map(
      (entry) =>
        `${entry[0]}: ${entry[1]}   ${((entry[1] / classCount) * 100).toFixed(
          1
        )}%`
    );
  const raceDataStrings = raceData.length
    ? ["", "Race Distribution:", ...raceData]
    : [];

  return [
    `${percentOfTotal}% of total players`,
    `${percentOfMatches}% of matches had at least one`,
    ...raceDataStrings,
  ];
}

function fillRatingChangeArray(
  arr: RatingChangeDataset,
  match: ArenaMatch
): void {
  const { enteredTime: timestamp, myTeam, enemyTeam, win } = match;
  const { newTeamRating, teamMMR } = myTeam;

  const RatingChangeObject: RatingChangeObj = {
    timestamp,
    newTeamRating,
    teamMMR,
    win,
    enemyTeamComp: enemyTeam.teamCompString,
  };
  arr.push(RatingChangeObject);
}

export function createTeamsDataSet(data: ArenaMatch[]): TeamsDataset {
  const dataset: TeamsDataset = {};
  data.forEach((match) => {
    const {
      win,
      enemyTeam: {
        teamName,
        teamCompString: enemyTeamComp,
        playerNamesArr: enemyPlayerNames,
        teamMMR: enemyTeamMMR,
        teamRating: enemyTeamRating,
      },
    } = match;
    const enemyTeamData: EnemyTeamData = {
      teamName,
      enemyTeamComp,
      enemyPlayerNames,
      enemyTeamMMR,
      enemyTeamRating,
    };

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
