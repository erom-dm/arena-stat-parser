import React, { useMemo, useState, Suspense, useContext } from "react";
import UploadArea from "./UploadArea";
import { filterMatchData, getSessions } from "../utils/appStateHelpers";
import SuspenseFallback from "./SuspenseFallback";
import ChartWrapper from "./ChartWrapper";
import { sampleDataToLocalStorage } from "../utils/localStorageManagement";
import {
  LsChangeContext,
  MatchDataContext,
  MyTeamsContext,
} from "./DashboardWrap";
const SettingsModal = React.lazy(() => import("./SettingsModal"));
const Toolbar = React.lazy(() => import("./ToolBar"));

const Dashboard: React.FC = () => {
  const [, setLocalStorageChanged] = useContext(LsChangeContext);
  const matchData = useContext(MatchDataContext);
  const myTeams = useContext(MyTeamsContext);
  const matchDataIsEmpty = !matchData.length;
  const [myTeamSelection, setMyTeamSelection] = useState<string>(
    myTeams?.length ? myTeams[0] : ""
  );
  const [sessionSelection, setSessionSelection] = useState<number[]>([0]);

  // current session data to be displayed in session selection
  const sessionData = useMemo(
    () => matchData && getSessions(filterMatchData(matchData, myTeamSelection)),
    [myTeamSelection, matchData]
  );

  if (matchDataIsEmpty) {
    return (
      <div className={`dashboard dashboard--no-match-data`}>
        <Suspense fallback={<SuspenseFallback />}>
          <div className={`dashboard__btn-wrap`}>
            <UploadArea />
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
        <UploadArea />
        {!matchDataIsEmpty && <SettingsModal />}
        <div className="dashboard__toolbar-wrap">
          <Toolbar
            sessionData={sessionData}
            setSessionSelection={setSessionSelection}
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
