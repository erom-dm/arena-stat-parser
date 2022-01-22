import { Player, teamCompArrayType } from "../Types/ArenaTypes";

export function getTeamCompArray(
  players: (Player | null)[]
): teamCompArrayType {
  return players.map((player) => {
    if (player) {
      return player.class;
    }
    return "disconnected";
  });
}

export function getTeamCompString(players: (Player | null)[]): string {
  return getTeamCompArray(players)
    .reduce((a, b) => a.concat(" \\ ", b), "")
    .slice(3);
}

export function normalizeString(str: string): string {
  if (!str) {
    debugger;
  }
  return str.replace(/ /g, "").toLowerCase();
}
