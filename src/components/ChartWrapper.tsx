import React, { useEffect, useState } from "react";
import {ArenaMatch, MatchSessions} from "../Types/ArenaTypes";
import { Routes, Route, Navigate } from "react-router-dom";
import { matchArrayFromSelectedSessions } from "../utils/dataSetHelpers";
const MatchupChart = React.lazy(() => import("./MatchupChart"));
const LineChart = React.lazy(() => import("./LineChart"));
const TeamsChart = React.lazy(() => import("./TeamsChart"));
const MatchList = React.lazy(() => import("./MatchList"));
const EmptyRoute = React.lazy(() => import("./EmptyRoute"));

export type chartContainerProps = {
  sessionData: MatchSessions;
  sessionSelection: number[];
};

const ChartWrapper: React.FC<chartContainerProps> = ({
  sessionData,
  sessionSelection,
}) => {
  const [selectedArenaMatches, setSelectedArenaMatches] = useState<
    ArenaMatch[]
  >([]);
  const [selectedSessions, setSelectedSessions] = useState<MatchSessions>(
    new Map()
  );

  useEffect(() => {
    if (sessionData?.size) {
      if (sessionSelection.includes(0)) {
        setSelectedArenaMatches([
          ...matchArrayFromSelectedSessions(sessionData),
        ]);
        setSelectedSessions(sessionData);
      } else {
        const selectedMatches: MatchSessions = new Map();
        sessionSelection.forEach((sessionKey) => {
          const session = sessionData.get(sessionKey);
          session && selectedMatches.set(sessionKey, session);
        });
        setSelectedArenaMatches([
          ...matchArrayFromSelectedSessions(selectedMatches),
        ]);
        setSelectedSessions(selectedMatches);
      }
    }
  }, [sessionData, sessionSelection]);

  return (
    <div className={"chart-wrapper"}>
      <Routes>
        <Route
          path={"/"}
          element={
            sessionData?.size ? <Navigate to="/matches" replace={true} /> : null
          }
        />
        <Route
          path={"/matches"}
          element={<MatchList selectedArenaMatches={selectedArenaMatches} />}
        />
        <Route
          path={"/team-comps"}
          element={<MatchupChart selectedArenaMatches={selectedArenaMatches} />}
        />
        <Route
          path={"/rating-change"}
          element={
            <LineChart
              selectedArenaMatches={selectedArenaMatches}
              selectedSessions={selectedSessions}
            />
          }
        />
        <Route
          path={"/teams"}
          element={<TeamsChart selectedArenaMatches={selectedArenaMatches} />}
        />
        <Route path={"*"} element={<EmptyRoute />} />
      </Routes>
    </div>
  );
};

export default ChartWrapper;
