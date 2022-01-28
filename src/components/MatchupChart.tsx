import React, { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  ArenaMatch,
  ClassDistributionData,
  MatchupChartTypes,
  MatchupData,
  TeamCompData,
} from "../Types/ArenaTypes";
import {
  ticksConf,
  ticksConfMatchupChart,
  tooltipFontConf,
} from "../utils/constants";
import {
  formatMatchupChartTooltip,
  generateMatchupRaceData,
} from "../utils/charts/matchupChart";
import {
  createTeamCompChartDatasets,
  formatTeamCompsChartTooltip,
  getTeamCompsInputData,
} from "../utils/charts/teamCompChart";
import {
  formatClassDistributionChartTooltip,
  getClassDistributionChartInputData,
} from "../utils/charts/classChart";

type BarChartProps = {
  selectedArenaMatches: ArenaMatch[];
};

const MatchupChart: React.FC<BarChartProps> = ({ selectedArenaMatches }) => {
  const [chartType, setChartType] = useState<MatchupChartTypes>(
    MatchupChartTypes.teamComps
  );
  const [matchupTeamComp, setMatchupTeamComp] = useState<string | null>(null);

  const toggleChartType = () => {
    setChartType((prevState) => {
      return prevState === MatchupChartTypes.teamComps
        ? MatchupChartTypes.classes
        : MatchupChartTypes.teamComps;
    });
  };

  const { teamCompsDataset, classDistributionDataset } = useMemo(
    () => createTeamCompChartDatasets(selectedArenaMatches),
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
    () => getTeamCompsInputData(teamCompsDataset),
    [teamCompsDataset]
  );
  const {
    labels: classLabels,
    totalData: totalClassData,
    inMatchesData: inMatchesClassData,
    raceDistributionData: raceDistributionPerClassData,
    colorArray: classColorArray,
  } = useMemo(
    () => getClassDistributionChartInputData(classDistributionDataset),
    [classDistributionDataset]
  );

  const [matchupInputData, matchupArenaMatches] = useMemo(() => {
    if (selectedArenaMatches.length && matchupTeamComp) {
      return generateMatchupRaceData(
        selectedArenaMatches,
        matchupTeamComp,
        labelArr,
        colorArray
      );
    }
    return [
      {
        matchupLabels: [],
        matchupTotalGames: [],
        matchupWins: [],
        matchupWinrate: [],
        matchupLosses: [],
        matchupColorArray: [],
      },
      [],
    ];
  }, [matchupTeamComp, selectedArenaMatches, labelArr, colorArray]);

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
          ...tooltipFontConf,
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
      onClick: (event: any, element: any, chart: any) => {
        if (element.length) {
          const data = chart?.tooltip?.dataPoints;
          if (data.length) {
            setMatchupTeamComp(data[0].label);
            setChartType(MatchupChartTypes.matchup);
          }
        }
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
          ...tooltipFontConf,
          padding: 6,
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
          raceDistribution: raceDistributionPerClassData,
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
      raceDistributionPerClassData,
      totalMatchNumber,
      classColorArray,
    ]
  );

  const matchupOptions: any = useMemo(
    () => ({
      maintainAspectRatio: false,
      indexAxis: "y",
      responsive: true,
      scales: {
        y: {
          ticks: ticksConfMatchupChart,
        },
        x: {
          ticks: ticksConfMatchupChart,
        },
      },
      plugins: {
        tooltip: {
          ...tooltipFontConf,
          callbacks: {
            afterLabel: formatMatchupChartTooltip,
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
      onClick: (event: any, element: any) => {
        if (element.length) {
          setChartType(MatchupChartTypes.teamComps);
        }
      },
    }),
    []
  );
  const matchupData: MatchupData = useMemo(
    () => ({
      labels: matchupInputData.matchupLabels,
      datasets: [
        {
          label: "",
          data: matchupInputData?.matchupTotalGames,
          wins: matchupInputData?.matchupWins,
          winrates: matchupInputData?.matchupWinrate,
          losses: matchupInputData?.matchupLosses,
          allMatchupMatches: matchupArenaMatches,
          backgroundColor: matchupInputData?.matchupColorArray,
          borderColor: [],
          borderWidth: 1,
          hoverOffset: 6,
        },
      ],
    }),
    [matchupInputData, matchupArenaMatches]
  );

  const chartTitle: string = `Matches Played: ${totalMatchNumber}, Wins: ${totalWins}, Losses: ${totalLosses}, WR: ${totalWinrate}%,`;
  let chartData, chartOptions;
  switch (chartType) {
    case MatchupChartTypes.teamComps:
      chartData = teamCompData;
      chartOptions = teamCompOptions;
      break;
    case MatchupChartTypes.classes:
      chartData = classDistributionData;
      chartOptions = classDistributionOptions;
      break;
    case MatchupChartTypes.matchup:
      chartData = matchupData;
      chartOptions = matchupOptions;
      break;
    default:
      chartData = teamCompData;
      chartOptions = teamCompOptions;
  }

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
