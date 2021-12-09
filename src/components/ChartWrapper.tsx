import React, { useEffect, useState } from "react";
import { MatchSessions, ModdedArenaMatch } from "../Types/ArenaTypes";
import TeamCompChart from "./TeamCompChart";
import LineChart from "./LineChart";
import { Routes, Route, Navigate } from "react-router-dom";
import { matchArrayFromSelectedSessions } from "../utils/dataSetHelpers";
import TeamsChart from "./TeamsChart";
import MatchList from "./MatchList";
import EmptyRoute from "./EmptyRoute";
import ClearRoute from "./ClearRoute";

export type chartContainerProps = {
  sessionData: MatchSessions;
  sessionSelection: number[];
};

const ChartWrapper: React.FC<chartContainerProps> = ({
  sessionData,
  sessionSelection,
}) => {
  const [selectedArenaMatches, setSelectedArenaMatches] = useState<
    ModdedArenaMatch[]
  >([]);

  useEffect(() => {
    if (sessionData?.size) {
      if (sessionSelection.includes(0)) {
        setSelectedArenaMatches([
          ...matchArrayFromSelectedSessions(sessionData),
        ]);
      } else {
        const selectedMatches: MatchSessions = new Map();
        sessionSelection.forEach((sessionKey) => {
          const session = sessionData.get(sessionKey);
          session && selectedMatches.set(sessionKey, session);
        });
        setSelectedArenaMatches([
          ...matchArrayFromSelectedSessions(selectedMatches),
        ]);
      }
    }
  }, [sessionData, sessionSelection]);

  return (
    <div className={"chart-wrapper"}>
      <Routes>
        <Route
          path={"/"}
          element={
            sessionData?.size ? (
              <Navigate to="/arena-stat-parser/matches" replace={true} />
            ) : null
          }
        />
        <Route
          path={"/arena-stat-parser"}
          element={
            sessionData?.size ? (
              <Navigate to="/arena-stat-parser/matches" replace={true} />
            ) : null
          }
        />
        <Route
          path={"/arena-stat-parser/matches"}
          element={<MatchList selectedArenaMatches={selectedArenaMatches} />}
        />
        <Route
          path={"/arena-stat-parser/team-comps"}
          element={
            <TeamCompChart selectedArenaMatches={selectedArenaMatches} />
          }
        />
        <Route
          path={"/arena-stat-parser/rating-change"}
          element={<LineChart selectedArenaMatches={selectedArenaMatches} />}
        />
        <Route
          path={"/arena-stat-parser/teams"}
          element={<TeamsChart selectedArenaMatches={selectedArenaMatches} />}
        />
        <Route
          path={"/arena-stat-parser/clear-storage"}
          element={
            sessionData?.size ? (
              <ClearRoute />
            ) : (
              <Navigate to="/arena-stat-parser/matches" replace={true} />
            )
          }
        />
        <Route path={"*"} element={<EmptyRoute />} />
      </Routes>
    </div>
  );
};

export default ChartWrapper;
