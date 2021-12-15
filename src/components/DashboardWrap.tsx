import React, { useState } from "react";
import Dashboard from "./Dashboard";
import { ModdedArenaMatch } from "../Types/ArenaTypes";
import { INSTANCE_DATA } from "../utils/stateManagement";
import getTeams from "../utils/teamManagement";

const DashboardWrap: React.FC = () => {
  const [, setLocalStorageChanged] = useState<boolean>(false);
  const moddedMatchData: ModdedArenaMatch[] = JSON.parse(
    window.localStorage.getItem(INSTANCE_DATA) || "[]"
  );
  const myTeams: string[] = getTeams(moddedMatchData);

  return (
    <Dashboard
      moddedMatchData={moddedMatchData}
      myTeams={myTeams}
      setLocalStorageChanged={setLocalStorageChanged}
    />
  );
};

export default DashboardWrap;
