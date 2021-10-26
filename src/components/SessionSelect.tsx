import React from "react";
import { MatchSessions, SessionSelectOption } from "../Types/ArenaTypes";
import Select from "react-select";
import dayjs from "dayjs";

export type sessionSelectProps = {
  sessionData: MatchSessions;
};

const SessionSelect: React.FC<sessionSelectProps> = ({ sessionData }) => {
  const sessionKeys: string[] = Object.getOwnPropertyNames(sessionData);
  const sessionOptions: SessionSelectOption[] = [];

  sessionKeys.forEach((key, idx) => {
    const timestamp: number = Number(key);
    const formattedData: string = dayjs
      .unix(timestamp)
      .format("HH:mm - DD/MM/YY");
    const sessionOption = {
      value: timestamp,
      label: `Session ${idx + 1}, @ ${formattedData}`,
    };
    sessionOptions.push(sessionOption);
  });
  sessionOptions.push({ value: 0, label: "All Data" });
  sessionOptions.reverse();

  return (
    <Select
      className={"session-select"}
      classNamePrefix={"session-select"}
      options={sessionOptions}
      isMulti
    />
  );
};

export default SessionSelect;
