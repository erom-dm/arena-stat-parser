import {
  ArenaMatch,
  ClassDistributionChartInputData,
  ClassDistributionDataset,
  keyOfCharClasses,
  MathupDataset,
  RaceDistributionObject,
} from "../../types/ArenaTypes";
import { classColorMap } from "../constants";

export function fillClassDistributionData(
  obj: MathupDataset,
  match: ArenaMatch
): void {
  const { enemyTeam } = match;
  const { teamCompArray: enemyTeamCompArr, players } = enemyTeam;
  const { classDistributionDataset: dataset } = obj;

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
        // Orc: 15   28%
        `${entry[0].padEnd(10, " ")} ${String(entry[1]).padEnd(4, " ")} ${(
          (entry[1] / classCount) *
          100
        ).toFixed(1)}%`
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
