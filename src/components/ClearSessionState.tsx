import React, { useContext, useMemo, useState } from "react";
import TeamSelect from "./TeamSelect";
import SessionSelect from "./SessionSelect";
import { getSessions } from "../utils/sessionManagement";
import { filterMatchData } from "../utils/dataSetHelpers";
import {
  LsChangeContext,
  MatchDataContext,
  MyTeamsContext,
} from "./DashboardWrap";
import { INSTANCE_DATA } from "../utils/constants";
import { setLocalStorageField } from "../utils/stateManagement";
import { ArenaMatchCompact } from "../Types/ArenaTypes";

const ClearSessionState: React.FC = () => {
  const [, localStoreChangeHandler] = useContext(LsChangeContext);
  const matchData = useContext(MatchDataContext);

  const myTeams = useContext(MyTeamsContext);
  const [myTeamSelection, setMyTeamSelection] = useState<string>("");
  const sessionData = useMemo(
    () => matchData && getSessions(filterMatchData(matchData, myTeamSelection)),
    [myTeamSelection, matchData]
  );
  const [sessionSelection, setSessionSelection] = useState<number[]>([]);

  const clickHandler = () => {
    if (sessionSelection.length) {
      const selectedMatches = sessionSelection
        .map((sessionKey) => sessionData.get(sessionKey))
        .flat()
        .map((match) => {
          return match?.matchID;
        });

      const matchDataCompact: ArenaMatchCompact[] = JSON.parse(
        window.localStorage.getItem(INSTANCE_DATA) || "[]"
      );
      const filteredMatches = matchDataCompact.filter(
        (match) => !selectedMatches.includes(match.i)
      );

      setLocalStorageField(INSTANCE_DATA, filteredMatches);
      localStoreChangeHandler((prevState) => !prevState);
    }
  };

  return (
    <div className="settings-group__wrap">
      <span className="settings-group__text">Clear selected session data</span>
      <div className="settings-group__selection-wrap">
        {myTeams && (
          <TeamSelect
            onChange={setMyTeamSelection}
            teams={myTeams}
            menuPlacement={"top"}
            setDefaultValue={false}
          />
        )}
        {sessionData && (
          <SessionSelect
            onChange={setSessionSelection}
            sessionData={sessionData}
            menuPlacement={"top"}
            setDefaultValue={false}
          />
        )}
        <button
          className={"clear-session-state-button settings-button"}
          onClick={clickHandler}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default ClearSessionState;
