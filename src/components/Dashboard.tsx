import React, { useMemo, useState, Suspense } from "react";
import UploadArea from "./UploadArea";
import { ArenaMatch } from "../Types/ArenaTypes";
import { filterMatchData } from "../utils/dataSetHelpers";
import { getSessions } from "../utils/sessionManagement";
import SuspenseFallback from "./SuspenseFallback";
import ChartWrapper from "./ChartWrapper";
import { sampleDataToLocalStorage } from "../utils/stateManagement";
const SettingsModal = React.lazy(() => import("./SettingsModal"));
const Toolbar = React.lazy(() => import("./ToolBar"));

export type dashboardProps = {
  matchData: ArenaMatch[];
  myTeams: string[];
  setLocalStorageChanged: React.Dispatch<React.SetStateAction<boolean>>;
};

const Dashboard: React.FC<dashboardProps> = ({
  matchData,
  myTeams,
  setLocalStorageChanged,
}) => {
  const matchDataIsEmpty = !matchData.length;
  const [myTeamSelection, setMyTeamSelection] = useState<string>(
    myTeams?.length ? myTeams[0] : ""
  );
  const [sessionSelection, setSessionSelection] = useState<number[]>([0]);

  const sessionData = useMemo(
    () => matchData && getSessions(filterMatchData(matchData, myTeamSelection)),
    [myTeamSelection, matchData]
  );

  if (matchDataIsEmpty) {
    return (
      <div className={`dashboard dashboard--no-match-data`}>
        <Suspense fallback={<SuspenseFallback />}>
          <div className={`dashboard__btn-wrap`}>
            <UploadArea localStoreChangeHandler={setLocalStorageChanged} />
            <button
              className={"toolbar__sample-data-button"}
              onClick={() => sampleDataToLocalStorage(setLocalStorageChanged)}
            >
              Or click here to use sample data instead!
            </button>
          </div>
        </Suspense>
      </div>
    );
  }
  return (
    <div className={`dashboard`}>
      <Suspense fallback={<SuspenseFallback />}>
        <UploadArea localStoreChangeHandler={setLocalStorageChanged} />
        {!matchDataIsEmpty && (
          <SettingsModal localStoreChangeHandler={setLocalStorageChanged} />
        )}
        <div className="dashboard__toolbar-wrap">
          <Toolbar
            myTeams={myTeams}
            sessionData={sessionData}
            setSessionSelection={setSessionSelection}
            setLocalStorageChanged={setLocalStorageChanged}
            setMyTeamSelection={setMyTeamSelection}
          />
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
