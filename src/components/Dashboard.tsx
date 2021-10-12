import React, { useState } from "react";
import UploadArea from "./UploadArea";

export type dashboardProps = {
  className?: string;
};

const Dashboard: React.FC<dashboardProps> = (props) => {
  let [output, setOutput] = useState(null);

  return (
    <div className="dashboard">
      <UploadArea setOutput={setOutput} />
      {output && (
        <div className={"dashboard__output"}>{JSON.stringify(output)}</div>
      )}
    </div>
  );
};

export default Dashboard;
