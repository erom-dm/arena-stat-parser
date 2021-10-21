import React, { useEffect, useState } from "react";
import UploadArea from "./UploadArea";
import { localStorageToState } from "../utils/stateManagement";
import { ModdedArenaMatch, TeamCompDataset } from "../Types/ArenaTypes";
import BarChart from "./BarChart";
import { createBasicChartDataset } from "../utils/dataSetHelpers";

export type dashboardProps = {
  className?: string;
};

const Dashboard: React.FC<dashboardProps> = (props) => {
  let [matchData, setMatchData] = useState<ModdedArenaMatch[]>([]);
  let [localStorageChanged, setLocalStorageChanged] = useState<boolean>(false);
  let [chartDataset, setChartDataset] = useState<TeamCompDataset>({});
  useEffect(() => localStorageToState(setMatchData), [localStorageChanged]);
  useEffect(
    () => setChartDataset(createBasicChartDataset(matchData)),
    [matchData]
  );

  return (
    <div className="dashboard">
      <div className="dashboard__top-bar">
        <UploadArea
          lcHandler={setLocalStorageChanged}
          lcVal={localStorageChanged}
        />
        <div className="dashboard__filters">
          <div className="dashboard__filters-btn" onClick={() => {}}>
            All data
          </div>
          <div className="dashboard__filters-btn">Last session</div>
        </div>
      </div>
      {matchData && (
        <div className="dashboard__chart-container">
          <BarChart dataset={chartDataset} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
