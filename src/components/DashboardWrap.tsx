import React, { useState } from "react";
import Dashboard from "./Dashboard";
import { ArenaMatch, ArenaMatchCompact } from "../types/ArenaTypes";
import { unfoldCompactMatchData } from "../utils/localStorageManagement";
import { INSTANCE_DATA } from "../utils/constants";
import { getMyTeamNames } from "../utils/miscHelperFunctions";

export const MatchDataContext = React.createContext<ArenaMatch[]>([]);
export const MyTeamsContext = React.createContext<string[]>([]);
export const LsChangeContext = React.createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>([false, () => {}]);

const DashboardWrap: React.FC = () => {
  const [localStorageChanged, setLocalStorageChanged] =
    useState<boolean>(false);
  const matchDataCompact: ArenaMatchCompact[] = JSON.parse(
    window.localStorage.getItem(INSTANCE_DATA) || "[]"
  );
  const matchData = unfoldCompactMatchData(matchDataCompact);
  const myTeams = getMyTeamNames(matchData);

  return (
    <LsChangeContext.Provider
      value={[localStorageChanged, setLocalStorageChanged]}
    >
      <MatchDataContext.Provider value={matchData}>
        <MyTeamsContext.Provider value={myTeams}>
          <Dashboard />
        </MyTeamsContext.Provider>
      </MatchDataContext.Provider>
    </LsChangeContext.Provider>
  );
};

export default DashboardWrap;
