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
  ArenaMatch,
  CharnameFormData,
  MatchSessions,
  ModdedArenaMatch,
  TeamCompDataset,
} from "../Types/ArenaTypes";
import BarChart from "./BarChart";
import {
  createBasicChartDataset,
  filterArenaMatches,
} from "../utils/dataSetHelpers";
import { getSessions } from "../utils/dateManagement";
import SessionSelect from "./SessionSelect";

export type dashboardProps = {
  className?: string;
};

const Dashboard: React.FC<dashboardProps> = () => {
  const { register, handleSubmit } = useForm();
  const [myCharName, setMyCharName] = useState<string>("");
  const [matchData, setMatchData] = useState<ModdedArenaMatch[]>([]);
  const [sessionData, setSessionData] = useState<MatchSessions>({});
  const [sessionSelection, setSessionSelection] = useState<number[]>([0]);
  const [localStorageChanged, setLocalStorageChanged] =
    useState<boolean>(false);
  const [chartDataset, setChartDataset] = useState<TeamCompDataset>({});

  useEffect(() => {
    localStorageToState(MY_CHAR_NAME, setMyCharName);
  }, []);
  useEffect(() => {
    const lsMatchState = window.localStorage.getItem(INSTANCE_DATA);
    const lsCharNameState = window.localStorage.getItem(MY_CHAR_NAME);
    const stateIsPresent = lsMatchState && lsCharNameState;
    if (stateIsPresent) {
      const parsedMatchData = JSON.parse(lsMatchState);
      const parsedCharData = JSON.parse(lsCharNameState);
      stateIsPresent && setSessionData(getSessions(parsedMatchData));
      if (sessionSelection.includes(0)) {
        setMatchData(filterArenaMatches(parsedMatchData, parsedCharData, true));
      } else {
        const selectedMatches: ArenaMatch[] = [];
        sessionSelection.forEach((sessionKey) => {
          selectedMatches.push(...sessionData[sessionKey]);
        });
        setMatchData(filterArenaMatches(selectedMatches, parsedCharData, true));
      }
    }
  }, [localStorageChanged, sessionSelection]);
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
          {sessionData && (
            <SessionSelect
              onChange={setSessionSelection}
              sessionData={sessionData}
            />
          )}
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
