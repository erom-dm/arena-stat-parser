import React, { useMemo, useState, Suspense } from "react";
import UploadArea from "./UploadArea";
import { sampleDataToLocalStorage } from "../utils/stateManagement";
import { ModdedArenaMatch } from "../Types/ArenaTypes";
import { CHART_ROUTES, filterMatchData } from "../utils/dataSetHelpers";
import { getSessions } from "../utils/sessionManagement";
import SuspenseFallback from "./SuspenseFallback";
const SessionSelect = React.lazy(() => import("./SessionSelect"));
const TeamSelect = React.lazy(() => import("./TeamSelect"));
const ButtonGroup = React.lazy(() => import("./ButtonGroup"));
const ChartWrapper = React.lazy(() => import("./ChartWrapper"));
const SettingsModal = React.lazy(() => import("./SettingsModal"));

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
      <Suspense fallback={SuspenseFallback}>
        <UploadArea localStoreChangeHandler={setLocalStorageChanged} />
        <div className="dashboard__top-bar">
          <div className="dashboard__top-bar-wrap">
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
        </div>

        <ChartWrapper
          sessionData={sessionData}
          sessionSelection={sessionSelection}
        />
      </Suspense>
    </div>
  );
};

export default Dashboard;
