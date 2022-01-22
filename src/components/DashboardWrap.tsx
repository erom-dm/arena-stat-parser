import React, { useState } from "react";
import Dashboard from "./Dashboard";
import { ArenaMatchCompact } from "../Types/ArenaTypes";
import {
  INSTANCE_DATA,
  unfoldCompactMatchData,
} from "../utils/stateManagement";
import { getMyTeamNames } from "../utils/dataSetHelpers";

const DashboardWrap: React.FC = () => {
  const [, setLocalStorageChanged] = useState<boolean>(false);
  const matchDataCompact: ArenaMatchCompact[] = JSON.parse(
    window.localStorage.getItem(INSTANCE_DATA) || "[]"
  );
  const matchData = unfoldCompactMatchData(matchDataCompact);
  const myTeams = getMyTeamNames(matchData);

  return (
    <Dashboard
      matchData={matchData}
      myTeams={myTeams}
      setLocalStorageChanged={setLocalStorageChanged}
    />
  );
};

export default DashboardWrap;
