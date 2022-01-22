import React from "react";
import { Player } from "../Types/ArenaTypes";
import DpsIcon from "../assets/swords.png";
import HealingIcon from "../assets/heal.png";

export type teamListProps = {
  team: (Player | null)[];
  className?: string;
};

const TeamList: React.FC<teamListProps> = ({ className, team }) => {
  const playerArr = team.map((player) => {
    if (player) {
      const {
        name: nameAndRealm,
        class: playerClass,
        damage,
        healing,
        race,
      } = player;
      const name = nameAndRealm.split("-")[0];

      //TODO: add race icon
      return (
        <React.Fragment key={name + damage}>
          <div
            className={`team-list__player-name ${playerClass.toLowerCase()}`}
          >{`${name}: `}</div>
          <div className={"team-list__player-damage"}>
            <img className="team-list__dps-icon" src={DpsIcon} alt="dps" />
            <span>{damage.toLocaleString() + " "}</span>
          </div>
          <div className={"team-list__player-healing"}>
            <img
              className="team-list__heal-icon"
              src={HealingIcon}
              alt="heal"
            />
            <span>{healing.toLocaleString()}</span>
          </div>
        </React.Fragment>
      );
    }
    //TODO: return DC fragment?
    return null;
  });

  return <div className={className}>{playerArr}</div>;
};

export default TeamList;
