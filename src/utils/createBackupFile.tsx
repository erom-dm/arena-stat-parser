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
