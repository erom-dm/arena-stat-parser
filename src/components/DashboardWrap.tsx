import React, { useState } from "react";
import Dashboard from "./Dashboard";
import { ArenaMatchCompact } from "../Types/ArenaTypes";
import { unfoldCompactMatchData } from "../utils/stateManagement";
import { getMyTeamNames } from "../utils/dataSetHelpers";
import { INSTANCE_DATA } from "../utils/constants";

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
