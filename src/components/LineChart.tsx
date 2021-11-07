import React from "react";
import { Line } from "react-chartjs-2";
import { RatingChangeDataset } from "../Types/ArenaTypes";

type LineChartProps = {
  dataset: RatingChangeDataset;
};

const LineChart: React.FC<LineChartProps> = ({ dataset }) => {
  const teamRatingArr: number[] = [];
  const teamMMRArr: number[] = [];
  const enemyTeamCompArr: string[] = [];
  const labelArr: string[] = [];
  const winArray: boolean[] = [];
  dataset.sort((a, b) => a.timestamp - b.timestamp);
  dataset.forEach((match, index) => {
    const { enemyTeamComp, newTeamRating, win } = match;
    teamRatingArr.push(newTeamRating);
    enemyTeamCompArr.push(enemyTeamComp);
    labelArr.push(String(index + 1));
    winArray.push(win);

    const teamMMR = dataset[index + 1]?.teamMMR;
    teamMMR && teamMMRArr.push(teamMMR);
  });

  const ticksConf = {
    color: "#292F36",
    font: { size: 15, family: "'Roboto', sans-serif" },
    stepSize: 1,
    beginAtZero: true,
  };
  const options = {
    maintainAspectRatio: false,
    scales: {
      "y-axis-1": {
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
            const enemyComp = tooltip.dataset.enemyComp[index];
            const win = tooltip.dataset.win[index];
            return [enemyComp, `${win ? "Win" : "Loss"}`];
          },
        },
      },
    },
  };
  const data = {
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

  return (
    <>
      <div className="header">
        <h1 className="title">Team Rating Change</h1>
      </div>
      <div className={"chart-container"}>
        <Line data={data} options={options} />
      </div>
    </>
  );
};

export default LineChart;
