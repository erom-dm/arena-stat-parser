import React from "react";
import { Player } from "../types/ArenaTypes";
import DpsIcon from "../assets/swords.png";
import HealingIcon from "../assets/heal.png";
import BloodElfIcon from "../assets/charRaceIcons/bloodelf.png";
import DraeneiIcon from "../assets/charRaceIcons/draenei.png";
import DwarfIcon from "../assets/charRaceIcons/dwarf.png";
import GnomeIcon from "../assets/charRaceIcons/gnome.png";
import HumanIcon from "../assets/charRaceIcons/human.png";
import NightElfIcon from "../assets/charRaceIcons/nightelf.png";
import OrcIcon from "../assets/charRaceIcons/orc.png";
import TaurenIcon from "../assets/charRaceIcons/tauren.png";
import TrollIcon from "../assets/charRaceIcons/troll.png";
import UndeadIcon from "../assets/charRaceIcons/undead.png";

export type teamListProps = {
  team: (Player | null)[];
  className?: string;
};

export const raceIconMap = {
  Bloodelf: BloodElfIcon,
  Draenei: DraeneiIcon,
  Dwarf: DwarfIcon,
  Gnome: GnomeIcon,
  Human: HumanIcon,
  Nightelf: NightElfIcon,
  Orc: OrcIcon,
  Tauren: TaurenIcon,
  Troll: TrollIcon,
  Undead: UndeadIcon,
};

const TeamList: React.FC<teamListProps> = ({ className, team }) => {
  const playerArr = team.map((player, idx) => {
    if (player) {
      const {
        name: nameAndRealm,
        class: playerClass,
        damage,
        healing,
        race,
      } = player;
      const name = nameAndRealm.split("-")[0];

      return (
        <React.Fragment key={name + damage}>
          <div
            className={`team-list__player-name ${playerClass.toLowerCase()}`}
          >
            {race && (
              <img
                className={"team-list__player-race-icon"}
                src={raceIconMap[race]}
                alt="dps"
              />
            )}
            {`${name}: `}
          </div>
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

    return (
      <React.Fragment key={idx + "DC"}>
        <div
          className={`team-list__player-name disconnected-player`}
        >{`Disconnected`}</div>
        <div className={"team-list__player-damage"} />
        <div className={"team-list__player-healing"} />
      </React.Fragment>
    );
  });

  return <div className={className}>{playerArr}</div>;
};

export default TeamList;
