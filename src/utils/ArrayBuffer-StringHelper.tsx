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
