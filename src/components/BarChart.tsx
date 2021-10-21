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

const BarChart: React.FC<BarChartProps> = ({ dataset }) => {
  const colorRangeInfo: ColorRangeInfo = {
    colorStart: 0.1,
    colorEnd: 0.85,
    useEndAsStart: true,
  };
  const labelArr: (string | string[])[] = [];
  const dataArr: number[] = [];
  let colorArray: string[] = [];
  const data: ChartDataSet = {
    labels: labelArr,
    datasets: [
      {
        label: "",
        data: dataArr,
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
    const winrate: string = ((wins / matchCount) * 100).toFixed(1);
    labelArr.push([teamComp, `WR: ${winrate}%`]);
    dataArr.push(matchCount);
  });
  generateChartColors(
    sortableEntries.length,
    interpolateTurbo,
    colorRangeInfo,
    colorArray
  );

  return (
    <>
      <div className="header">
        <h1 className="title">Chart Title</h1>
      </div>
      <Bar data={data} />
    </>
  );
};

export default BarChart;
