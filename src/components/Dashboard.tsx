import React, { useEffect, useState } from "react";
import UploadArea from "./UploadArea";
import { localStorageToState } from "../utils/stateManagement";
import PieChart from "./PieChart";
import { ModdedArenaMatch } from "../Types/ArenaTypes";

export type dashboardProps = {
  className?: string;
};

const Dashboard: React.FC<dashboardProps> = (props) => {
  let [matchData, setMatchData] = useState<ModdedArenaMatch[] | null>(null);
  let [localStorageChanged, setLocalStorageChanged] = useState(false);
  useEffect(() => localStorageToState(setMatchData), [localStorageChanged]);
  //TODO:
  useEffect(() => console.log(), [matchData]);
  //
  // const a = ["Mage", "Rouge"];
  // const b = ["Rogue", "Mage"];
  // const c = ["Mage", "Priest"];

  return (
    <div className="dashboard">
      <div className="dashboard__top-bar">
        <UploadArea
          lcHandler={setLocalStorageChanged}
          lcVal={localStorageChanged}
        />
        <div className="dashboard__filters">
          <div className="dashboard__filters-btn">All data</div>
          <div className="dashboard__filters-btn">Last session</div>
        </div>
      </div>
      {matchData && (
        <div className="dashboard__chart-container">
          <PieChart />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
