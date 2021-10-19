import React, { useEffect, useState } from "react";
import UploadArea from "./UploadArea";
import { localStorageToState } from "../utils/stateManagement";
import PieChart from "./PieChart";
import {
  ArenaMatch,
  ModdedArenaMatch,
  ModdedArenaTeam,
} from "../Types/ArenaTypes";

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
      <UploadArea
        lcHandler={setLocalStorageChanged}
        lcVal={localStorageChanged}
      />
      {/*{matchData && <PieChart />}*/}
    </div>
  );
};

export default Dashboard;
