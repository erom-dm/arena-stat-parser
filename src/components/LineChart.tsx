import React, { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  LineChartTypes,
  MatchSessions,
  ModdedArenaMatch,
} from "../Types/ArenaTypes";
import {
  createMatchRatingChangeDataSet,
  createSessionRatingChangeDataSet,
  getLineChartInputData,
} from "../utils/dataSetHelpers";
import dayjs from "dayjs";

type LineChartProps = {
  selectedArenaMatches: ModdedArenaMatch[];
  selectedSessions: MatchSessions;
};

const LineChart: React.FC<LineChartProps> = ({
  selectedArenaMatches,
  selectedSessions,
}) => {
  const [chartType, setChartType] = useState<LineChartTypes>(
    LineChartTypes.perMatch
  );
  const toggleChartType = () => {
    setChartType((prevState) =>
      prevState === LineChartTypes.perMatch
        ? LineChartTypes.perSession
        : LineChartTypes.perMatch
    );
  };

  const matchDataset = useMemo(
    () => createMatchRatingChangeDataSet(selectedArenaMatches),
    [selectedArenaMatches]
  );
  const sessionDataset = useMemo(
    () => createSessionRatingChangeDataSet(selectedSessions),
    [selectedSessions]
  );
  const { teamRatingArr, teamMMRArr, enemyTeamCompArr, labelArr, winArray } =
    useMemo(() => getLineChartInputData(matchDataset), [matchDataset]);
  const {
    teamRatingArr: teamRatingArrPerSession,
    labelArr: labelArrPerSession,
  } = useMemo(() => getLineChartInputData(sessionDataset), [sessionDataset]);
  const sessionDates = useMemo(
    () =>
      Array.from(selectedSessions.keys()).map((timestamp) =>
        dayjs.unix(timestamp).format("DD/MM/YY")
      ),
    [selectedSessions]
  );

  const ticksConf = {
    color: "#292F36",
    font: { size: 15, family: "'Roboto', sans-serif" },
    stepSize: 1,
    beginAtZero: true,
  };

  const perMatchOptions = {
    maintainAspectRatio: false,
    scales: {
      "y-axis-1": {
        ticks: { ...ticksConf, autoSkip: true, maxTicksLimit: 15 },
        bounds: "ticks",
        grid: { borderDashOffset: 0.9 },
      },
      x: {
        ticks: { ...ticksConf, autoSkip: true, maxTicksLimit: 20 },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          afterLabel: (tooltip: any) => {
            const index = tooltip.dataIndex;
            const enemyComp = tooltip.dataset.enemyComp[index];
            const win = tooltip.dataset.win[index];
            return [enemyComp, `${win ? "Win" : "Loss"}`];
          },
        },
      },
    },
  };
  const perMatchData = {
    labels: labelArr,
    datasets: [
      {
        label: "New Team Rating",
        data: teamRatingArr,
        enemyComp: enemyTeamCompArr,
        win: winArray,
        fill: false,
        backgroundColor: "rgb(254,38,0)",
        borderColor: "rgb(254,131,0)",
        yAxisID: "y-axis-1",
      },
      {
        label: "MMR",
        data: teamMMRArr,
        enemyComp: enemyTeamCompArr,
        win: winArray,
        fill: false,
        backgroundColor: "rgb(0,196,255)",
        borderColor: "rgb(0,255,255)",
        yAxisID: "y-axis-1",
      },
    ],
  };
  const perSessionOptions = {
    ...perMatchOptions,
    plugins: {
      tooltip: {
        callbacks: {
          afterLabel: (tooltip: any) => {
            console.dir(tooltip);
            const index = tooltip.dataIndex;
            const rating = tooltip.dataset.data[index];
            const dateString = tooltip.dataset.sessionDates[index];
            return [
              `Session #${index + 1} - ${dateString}`,
              `Final session rating: ${rating}`,
            ];
          },
          title: () => "",
          label: () => "",
        },
      },
    },
  };
  const perSessionData = {
    labels: labelArrPerSession,
    datasets: [
      {
        label: "Session end team rating",
        data: teamRatingArrPerSession,
        sessionDates: sessionDates,
        fill: false,
        backgroundColor: "rgb(254,38,0)",
        borderColor: "rgb(254,131,0)",
        yAxisID: "y-axis-1",
      },
    ],
  };

  const propObject =
    chartType === LineChartTypes.perMatch
      ? {
          data: perMatchData,
          options: perMatchOptions,
        }
      : {
          data: perSessionData,
          options: perSessionOptions,
        };

  return (
    <div className={"line-chart-wrap"}>
      <div className="header">
        <button onClick={toggleChartType}>{chartType}</button>
        <h1 className="title">Team Rating Change</h1>
      </div>
      <div className={"chart-container"}>
        <Line data={propObject.data} options={propObject.options} />
      </div>
    </div>
  );
};

export default LineChart;
