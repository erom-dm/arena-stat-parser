import React, { useContext, useMemo, useState } from "react";
import TeamSelect from "./TeamSelect";
import SessionSelect from "./SessionSelect";
import { filterMatchData, getSessions } from "../utils/appStateHelpers";
import {
  LsChangeContext,
  MatchDataContext,
  MyTeamsContext,
} from "./DashboardWrap";
import { MATCH_DATA_MIN } from "../utils/constants";
import { ArenaMatchCompact } from "../types/ArenaTypes";
import { useLocalStorage } from "../utils/hooks";

const ClearSessionState: React.FC = () => {
  const [, localStorageChangeHandler] = useContext(LsChangeContext);
  const matchData = useContext(MatchDataContext);
  const [compactMatchData, setCompactMatchData] = useLocalStorage<
    ArenaMatchCompact[]
  >(MATCH_DATA_MIN, []);

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

      const filteredMatches = compactMatchData.filter(
        (match) => !selectedMatches.includes(match.i)
      );

      setCompactMatchData(filteredMatches);
      localStorageChangeHandler((prevState) => !prevState);
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
