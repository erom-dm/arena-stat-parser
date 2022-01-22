import React, { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { isMobile } from "react-device-detect";
import {
  TeamCompData,
  MatchupChartTypes,
  ClassDistributionData,
  ArenaMatch,
} from "../Types/ArenaTypes";
import {
  createMatchupDataSet,
  formatClassDistributionChartTooltip,
  formatTeamCompsChartTooltip,
  getClassDistributionChartInputData,
  getTeamCompsChartInputData,
} from "../utils/dataSetHelpers";

const chartVars = {
  tickSize: isMobile ? 12 : 15,
  maxTicksLimitY: isMobile ? 8 : 15,
  maxTicksLimitX: isMobile ? 10 : 20,
};

const ticksConf = {
  color: "#292F36",
  font: { size: chartVars.tickSize, family: "'Roboto', sans-serif" },
  stepSize: 1,
  beginAtZero: true,
  //TODO try to get separate colors for tick text
  // callback: (value: any, index: number, ticks: any) => {
  //   console.group("Tick Callback");
  //   console.dir(value);
  //   console.dir(index);
  //   console.dir(ticks);
  //   console.groupEnd();
  //   return "$" + value;
  // },
};

type BarChartProps = {
  selectedArenaMatches: ArenaMatch[];
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
    totalData: totalClassData,
    inMatchesData: inMatchesClassData,
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
            label: (tooltip: any) => {
              const value = tooltip.formattedValue;
              return `Total: ${value}`;
            },
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
            label: (tooltip: any) => {
              const value = tooltip.formattedValue;
              return `Total: ${value}`;
            },
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
          data: totalClassData,
          inMatchesData: inMatchesClassData,
          totalClassCount: totalClassData.reduce(
            (prev, next) => prev + next,
            0
          ),
          totalMatchNumber: totalMatchNumber,
          backgroundColor: classColorArray,
          borderColor: [],
          borderWidth: 1,
          hoverOffset: 6,
        },
      ],
    }),
    [
      classLabels,
      totalClassData,
      inMatchesClassData,
      totalMatchNumber,
      classColorArray,
    ]
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
    <div className={"matchup-chart-wrap"}>
      <div className="header">
        <button onClick={toggleChartType}>{chartType}</button>
        <h1 className="title">{chartTitle}</h1>
      </div>
      <div className={"chart-container"}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default MatchupChart;
