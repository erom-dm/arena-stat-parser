export const parseData = (data: string): JSON | null => {
  const regexp1 = new RegExp(/-- \[\d+\]/, "g");
  const parsedData = data
    .replace("NITdatabase = ", "")
    .replaceAll(regexp1, "")
    .replaceAll("\n", "")
    .replaceAll("\r", "")
    .replaceAll("\t", "")
    .replaceAll("{{", "{")
    .replaceAll(",}, ", "")
    .replaceAll('["', '"')
    .replaceAll('"]', '"')
    .replaceAll(" = ", ":")
    .replaceAll(",}", "}");

  console.log(parsedData);

  let returnObject;
  try {
    returnObject = JSON.parse(parsedData);
  } catch (e) {
    console.log(e);
    return null;
  }

  return returnObject;
};

// let b = "adlahkjh qjwhek jahsdkj jk h -- [12] asdadasdasdas"
