import { MatchSessions, ModdedArenaMatch } from "../Types/ArenaTypes";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

export function getSessions(matches: ModdedArenaMatch[]): MatchSessions {
  const matchSessions: MatchSessions = new Map();
  matches.sort((a, b) => a.enteredTime - b.enteredTime);

  let sessionKey: number | null = null;
  let prevMatch: ModdedArenaMatch;
  matches.every((match) => {
    if (sessionKey) {
      // If session object is present, find if new match fits that session time frame
      const prevMatchEnterTime = dayjs.unix(prevMatch.enteredTime);
      const matchIsWithinOldSession = dayjs
        .unix(match.enteredTime)
        .isBetween(prevMatchEnterTime, prevMatchEnterTime.add(1, "hour"));

      // If match fits, add it to old session
      if (matchIsWithinOldSession) {
        matchSessions.get(sessionKey)?.push(match);
        prevMatch = match;
        return true;
      }
    }

    // If match doesn't fit or session key is null, create new session
    sessionKey = match.enteredTime;
    prevMatch = match;
    matchSessions.set(sessionKey, [match]);
    return true;
  });

  return matchSessions;
}
