export function arrayBufferToString(buf: string | ArrayBuffer | null): string {
  if (buf === null || typeof buf === "string") {
    return '{"error":true}';
  }
  let jsonKey: string = "";
  // ** works, but fails with unicode chars **
  // new Uint8Array(buf).forEach(
  //   (byte: number) => (jsonKey += String.fromCharCode(byte))
  // );
  jsonKey = new TextDecoder().decode(new Uint8Array(buf));
  return jsonKey;
}

export function stringToArrayBuffer(str: string) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export function makeTextFile(
  text: BlobPart,
  textFile: string | null,
  textFileSetter: React.Dispatch<React.SetStateAction<string | null>>
): void {
  const data = new Blob([text], { type: "text/plain" });

  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFileSetter(window.URL.createObjectURL(data));
}

export function hashFromStrings(input: string | string[]): number {
  let string: string;
  if (Array.isArray(input)) {
    string = input.reduce((a, b): string => a.concat(b), "");
  } else {
    string = input;
  }

  let hash = 0,
    i,
    chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
