import React from "react";
import { ArenaMatch } from "../Types/ArenaTypes";
import dayjs from "dayjs";
import TeamList from "./TeamList";

export type matchItemProps = {
  match: ArenaMatch;
};

const MatchItem: React.FC<matchItemProps> = ({ match }) => {
  const { enteredTime, instanceID, win, myTeam, enemyTeam } = match;
  const {
    teamName: myTeamName,
    teamMMR: myMMR,
    teamRating: myRating,
    newTeamRating: myNewRating,
  } = myTeam;
  const {
    teamName: enemyTeamName,
    teamMMR: enemyMMR,
    teamRating: enemyRating,
    newTeamRating: enemyNewRating,
  } = enemyTeam;
  const myRatingChange = myNewRating - myRating;
  const enemyRatingChange = enemyNewRating - enemyRating;

  const enemyTeamRealm = enemyTeam.players[0]?.name.split("-")[1];

  const date = dayjs.unix(enteredTime).format("DD/MM/YY HH:mm");
  const myRatingChangeString =
    myRatingChange >= 0
      ? ` (+${myRatingChange})`
      : ` (-${Math.abs(myRatingChange)})`;
  const enemyRatingChangeString =
    enemyRatingChange >= 0
      ? ` (+${enemyRatingChange})`
      : ` (-${Math.abs(enemyRatingChange)})`;

  return (
    <div className={`match-item instance-${instanceID}`} key={enteredTime}>
      <div className="match-item__team-wrapper">
        <div className={`match-item__team team-left ${win ? "win" : "loss"}`}>
          <div className="match-item__team-header">
            <div className="match-item__team-name">{myTeamName}</div>
            <div className="match-item__team-rating">
              <span>{`TR: ${myRating}`}</span>
              <span
                className={`match-item__rating-change ${win ? "win" : "loss"}`}
              >
                {myRatingChangeString}
              </span>
              <span className="match-item__mmr-span">{`MMR: ${myMMR}`}</span>
            </div>
          </div>
          <TeamList
            team={myTeam.players}
            className={"team-list team-list--my-team"}
          />
        </div>
        <div className={`match-item__team team-right`}>
          <div className="match-item__team-header">
            <div className="match-item__team-name">{enemyTeamName}</div>
            <div className="match-item__team-rating">
              <span>{`TR: ${enemyRating}`}</span>
              <span
                className={`match-item__rating-change ${!win ? "win" : "loss"}`}
              >
                {enemyRatingChangeString}
              </span>
              <span className="match-item__mmr-span">{` MMR: ${enemyMMR}`}</span>
            </div>
          </div>
          <TeamList
            team={enemyTeam.players}
            className={"team-list team-list--enemy-team"}
          />
        </div>
      </div>
      <div className="match-item__footer">
        <div className="match-item__date">{date}</div>
        <div className="match-item__enemy-team-realm">{enemyTeamRealm}</div>
      </div>
    </div>
  );
};

export default MatchItem;
