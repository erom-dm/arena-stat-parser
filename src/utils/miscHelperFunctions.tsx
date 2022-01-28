import {
  ArenaMatch,
  Player,
  SplitNames,
  teamCompArrayType,
} from "../Types/ArenaTypes";

export function getTeamCompArray(
  players: (Player | null)[]
): teamCompArrayType {
  return players
    .map((player) => {
      if (player) {
        return player.class;
      }
      return "disconnected";
    })
    .sort();
}

export function getTeamCompString(players: (Player | null)[]): string {
  return getTeamCompArray(players)
    .reduce((a, b) => a.concat(" \\ ", b), "")
    .slice(3);
}

export function normalizeString(str: string): string {
  const lcString = str.replace(/ /g, "").toLowerCase();
  return lcString.charAt(0).toUpperCase() + lcString.slice(1);
}

export function calcWinrate(matchCount: number, wins: number): string {
  return ((wins / matchCount) * 100).toFixed(1);
}

export function separateNamesFromRealm(inputArr: string[]): SplitNames {
  const obj: SplitNames = { names: [], realm: "" };
  inputArr.forEach((name) => {
    const arr = name.split("-");
    obj.names.push(arr[0]);
    obj.realm = arr[1];
  });
  return obj;
}

export function getMyTeamNames(matches: ArenaMatch[]): string[] {
  return [...new Set(matches.map((match) => match.myTeam.teamName))];
}
