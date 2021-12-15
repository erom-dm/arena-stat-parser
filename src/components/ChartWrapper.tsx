import React, { useEffect, useState } from "react";
import { MatchSessions, ModdedArenaMatch } from "../Types/ArenaTypes";
import TeamCompChart from "./TeamCompChart";
import LineChart from "./LineChart";
import { Routes, Route, Navigate } from "react-router-dom";
import { matchArrayFromSelectedSessions } from "../utils/dataSetHelpers";
import TeamsChart from "./TeamsChart";
import MatchList from "./MatchList";
import EmptyRoute from "./EmptyRoute";

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
            sessionData?.size ? <Navigate to="/matches" replace={true} /> : null
          }
        />
        <Route
          path={"/matches"}
          element={<MatchList selectedArenaMatches={selectedArenaMatches} />}
        />
        <Route
          path={"/team-comps"}
          element={
            <TeamCompChart selectedArenaMatches={selectedArenaMatches} />
          }
        />
        <Route
          path={"/rating-change"}
          element={<LineChart selectedArenaMatches={selectedArenaMatches} />}
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
