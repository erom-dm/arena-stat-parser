import React from "react";
import { TeamCompDataset } from "../Types/ArenaTypes";
import BarChart from "./BarChart";
import LineChart from "./LineChart";

export type chartContainerProps = {
  dataset: TeamCompDataset;
  selectedChartType: string;
};

const ChartContainer: React.FC<chartContainerProps> = ({
  dataset,
  selectedChartType,
}) => {
  let activeChart;
  switch (selectedChartType) {
    case "Team comps":
      activeChart = <BarChart dataset={dataset} />;
      break;
    case "Rating change":
      activeChart = <LineChart />;
      break;
    default:
      activeChart = null;
  }
  return <div className={"dashboard__chart-container"}>{activeChart}</div>;
};

export default ChartContainer;
