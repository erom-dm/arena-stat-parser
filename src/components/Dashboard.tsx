import React, { useMemo, useState } from "react";
import UploadArea from "./UploadArea";
import { sampleDataToLocalStorage } from "../utils/stateManagement";
import { ModdedArenaMatch } from "../Types/ArenaTypes";
import { CHART_ROUTES, filterMatchData } from "../utils/dataSetHelpers";
import SessionSelect from "./SessionSelect";
import TeamSelect from "./TeamSelect";
import ButtonGroup from "./ButtonGroup";
import ChartWrapper from "./ChartWrapper";
import SettingsModal from "./SettingsModal";
import { getSessions } from "../utils/sessionManagement";

export type dashboardProps = {
  moddedMatchData: ModdedArenaMatch[];
  myTeams: string[];
  setLocalStorageChanged: React.Dispatch<React.SetStateAction<boolean>>;
};

const Dashboard: React.FC<dashboardProps> = ({
  moddedMatchData,
  myTeams,
  setLocalStorageChanged,
}) => {
  const matchDataIsEmpty = !moddedMatchData.length;
  const [myTeamSelection, setMyTeamSelection] = useState<string>(
    myTeams?.length ? myTeams[0] : ""
  );
  const [sessionSelection, setSessionSelection] = useState<number[]>([0]);
  const sessionData = useMemo(
    () =>
      moddedMatchData &&
      getSessions(filterMatchData(moddedMatchData, myTeamSelection)),
    [myTeamSelection, moddedMatchData]
  );

  return (
    <div className="dashboard">
      <div className="dashboard__top-bar">
        <UploadArea localStoreChangeHandler={setLocalStorageChanged} />
        {matchDataIsEmpty && (
          <button
            className={"dashboard__sample-data-button"}
            onClick={() => sampleDataToLocalStorage(setLocalStorageChanged)}
          >
            Or use this sample data instead!
          </button>
        )}
        {!matchDataIsEmpty && (
          <div className="dashboard__filters">
            <ButtonGroup buttonLabels={CHART_ROUTES} />
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
        {!matchDataIsEmpty && (
          <SettingsModal localStoreChangeHandler={setLocalStorageChanged} />
        )}
      </div>

      <ChartWrapper
        sessionData={sessionData}
        sessionSelection={sessionSelection}
      />
    </div>
  );
};

export default Dashboard;
