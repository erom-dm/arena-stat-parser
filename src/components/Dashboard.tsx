import React, { useEffect, useState } from "react";
import UploadArea from "./UploadArea";
import { localStorageToState } from "../utils/stateManagement";

export type dashboardProps = {
  className?: string;
};

const Dashboard: React.FC<dashboardProps> = (props) => {
  let [output, setOutput] = useState(null);
  let [localStorageChanged, setLocalStorageChanged] = useState(false);
  useEffect(() => localStorageToState(setOutput), [localStorageChanged]);

  return (
    <div className="dashboard">
      <UploadArea
        lcHandler={setLocalStorageChanged}
        lcVal={localStorageChanged}
      />
      {output && (
        <div className={"dashboard__output"}>{JSON.stringify(output)}</div>
      )}
    </div>
  );
};

export default Dashboard;
