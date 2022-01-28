import React from "react";
import {
  ArenaMatch,
  ArenaMatchCompact,
  classCompressionMapType,
  Player,
  PlayerCompact,
  raceCompressionMapType,
  Team,
  TeamCompact,
} from "../Types/ArenaTypes";
import { sampleData } from "../sampleData";
import { getTeamCompArray, getTeamCompString } from "./miscHelperFunctions";
import {
  classCompressionMapLC,
  INSTANCE_DATA,
  PLAYER_DC_STRING,
  raceCompressionMap,
} from "./constants";

export function consolidateState(filteredData: ArenaMatchCompact[]): void {
  const filterKey = "i"; // matchID in ArenaMatchCompact
  const state = window.localStorage.getItem(INSTANCE_DATA);

  if (!state) {
    setLocalStorageField(INSTANCE_DATA, filteredData);
    return;
  }
  const parsedState = JSON.parse(state);
  const intState = [...parsedState, ...filteredData];
  const mergedState = [
    ...new Map(intState.map((item) => [item[filterKey], item])).values(),
  ];

  setLocalStorageField(INSTANCE_DATA, mergedState);
}

export function localStorageToState(
  key: string,
  setReactState: React.Dispatch<React.SetStateAction<any>>
): void {
  const currentState = window.localStorage.getItem(key);
  currentState && setReactState(JSON.parse(currentState));
}

export function clearLocalStorage(): void {
  window.localStorage.clear();
}

export function setLocalStorageField(key: string, data: any): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function sampleDataToLocalStorage(
  setLsChanged: React.Dispatch<React.SetStateAction<boolean>>
): void {
  setLocalStorageField(INSTANCE_DATA, sampleData);
  setLsChanged((prevState) => !prevState);
}

// Unfolding of compressed local storage state
export function unfoldCompactMatchData(
  data: ArenaMatchCompact[]
): ArenaMatch[] {
  return data.map((match) => {
    const {
      i: matchID,
      t: enteredTime,
      n: instanceID,
      w: win,
      m: myTeamCompact,
      e: enemyTeamCompact,
    } = match;
    const myTeam = unfoldCompactTeamData(myTeamCompact);
    const enemyTeam = unfoldCompactTeamData(enemyTeamCompact);
    return { matchID, enteredTime, instanceID, win, myTeam, enemyTeam };
  });
}

function unfoldCompactTeamData(data: TeamCompact): Team {
  const {
    n: teamName,
    r: teamRating,
    e: newTeamRating,
    m: teamMMR,
    p: playersCompact,
  } = data;
  const bracket = playersCompact.length;
  const players = unfoldCompactPlayerData(playersCompact);
  const teamCompArray = getTeamCompArray(players);
  const teamCompString = getTeamCompString(players);
  const playerNamesArr = playersCompact.map((player) => {
    if (player) {
      return player.n;
    }
    return PLAYER_DC_STRING;
  });
  return {
    teamName,
    teamRating,
    newTeamRating,
    teamMMR,
    players,
    bracket,
    teamCompArray,
    teamCompString,
    playerNamesArr,
  };
}

function unfoldCompactPlayerData(
  data: (PlayerCompact | null)[]
): (Player | null)[] {
  return data
    .map((player) => {
      if (player) {
        const { n: name, c, r, d: damage, h: healing } = player;

        const playerClassEntries = Object.entries(classCompressionMapLC) as [
          keyof classCompressionMapType,
          string
        ][];
        const playerClass = playerClassEntries.filter((el) =>
          el.includes(c)
        )[0][0];

        let race;
        if (r) {
          const raceEntries = Object.entries(raceCompressionMap) as [
            keyof raceCompressionMapType,
            string
          ][];
          race = raceEntries.filter((el) => el.includes(r))[0][0];
        }
        return { name, class: playerClass, race, damage, healing };
      }
      return null;
    })
    .sort((a, b) => {
      // sort players array alphabetically by class name, with null values in the end of the array
      if (a === null && b === null) {
        return 0;
      }
      if (a === null) {
        return 1;
      }
      if (b === null) {
        return -1;
      }
      return +(a.class > b.class) || -(a.class < b.class);
    });
}
//
