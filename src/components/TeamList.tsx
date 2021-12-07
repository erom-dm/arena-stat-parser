import React from "react";
import { ModdedArenaTeam } from "../Types/ArenaTypes";
import DpsIcon from "../assets/swords.png";
import HealingIcon from "../assets/heal.png";

export type teamListProps = {
  team: ModdedArenaTeam;
  className?: string;
};

const TeamList: React.FC<teamListProps> = ({ className, team }) => {
  const playerArr = Object.values(team)
    .sort((a, b) => {
      if (a && b) {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
      }
      return 1;
    })
    .map((player) => {
      if (player) {
        const {
          name: nameAndRealm,
          class: playerClass,
          damage,
          healing,
        } = player;
        const name = nameAndRealm.split("-")[0];

        return (
          <React.Fragment key={name + damage}>
            <div
              className={`team-list__player-name ${playerClass.toLowerCase()}`}
            >{`${name}: `}</div>
            <div>
              <img className="team-list__dps-icon" src={DpsIcon} alt="dps" />
              <span>{damage.toLocaleString() + " "}</span>
            </div>
            <div>
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
      return null;
    });

  return <div className={className}>{playerArr}</div>;
};

export default TeamList;
