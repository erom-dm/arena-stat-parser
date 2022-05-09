import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import { ArenaMatch, ArenaMatchCompact } from "../types/ArenaTypes";
import { unfoldCompactMatchData } from "../utils/localStorageManagement";
import { MATCH_DATA_MIN } from "../utils/constants";
import { getMyTeamNames } from "../utils/miscHelperFunctions";
import { useLocalStorage } from "../utils/hooks";

export const MatchDataContext = React.createContext<ArenaMatch[]>([]);
export const MyTeamsContext = React.createContext<string[]>([]);
export const LsChangeContext = React.createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>([false, () => {}]);

const DashboardWrap: React.FC = () => {
  const [localStorageChanged, setLocalStorageChanged] =
    useState<boolean>(false);
  const [compactMatchData, setCompactMatchData, refreshState] = useLocalStorage<
    ArenaMatchCompact[]
  >(MATCH_DATA_MIN, []);
  const matchData = unfoldCompactMatchData(compactMatchData);
  const myTeams = getMyTeamNames(matchData);

  useEffect(() => {
    refreshState();
  }, [localStorageChanged]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LsChangeContext.Provider
      value={[localStorageChanged, setLocalStorageChanged]}
    >
      <MatchDataContext.Provider value={matchData}>
        <MyTeamsContext.Provider value={myTeams}>
          <Dashboard
            compactMatchData={compactMatchData}
            setCompactMatchData={setCompactMatchData}
          />
        </MyTeamsContext.Provider>
      </MatchDataContext.Provider>
    </LsChangeContext.Provider>
  );
};

export default DashboardWrap;
