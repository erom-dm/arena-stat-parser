import React from "react";
import {
  ColorRangeInfo,
  DetailedTeamRatingObject,
  ModdedArenaMatch,
} from "../Types/ArenaTypes";
import generateChartColors from "../utils/colorGeneration";
import { interpolateTurbo } from "d3-scale-chromatic";
import { Bar } from "react-chartjs-2/dist";
import {
  calcWinrate,
  createTeamsDataSet,
  separateNamesFromRealm,
} from "../utils/dataSetHelpers";

export type teamsChartProps = {
  selectedArenaMatches: ModdedArenaMatch[];
};

const TeamsChart: React.FC<teamsChartProps> = ({ selectedArenaMatches }) => {
  const dataset = createTeamsDataSet(selectedArenaMatches);
  let colorArray: string[] = [];
  const labelArr: (string | string[])[] = [];
  const dataArr: number[] = [];
  const winArr: number[] = [];
  const teamCompArr: string[] = [];
  const teamMMRArr: DetailedTeamRatingObject[] = [];
  const teamRatingArr: DetailedTeamRatingObject[] = [];
  const enemyPlayerNamesArr: string[][] = [];

  const ticksConf = {
    color: "#292F36",
    font: { size: 15, family: "'Roboto', sans-serif" },
    stepSize: 1,
    beginAtZero: true,
  };
  const options: any = {
    maintainAspectRatio: false,
    // indexAxis: "y",
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
            const dataset = tooltip.dataset;
            const teamComp = dataset.teamComp[index];
            const teamMMR = dataset.teamMMR[index];
            const teamRating = dataset.teamRating[index];
            const playerNames = separateNamesFromRealm(
              dataset.enemyPlayerNames[index]
            );
            const wins = dataset.wins[index];
            const matchCount = tooltip.dataset.data[index];
            return [
              teamComp,
              `Wins: ${wins}, Losses: ${matchCount - wins}, WR: ${calcWinrate(
                matchCount,
                wins
              )}%`,
              `Their MMR - min: ${teamMMR.min} | max: ${teamMMR.max} | avg: ${teamMMR.average}`,
              `Their Rating - min: ${teamRating.min} | max: ${teamRating.max} | avg: ${teamRating.average}`,
              `Realm: ${playerNames.realm}`,
              `Names: ${playerNames.names}`,
            ];
          },
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
  };

  const data = {
    labels: labelArr,
    datasets: [
      {
        label: "",
        data: dataArr,
        wins: winArr,
        teamComp: teamCompArr,
        teamMMR: teamMMRArr,
        teamRating: teamRatingArr,
        enemyPlayerNames: enemyPlayerNamesArr,
        backgroundColor: colorArray,
        borderColor: [],
        borderWidth: 1,
        hoverOffset: 6,
      },
    ],
  };

  const sortableEntries = Object.values(dataset);
  sortableEntries.sort((a, b) => b.matchesPlayed - a.matchesPlayed);
  sortableEntries.forEach((entry) => {
    const {
      teamName,
      matchesPlayed,
      wins,
      enemyTeamComp,
      teamRating,
      teamMMR,
      enemyPlayerNames,
    } = entry;
    labelArr.push(teamName);
    dataArr.push(matchesPlayed);
    winArr.push(wins);
    teamCompArr.push(enemyTeamComp);
    teamRatingArr.push(teamRating);
    teamMMRArr.push(teamMMR);
    enemyPlayerNamesArr.push(enemyPlayerNames);
  });

  const colorRangeInfo: ColorRangeInfo = {
    colorStart: 0.05,
    colorEnd: 0.87,
    useEndAsStart: true,
  };
  generateChartColors(
    sortableEntries.length,
    interpolateTurbo,
    colorRangeInfo,
    colorArray
  );

  return (
    <div className={"team-chart-wrap"}>
      <div className="header">
        <div />
        <h1 className="title">{"Enemy Team Stats"}</h1>
      </div>
      <div className={"chart-container"}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default TeamsChart;
