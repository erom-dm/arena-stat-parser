import React, { useEffect, useState } from "react";
import {
  MatchSessions,
  ModdedArenaMatch,
  RatingChangeDataset,
  TeamCompDataset,
} from "../Types/ArenaTypes";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import {
  CHART_TYPES,
  createRatingChangeDataSet,
  createTeamCompDataSet,
  matchArrayFromSelectedSessions,
} from "../utils/dataSetHelpers";

export type chartContainerProps = {
  sessionData: MatchSessions;
  sessionSelection: number[];
  chartType: string;
};

const ChartContainer: React.FC<chartContainerProps> = ({
  sessionData,
  sessionSelection,
  chartType,
}) => {
  const [chartDataset, setChartDataset] = useState<
    TeamCompDataset | RatingChangeDataset
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
      case CHART_TYPES[0]: // "Team comps"
        setChartDataset(createTeamCompDataSet(selectedSessionData));
        break;
      case CHART_TYPES[1]: // "Rating change"]
        setChartDataset(createRatingChangeDataSet(selectedSessionData));
        break;
      default:
        break;
    }
    setLocalChartType(chartType);
  }, [chartType, sessionData, sessionSelection]);

  return (
    <div className={"dashboard__chart-container"}>
      {localChartType === "Team comps" && (
        <BarChart dataset={chartDataset as TeamCompDataset} />
      )}
      {localChartType === "Rating change" && (
        <LineChart dataset={chartDataset as RatingChangeDataset} />
      )}
    </div>
  );
};

export default ChartContainer;
