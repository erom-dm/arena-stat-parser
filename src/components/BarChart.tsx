import React from "react";
import { Bar } from "react-chartjs-2";
import { interpolateTurbo } from "d3-scale-chromatic";
import {
  ChartDataSet,
  ColorRangeInfo,
  SortableTeamCompObj,
  TeamCompDataset,
  TeamPerformanceStats,
  ZoneStats,
} from "../Types/ArenaTypes";
import generateChartColors from "../utils/colorGeneration";
import { ARENA_INSTANCE_IDS } from "../utils/dataSetHelpers";

type BarChartProps = {
  dataset: TeamCompDataset;
};

function calcWinrate(matchCount: number, wins: number): string {
  return ((wins / matchCount) * 100).toFixed(1);
}

const BarChart: React.FC<BarChartProps> = ({ dataset }) => {
  const colorRangeInfo: ColorRangeInfo = {
    colorStart: 0.1,
    colorEnd: 0.85,
    useEndAsStart: true,
  };
  let totalMatchNumber = 0;
  let totalWins = 0;
  let totalLosses: number;
  let totalWinrate: string;
  const labelArr: (string | string[])[] = [];
  const dataArr: number[] = [];
  const winsArr: number[] = [];
  const zoneStatsArr: ZoneStats[] = [];
  const performanceStatsArr: TeamPerformanceStats[] = [];
  let colorArray: string[] = [];

  const ticksConf = {
    color: "#292F36",
    font: { size: 15, family: "'Roboto', sans-serif" },
    stepSize: 1,
    beginAtZero: true,
  };
  const options: any = {
    maintainAspectRatio: false,
    indexAxis: "y",
    responsive: true,
    scales: {
      y: {
        ticks: ticksConf,
      },
      x: {
        ticks: ticksConf,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          afterLabel: (tooltip: any) => {
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
              const avgDamage = +(
                performanceStats[key].damage / matchCount
              ).toFixed(0);
              const avgHealing = +(performanceStats[key].healing / matchCount)
                .toFixed(0)
                .toLocaleString();
              performanceStatsStringArr.push(
                `${key}: damage: ${avgDamage.toLocaleString()} | healing: ${avgHealing.toLocaleString()}`
              );
            });

            return [
              `Wins: ${wins}, Losses: ${matchCount - wins}`,
              `WR: ${winrate}%`,
              " ",
              "Zone win rates:",
              ...zoneStatsStringArr,
              " ",
              "Average performance stats:",
              ...performanceStatsStringArr,
            ];
          },
        },
      },
      legend: {
        display: false,
      },
    },
  };
  const data: ChartDataSet = {
    labels: labelArr,
    datasets: [
      {
        label: "",
        data: dataArr,
        wins: winsArr,
        zoneStats: zoneStatsArr,
        performanceStats: performanceStatsArr,
        backgroundColor: colorArray,
        borderColor: [],
        borderWidth: 1,
        hoverOffset: 6,
      },
    ],
  };

  const sortableEntries: SortableTeamCompObj[] = [];
  const datasetKeys = Object.keys(dataset);
  datasetKeys.forEach((key) => {
    const { matchCount, wins, zoneStats, performanceStats } = dataset[key];
    sortableEntries.push({
      teamComp: key,
      matchCount,
      wins,
      zoneStats,
      performanceStats,
    });
  });
  sortableEntries.sort((a, b) => b.matchCount - a.matchCount);
  sortableEntries.forEach((entry) => {
    const { matchCount, wins, zoneStats, performanceStats, teamComp } = entry;
    totalMatchNumber += matchCount;
    totalWins += wins;
    labelArr.push([teamComp]);
    dataArr.push(matchCount);
    winsArr.push(wins);
    zoneStatsArr.push(zoneStats);
    performanceStatsArr.push(performanceStats);
  });
  generateChartColors(
    sortableEntries.length,
    interpolateTurbo,
    colorRangeInfo,
    colorArray
  );
  totalLosses = totalMatchNumber - totalWins;
  totalWinrate = calcWinrate(totalMatchNumber, totalWins);
  const chartTitle: string = `Matches Played: ${totalMatchNumber}, Wins: ${totalWins}, Losses: ${totalLosses}, WR: ${totalWinrate}%,`;

  return (
    <>
      <div className="header">
        <h1 className="title">{chartTitle}</h1>
      </div>
      <div className={"chart-container"}>
        <Bar data={data} options={options} />
      </div>
    </>
  );
};

export default BarChart;
