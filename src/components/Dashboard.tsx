import React, { useEffect, useState } from "react";
import UploadArea from "./UploadArea";
import { INSTANCE_DATA } from "../utils/stateManagement";
import { MatchSessions, ModdedArenaMatch } from "../Types/ArenaTypes";
import {
  getModdedArenaMatches,
  filterMatchData,
  CHART_TYPES,
} from "../utils/dataSetHelpers";
import { getSessions } from "../utils/sessionManagement";
import SessionSelect from "./SessionSelect";
import getTeams from "../utils/teamManagement";
import TeamSelect from "./TeamSelect";
import ButtonGroup from "./ButtonGroup";
import ChartWrapper from "./ChartWrapper";

export type dashboardProps = {
  className?: string;
};

const Dashboard: React.FC<dashboardProps> = () => {
  const [moddedMatchData, setModdedMatchData] = useState<ModdedArenaMatch[]>(
    []
  );
  const [myTeams, setMyTeams] = useState<string[]>([""]);
  const [myTeamSelection, setMyTeamSelection] = useState<string>("");
  const [sessionData, setSessionData] = useState<MatchSessions>(new Map());
  const [sessionSelection, setSessionSelection] = useState<number[]>([0]);
  const [chartType, setChartType] = useState<string>(CHART_TYPES[0]);
  const [localStorageChanged, setLocalStorageChanged] =
    useState<boolean>(false);

  useEffect(() => {
    // Local storage match data => Modified arena match data in local state
    const localStorageMatchState = window.localStorage.getItem(INSTANCE_DATA);
    if (localStorageMatchState) {
      const parsedMatchData = JSON.parse(localStorageMatchState); // Get raw match data from storage
      const moddedMatchData = getModdedArenaMatches(parsedMatchData); // Get modified match data
      setModdedMatchData(moddedMatchData); // Put all modified match data in local state
      setMyTeams(getTeams(moddedMatchData)); // Get team data
    }
  }, [localStorageChanged]);

  useEffect(() => {
    // Apply filters to modded match data and create session data based on result
    const filteredMatchData = filterMatchData(moddedMatchData, myTeamSelection);
    setSessionData(getSessions(filteredMatchData));
    setSessionSelection([0]);
  }, [moddedMatchData, myTeamSelection]);

  return (
    <div className="dashboard">
      <div className="dashboard__top-bar">
        <UploadArea
          localStoreChangeHandler={setLocalStorageChanged}
          localStorageChangeValue={localStorageChanged}
        />
        <div className="dashboard__filters">
          <ButtonGroup
            onChange={setChartType}
            buttonLabels={CHART_TYPES}
            selected={chartType}
          />
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
      {moddedMatchData && (
        <ChartWrapper
          sessionData={sessionData}
          sessionSelection={sessionSelection}
          chartType={chartType}
        />
      )}
    </div>
  );
};

export default Dashboard;
