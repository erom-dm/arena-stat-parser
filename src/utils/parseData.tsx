import { ArenaMatch, ModdedArenaMatch } from "../Types/ArenaTypes";

export const parseData = (data: string): ArenaMatch[] => {
  // Get part of the string with actual instance data
  const start = data.lastIndexOf('["instances"] = ') + 17; // Only works if actual instance object is last in data set
  const newStr = data.slice(start);

  // Clean up the string and split it in separate objects
  const enumRegexp = new RegExp(/, -- \[\d+\]/, "g");
  const instanceDataArray = newStr
    .replaceAll("\n", "")
    .replaceAll("\r", "")
    .replaceAll("\t", "")
    .replaceAll('["', '"')
    .replaceAll('"]', '"')
    .replaceAll(" = ", ":")
    .replaceAll(",}", "}")
    .split(enumRegexp);

  // Parse all valid objects
  let parsedData: ArenaMatch[] = [];
  instanceDataArray.forEach((el) => {
    try {
      parsedData.push(JSON.parse(el));
    } catch (e) {
      // Ignore failed parses (random strings and AB instances)
      // console.log(e);
    }
  });
  return parsedData;
};

export const parseArenaStatParserLogData = (
  data: string
): ModdedArenaMatch[] => {
  let parsed = [];
  try {
    parsed = JSON.parse(data);
  } catch (e) {
    console.log(e);
  }
  return parsed.filter((match: any) => moddedArenaMatchTypeGuard(match));
};

export const arenaMatchTypeGuard = (data: any): data is ArenaMatch => {
  return (
    data.class !== undefined &&
    data.classEnglish !== undefined &&
    data.enteredTime !== undefined &&
    data.faction !== undefined &&
    data.goldTeam !== undefined &&
    data.group !== undefined &&
    data.instanceID !== undefined &&
    data.instanceName !== undefined &&
    data.isPvp !== undefined &&
    data.playerName !== undefined &&
    data.purpleTeam !== undefined &&
    data.winningFaction !== undefined
  );
};

export const moddedArenaMatchTypeGuard = (
  data: any
): data is ModdedArenaMatch => {
  return (
    data.matchID !== undefined &&
    data.enteredTime !== undefined &&
    data.instanceID !== undefined &&
    data.instanceName !== undefined &&
    data.playerName !== undefined &&
    data.bracket !== undefined &&
    data.myTeam !== undefined &&
    data.myTeamComp !== undefined &&
    data.myTeamName !== undefined &&
    data.enemyTeamName !== undefined &&
    data.enemyTeam !== undefined &&
    data.enemyTeamComp !== undefined &&
    data.enemyPlayerNames !== undefined &&
    data.enemyTeamMMR !== undefined &&
    data.enemyTeamRating !== undefined &&
    data.win !== undefined
  );
};
