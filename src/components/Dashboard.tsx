import React, { useEffect, useState } from "react";
import UploadArea from "./UploadArea";
import {
  INSTANCE_DATA,
  sampleDataToLocalStorage,
} from "../utils/stateManagement";
import { MatchSessions, ModdedArenaMatch } from "../Types/ArenaTypes";
import { filterMatchData, CHART_TYPES } from "../utils/dataSetHelpers";
import { getSessions } from "../utils/sessionManagement";
import SessionSelect from "./SessionSelect";
import getTeams from "../utils/teamManagement";
import TeamSelect from "./TeamSelect";
import ButtonGroup from "./ButtonGroup";
import ChartWrapper from "./ChartWrapper";
import SettingsModal from "./SettingsModal";

export type dashboardProps = {
  className?: string;
};

const Dashboard: React.FC<dashboardProps> = () => {
  const [moddedMatchData, setModdedMatchData] = useState<ModdedArenaMatch[]>();
  const [myTeams, setMyTeams] = useState<string[]>([""]);
  const [myTeamSelection, setMyTeamSelection] = useState<string>("");
  const [sessionData, setSessionData] = useState<MatchSessions>(new Map());
  const [sessionSelection, setSessionSelection] = useState<number[]>([0]);
  const [localStorageChanged, setLocalStorageChanged] =
    useState<boolean>(false);

  useEffect(() => {
    // Local storage match data => Modified arena match data in local state
    const localStorageMatchState = window.localStorage.getItem(INSTANCE_DATA);
    if (localStorageMatchState) {
      const moddedMatchData = JSON.parse(localStorageMatchState); // Get raw match data from storage
      setModdedMatchData(moddedMatchData); // Put all modified match data in local state
      setMyTeams(getTeams(moddedMatchData)); // Get team data
    }
  }, [localStorageChanged]);

  useEffect(() => {
    // Apply filters to modded match data and create session data based on result
    if (moddedMatchData) {
      const filteredMatchData = filterMatchData(
        moddedMatchData,
        myTeamSelection
      );
      setSessionData(getSessions(filteredMatchData));
      setSessionSelection([0]);
    }
  }, [moddedMatchData, myTeamSelection]);

  return (
    <div className="dashboard">
      <div className="dashboard__top-bar">
        <UploadArea localStoreChangeHandler={setLocalStorageChanged} />
        {!moddedMatchData && (
          <button
            className={"dashboard__sample-data-button"}
            onClick={() => sampleDataToLocalStorage(setLocalStorageChanged)}
          >
            Or use this sample data instead!
          </button>
        )}
        {moddedMatchData && (
          <div className="dashboard__filters">
            <ButtonGroup buttonLabels={CHART_TYPES} />
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
        )}
        {moddedMatchData && (
          <SettingsModal localStoreChangeHandler={setLocalStorageChanged} />
        )}
      </div>
      {moddedMatchData && (
        <ChartWrapper
          sessionData={sessionData}
          sessionSelection={sessionSelection}
        />
      )}
    </div>
  );
};

export default Dashboard;
