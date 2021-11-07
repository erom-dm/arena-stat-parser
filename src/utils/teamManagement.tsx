import { ModdedArenaMatch } from "../Types/ArenaTypes";

export default function getTeams(matches: ModdedArenaMatch[]): string[] {
  return [...new Set(matches.map((match) => match.myTeamName))];
}
