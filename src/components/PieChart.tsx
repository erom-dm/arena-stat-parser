import React from "react";
import { Pie } from "react-chartjs-2";

const data = {
  labels: [
    "Mage/Rogue",
    "Rogue/Priest",
    "Druid/Warrior",
    "Rogue/Warlock",
    "Druid/Hunter",
    "Priest/Mage",
  ],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 8, 7, 6, 1, 2],
      backgroundColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
      hoverOffset: 6,
    },
  ],
};

const PieChart = () => (
  <>
    <div className="header">
      <h1 className="title">Pie Chart</h1>
    </div>
    <Pie data={data} />
  </>
);

export default PieChart;
