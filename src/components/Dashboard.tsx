import React, { useEffect, useState } from "react";
import UploadArea from "./UploadArea";
import { INSTANCE_DATA } from "../utils/stateManagement";
import {
  MatchSessions,
  ModdedArenaMatch,
  TeamCompDataset,
} from "../Types/ArenaTypes";
import BarChart from "./BarChart";
import {
  createBasicChartDataset,
  filterArenaMatches,
  getModdedArenaMatches,
} from "../utils/dataSetHelpers";
import { getSessions } from "../utils/sessionManagement";
import SessionSelect from "./SessionSelect";
import getTeams from "../utils/teamManagement";
import TeamSelect from "./TeamSelect";

export type dashboardProps = {
  className?: string;
};

const Dashboard: React.FC<dashboardProps> = () => {
  const [myTeams, setMyTeams] = useState<string[]>([""]);
  const [myTeamSelection, setMyTeamSelection] = useState<string>("");
  const [sessionData, setSessionData] = useState<MatchSessions>(new Map());
  const [filteredData, setFilteredData] = useState<ModdedArenaMatch[]>();
  const [sessionSelection, setSessionSelection] = useState<number[]>([0]);
  const [localStorageChanged, setLocalStorageChanged] =
    useState<boolean>(false);
  const [chartDataset, setChartDataset] = useState<TeamCompDataset>({});

  useEffect(() => {
    // Local storage match data => Modified arena match data in local state
    const localStorageMatchState = window.localStorage.getItem(INSTANCE_DATA);
    if (localStorageMatchState) {
      const parsedMatchData = JSON.parse(localStorageMatchState); // Get raw match data from storage
      const moddedMatchData = getModdedArenaMatches(parsedMatchData); // Get modified match data
      setSessionData(getSessions(moddedMatchData)); //Get session Data
      setMyTeams(getTeams(moddedMatchData)); // Get team data
    }
  }, [localStorageChanged]);

  useEffect(() => {
    // Filter modified arena match data
    if (sessionData?.size) {
      if (sessionSelection.includes(0)) {
        setFilteredData(filterArenaMatches(sessionData, myTeamSelection));
      } else {
        const selectedMatches: MatchSessions = new Map();
        sessionSelection.forEach((sessionKey) => {
          const session = sessionData.get(sessionKey);
          session && selectedMatches.set(sessionKey, session);
        });
        setFilteredData(filterArenaMatches(selectedMatches, myTeamSelection));
      }
    }
  }, [sessionData, sessionSelection, myTeamSelection]);

  useEffect(
    // Create dataset for chart component
    () =>
      filteredData && setChartDataset(createBasicChartDataset(filteredData)), // create dataset
    [filteredData]
  );

  return (
    <div className="dashboard">
      <div className="dashboard__top-bar">
        <UploadArea
          localStoreChangeHandler={setLocalStorageChanged}
          localStorageChangeValue={localStorageChanged}
        />
        <div className="dashboard__filters">
          {myTeams && (
            <TeamSelect onChange={setMyTeamSelection} teams={myTeams} />
          )}
          {sessionData && (
            <SessionSelect
              onChange={setSessionSelection}
              sessionData={sessionData}
            />
          )}
        </div>
      </div>
      {filteredData && (
        <div className="dashboard__chart-container">
          <BarChart dataset={chartDataset} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
