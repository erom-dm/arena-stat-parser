import { ArenaMatch } from "../Types/ArenaTypes";

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
  instanceDataArray.forEach((el, idx) => {
    try {
      parsedData.push(JSON.parse(el));
    } catch (e) {
      // Ignore failed parses (random strings and AB instances)
      // console.log(e);
    }
  });
  return parsedData;
};
