import React, { useEffect, useState } from "react";
import {
  MatchSessions,
  ModdedArenaMatch,
  RatingChangeDataset,
  TeamCompDataset,
  TeamsDataset,
} from "../Types/ArenaTypes";
import TeamCompChart from "./TeamCompChart";
import LineChart from "./LineChart";
import {
  CHART_TYPES,
  createRatingChangeDataSet,
  createTeamCompDataSet,
  createTeamsDataSet,
  matchArrayFromSelectedSessions,
} from "../utils/dataSetHelpers";
import TeamsChart from "./TeamsChart";
import MatchList from "./MatchList";

export type chartContainerProps = {
  sessionData: MatchSessions;
  sessionSelection: number[];
  chartType: string;
};

const ChartWrapper: React.FC<chartContainerProps> = ({
  sessionData,
  sessionSelection,
  chartType,
}) => {
  const [chartDataset, setChartDataset] = useState<
    TeamCompDataset | RatingChangeDataset | TeamsDataset | ModdedArenaMatch[]
  >({});
  const [localChartType, setLocalChartType] = useState<string>("");

  useEffect(() => {
    const selectedSessionData: ModdedArenaMatch[] = [];
    if (sessionData?.size) {
      if (sessionSelection.includes(0)) {
        selectedSessionData.push(
          ...matchArrayFromSelectedSessions(sessionData)
        );
      } else {
        const selectedMatches: MatchSessions = new Map();
        sessionSelection.forEach((sessionKey) => {
          const session = sessionData.get(sessionKey);
          session && selectedMatches.set(sessionKey, session);
        });
        selectedSessionData.push(
          ...matchArrayFromSelectedSessions(selectedMatches)
        );
      }
    }

    switch (chartType) {
      case CHART_TYPES[0]:
        setChartDataset(selectedSessionData);
        break;
      case CHART_TYPES[1]:
        setChartDataset(createTeamCompDataSet(selectedSessionData));
        break;
      case CHART_TYPES[2]:
        setChartDataset(createRatingChangeDataSet(selectedSessionData));
        break;
      case CHART_TYPES[3]:
        setChartDataset(createTeamsDataSet(selectedSessionData));
        break;
      default:
        break;
    }
    setLocalChartType(chartType);
  }, [chartType, sessionData, sessionSelection]);

  return (
    <div className={"chart-wrapper"}>
      {localChartType === CHART_TYPES[0] && (
        <MatchList matches={chartDataset as ModdedArenaMatch[]} />
      )}
      {localChartType === CHART_TYPES[1] && (
        <TeamCompChart dataset={chartDataset as TeamCompDataset} />
      )}
      {localChartType === CHART_TYPES[2] && (
        <LineChart dataset={chartDataset as RatingChangeDataset} />
      )}
      {localChartType === CHART_TYPES[3] && (
        <TeamsChart dataset={chartDataset as TeamsDataset} />
      )}
    </div>
  );
};

export default ChartWrapper;
