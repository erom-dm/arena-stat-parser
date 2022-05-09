import {
  ArenaMatch,
  ArenaMatchCompact,
  classCompressionMapType,
  Player,
  PlayerCompact,
  raceCompressionMapType,
  Team,
  TeamCompact,
} from "../types/ArenaTypes";
import { getTeamCompArray, getTeamCompString } from "./miscHelperFunctions";
import {
  classCompressionMapLC,
  PLAYER_DC_STRING,
  raceCompressionMap,
} from "./constants";

export function consolidateState(
  filteredData: ArenaMatchCompact[],
  state: ArenaMatchCompact[],
  setLocalStorage: (val: any) => void
): void {
  const filterKey = "i"; // matchID in ArenaMatchCompact

  if (state.length === 0) {
    setLocalStorage(filteredData);
    return;
  }

  const intState = [...state, ...filteredData];
  const mergedState = [
    ...new Map(intState.map((item) => [item[filterKey], item])).values(),
  ];

  setLocalStorage(mergedState);
}

export function clearLocalStorage(): void {
  window.localStorage.clear();
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
