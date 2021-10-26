import { ArenaMatch, MatchSessions } from "../Types/ArenaTypes";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

export function getSessions(matches: ArenaMatch[]): MatchSessions {
  const matchSessions: MatchSessions = {};
  matches.sort((a, b) => a.enteredTime - b.enteredTime);

  let sessionKey: number | null = null;
  let prevMatch: ArenaMatch;
  matches.every((match) => {
    if (sessionKey) {
      // If session object is present, find if new match fits that session time frame
      const prevMatchEnterTime = dayjs.unix(prevMatch.enteredTime);
      const matchIsWithinOldSession = dayjs
        .unix(match.enteredTime)
        .isBetween(prevMatchEnterTime, prevMatchEnterTime.add(1, "hour"));

      // If match fits, add it to old session
      if (matchIsWithinOldSession) {
        matchSessions[sessionKey].push(match);
        prevMatch = match;
        return true;
      }
    }

    // If match doesn't fit or session key is null, create new session
    sessionKey = match.enteredTime;
    prevMatch = match;
    matchSessions[sessionKey] = [match];
    return true;
  });

  return matchSessions;
}
