import React from "react";
import { ModdedArenaMatch } from "../Types/ArenaTypes";
import MatchItem from "./MatchItem";

export type matchListProps = {
  matches: ModdedArenaMatch[];
};

const MatchList: React.FC<matchListProps> = ({ matches }) => {
  const MatchItems = matches
    .sort((a, b) => b.enteredTime - a.enteredTime)
    .map((match) => <MatchItem match={match} />);

  return <div className="match-list">{MatchItems}</div>;
};

export default MatchList;
