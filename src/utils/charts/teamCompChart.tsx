import {
  ArenaMatch,
  MathupDataset,
  TeamCompDataset,
  TeamCompsChartInputData,
  TeamPerformanceStats,
} from "../../Types/ArenaTypes";
import generateChartColors from "../colorGeneration";
import { interpolateTurbo } from "d3-scale-chromatic";
import { ARENA_INSTANCE_IDS, colorRangeInfoTurbo } from "../constants";
import { calcWinrate } from "../miscHelperFunctions";
import { fillClassDistributionData } from "./classChart";

export function createTeamCompChartDatasets(data: ArenaMatch[]): MathupDataset {
  return data.reduce(
    (dataset, match) => {
      fillTeamCompDatasetObject(dataset, match);
      fillClassDistributionData(dataset, match);
      return dataset;
    },
    { teamCompsDataset: {}, classDistributionDataset: {} } as MathupDataset
  );
}

export function fillTeamCompDatasetObject(
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

export function getTeamCompsInputData(
  dataset: TeamCompDataset
): TeamCompsChartInputData {
  // const colorRangeInfoGrey: ColorRangeInfo = {
  //   colorStart: 1,
  //   colorEnd: 0.6,
  //   useEndAsStart: true,
  // };
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
  generateChartColors(
    sortedEntries.length,
    interpolateTurbo,
    colorRangeInfoTurbo,
    reducedEntries.colorArray
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

  const zoneStatsStringArr = Object.keys(zoneStats).map((key) => {
    return `${(ARENA_INSTANCE_IDS[Number(key)] + ":").padEnd(
      19,
      " "
    )} ${calcWinrate(zoneStats[key].matches, zoneStats[key].wins)}%`;
  });

  const performanceStatsStringArr = Object.keys(performanceStats).map((key) => {
    const avgDamage = +(performanceStats[key].damage / matchCount).toFixed(0);
    const avgHealing = +(performanceStats[key].healing / matchCount)
      .toFixed(0)
      .toLocaleString();
    return `${key.padEnd(10, " ")} dmg ${avgDamage
      .toLocaleString()
      .padEnd(6, " ")} | heal ${avgHealing.toLocaleString().padEnd(6, " ")}`;
  });

  return [
    `Wins: ${wins}, Losses: ${matchCount - wins}`,
    `Winrate: ${winrate}%`,
    " ",
    "Zone win rates",
    ...zoneStatsStringArr,
    " ",
    "Average performance stats",
    ...performanceStatsStringArr,
  ];
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
