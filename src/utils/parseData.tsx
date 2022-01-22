import { ArenaMatchRaw, ArenaMatchCompact } from "../Types/ArenaTypes";

export const parseData = (data: string): ArenaMatchRaw[] => {
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
  let parsedData: ArenaMatchRaw[] = [];
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

export const parseArenaHistoryLogData = (data: string): ArenaMatchCompact[] => {
  let parsed = [];
  try {
    parsed = JSON.parse(data);
  } catch (e) {
    console.log(e);
  }
  return parsed.filter((match: any) => arenaMatchTypeGuard(match));
};

export const rawArenaMatchTypeGuard = (data: any): data is ArenaMatchRaw => {
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

export const arenaMatchTypeGuard = (data: any): data is ArenaMatchCompact => {
  return (
    data.i !== undefined &&
    data.t !== undefined &&
    data.n !== undefined &&
    data.w !== undefined &&
    data.m !== undefined &&
    data.e !== undefined
  );
};
