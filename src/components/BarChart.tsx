import React from "react";
import { Bar } from "react-chartjs-2";
import { interpolateTurbo } from "d3-scale-chromatic";
import {
  ChartDataSet,
  ColorRangeInfo,
  SortableTeamCompObj,
  TeamCompDataset,
} from "../Types/ArenaTypes";
import generateChartColors from "../utils/colorGeneration";

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
  let colorArray: string[] = [];
  const options: any = {
    indexAxis: "y",
    responsive: true,
    scales: {
      y: {
        ticks: {
          color: "#292F36",
          font: { size: 15, family: "'Roboto', sans-serif" },
          stepSize: 1,
          beginAtZero: true,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          afterLabel: (tooltip: any) => {
            const index = tooltip.dataIndex;
            const wins = tooltip.dataset.wins[index];
            const matchCount = tooltip.dataset.data[index];
            const winrate: string = calcWinrate(matchCount, wins);
            return [
              `Wins: ${wins}, Losses: ${matchCount - wins}`,
              `WR: ${winrate}%`,
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
        backgroundColor: colorArray,
        borderColor: [],
        borderWidth: 1,
        hoverOffset: 6,
      },
    ],
  };

  const datasetKeys = Object.getOwnPropertyNames(dataset);
  const sortableEntries: SortableTeamCompObj[] = [];
  datasetKeys.forEach((key) => {
    const { matchCount, wins } = dataset[key];
    sortableEntries.push({ teamComp: key, matchCount, wins });
  });
  sortableEntries.sort((a, b) => b.matchCount - a.matchCount);
  sortableEntries.forEach((entry) => {
    const { matchCount, wins, teamComp } = entry;
    totalMatchNumber += matchCount;
    totalWins += wins;
    labelArr.push([teamComp]);
    dataArr.push(matchCount);
    winsArr.push(wins);
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
      <Bar data={data} options={options} />
    </>
  );
};

export default BarChart;
