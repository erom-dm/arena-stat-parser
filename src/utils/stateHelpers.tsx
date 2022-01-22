import { Player, teamCompArrayType } from "../Types/ArenaTypes";

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
