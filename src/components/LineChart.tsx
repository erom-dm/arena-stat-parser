import React from "react";
import { Line } from "react-chartjs-2";

const data = {
  labels: ["1", "2", "3", "4", "5", "6"],
  datasets: [
    {
      label: "Team Rating",
      data: [1800, 1812, 1825, 1811, 1801, 1793],
      fill: false,
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgba(255, 99, 132, 0.2)",
      yAxisID: "y-axis-1",
    },
    {
      label: "MMR",
      data: [1840, 1858, 1870, 1852, 1833, 1812],
      fill: false,
      backgroundColor: "rgb(54, 162, 235)",
      borderColor: "rgba(54, 162, 235, 0.2)",
      yAxisID: "y-axis-1",
    },
  ],
};

// const options = {
//   scales: {
//     yAxes: [
//       {
//         type: "linear",
//         display: true,
//         position: "left",
//         id: "y-axis-1",
//       },
//       {
//         type: "linear",
//         display: true,
//         position: "right",
//         id: "y-axis-2",
//         gridLines: {
//           drawOnArea: false,
//         },
//       },
//     ],
//   },
// };

const MultiAxisLine = () => (
  <>
    <div className="header">
      <h1 className="title">Team Rating Change</h1>
      <div className="links"></div>
    </div>
    <Line data={data} />
  </>
);

export default MultiAxisLine;
