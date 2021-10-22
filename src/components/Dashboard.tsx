import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UploadArea from "./UploadArea";
import {
  INSTANCE_DATA,
  localStorageToState,
  MY_CHAR_NAME,
  setLocalStorageField,
} from "../utils/stateManagement";
import {
  CharnameFormData,
  ModdedArenaMatch,
  TeamCompDataset,
} from "../Types/ArenaTypes";
import BarChart from "./BarChart";
import {
  createBasicChartDataset,
  filterArenaMatches,
} from "../utils/dataSetHelpers";

export type dashboardProps = {
  className?: string;
};

const Dashboard: React.FC<dashboardProps> = (props) => {
  const { register, handleSubmit } = useForm();
  const [myCharName, setMyCharName] = useState<string>("");
  const [matchData, setMatchData] = useState<ModdedArenaMatch[]>([]);
  const [localStorageChanged, setLocalStorageChanged] =
    useState<boolean>(false);
  const [chartDataset, setChartDataset] = useState<TeamCompDataset>({});
  useEffect(() => {
    localStorageToState(MY_CHAR_NAME, setMyCharName);
  }, []);
  useEffect(() => {
    const lsMatchState = window.localStorage.getItem(INSTANCE_DATA);
    const lsCharNameState = window.localStorage.getItem(MY_CHAR_NAME);
    lsMatchState &&
      lsCharNameState &&
      setMatchData(
        filterArenaMatches(
          JSON.parse(lsMatchState),
          JSON.parse(lsCharNameState),
          true
        )
      );
  }, [localStorageChanged]);
  useEffect(
    () => setChartDataset(createBasicChartDataset(matchData)), // create dataset
    [matchData]
  );

  const onSubmit = (data: CharnameFormData) => {
    setLocalStorageField(MY_CHAR_NAME, data.charName);
    setLocalStorageChanged(!localStorageChanged);
  };

  return (
    <div className="dashboard">
      <div className="dashboard__top-bar">
        <UploadArea
          localStoreChangeHandler={setLocalStorageChanged}
          localStorageChangeValue={localStorageChanged}
        />
        <div className="dashboard__filters">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              className="dashboard__charname-input"
              {...register("charName")}
              placeholder={`${myCharName}`}
            />
            <button className="dashboard__submit-charname" type="submit">
              Submit
            </button>
          </form>
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
