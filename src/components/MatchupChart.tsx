import React, { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  TeamCompData,
  MatchupChartTypes,
  ModdedArenaMatch,
  ClassDistributionData,
} from "../Types/ArenaTypes";
import {
  createMatchupDataSet,
  formatClassDistributionChartTooltip,
  formatTeamCompsChartTooltip,
  getClassDistributionChartInputData,
  getTeamCompsChartInputData,
} from "../utils/dataSetHelpers";

const ticksConf = {
  color: "#292F36",
  font: { size: 15, family: "'Roboto', sans-serif" },
  stepSize: 1,
  beginAtZero: true,
};

type BarChartProps = {
  selectedArenaMatches: ModdedArenaMatch[];
};

const MatchupChart: React.FC<BarChartProps> = ({ selectedArenaMatches }) => {
  const [chartType, setChartType] = useState<MatchupChartTypes>(
    MatchupChartTypes.teamComps
  );
  const toggleChartType = () => {
    setChartType((prevState) =>
      prevState === MatchupChartTypes.classes
        ? MatchupChartTypes.teamComps
        : MatchupChartTypes.classes
    );
  };
  const { teamCompsDataset, classDistributionDataset } = useMemo(
    () => createMatchupDataSet(selectedArenaMatches),
    [selectedArenaMatches]
  );
  const {
    totalMatchNumber,
    totalWins,
    totalLosses,
    totalWinrate,
    labelArr,
    dataArr,
    winsArr,
    zoneStatsArr,
    performanceStatsArr,
    colorArray,
  } = useMemo(
    () => getTeamCompsChartInputData(teamCompsDataset),
    [teamCompsDataset]
  );
  const {
    labels: classLabels,
    data: classData,
    colorArray: classColorArray,
  } = useMemo(
    () => getClassDistributionChartInputData(classDistributionDataset),
    [classDistributionDataset]
  );

  const teamCompOptions: any = useMemo(
    () => ({
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
            afterLabel: formatTeamCompsChartTooltip,
          },
        },
        legend: {
          display: false,
        },
      },
    }),
    []
  );
  const teamCompData: TeamCompData = useMemo(
    () => ({
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
    }),
    [colorArray, dataArr, labelArr, performanceStatsArr, winsArr, zoneStatsArr]
  );
  const classDistributionOptions: any = useMemo(
    () => ({
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
            afterLabel: formatClassDistributionChartTooltip,
          },
        },
        legend: {
          display: false,
        },
      },
    }),
    []
  );
  const classDistributionData: ClassDistributionData = useMemo(
    () => ({
      labels: classLabels,
      datasets: [
        {
          label: "",
          data: classData,
          totalClassCount: classData.reduce((prev, next) => prev + next, 0),
          backgroundColor: classColorArray,
          borderColor: [],
          borderWidth: 1,
          hoverOffset: 6,
        },
      ],
    }),
    [classLabels, classData, classColorArray]
  );

  const chartTitle: string = `Matches Played: ${totalMatchNumber}, Wins: ${totalWins}, Losses: ${totalLosses}, WR: ${totalWinrate}%,`;
  const chartData =
    chartType === MatchupChartTypes.teamComps
      ? teamCompData
      : classDistributionData;
  const chartOptions =
    chartType === MatchupChartTypes.teamComps
      ? teamCompOptions
      : classDistributionOptions;

  return (
    <>
      <div className="header">
        <button onClick={toggleChartType}>{chartType}</button>
        <h1 className="title">{chartTitle}</h1>
      </div>
      <div className={"chart-container"}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </>
  );
};

export default MatchupChart;
