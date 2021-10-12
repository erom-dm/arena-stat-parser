import React, { useCallback, useState } from "react";
import { parseData } from "../utils/parseData";
import { arrayBufferToString } from "../utils/ArrayBuffer-StringHelper";
import { useDropzone } from "react-dropzone";

export type landingProps = {
  setOutput: any;
};

const UploadArea: React.FC<landingProps> = ({ setOutput }) => {
  const [text, setText] = useState("Upload file here");

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file: any) => {
        //TBD
        const reader = new FileReader();

        reader.onabort = () => setText("File reading was aborted");
        reader.onerror = () => setText("File reading failed");
        reader.onload = () => {
          // Do whatever you want with the file contents
          const binaryStr = reader.result;
          // console.log(arrayBufferToString(binaryStr));
          setOutput(parseData(arrayBufferToString(binaryStr)));
          setText("File successfully uploaded");
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [setOutput]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div {...getRootProps()} className="upload-area">
      <input {...getInputProps()} />
      <p>{text}</p>
    </div>
  );
};

export default UploadArea;
