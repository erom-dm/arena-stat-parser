import React, { useCallback, useState } from "react";
import { parseData } from "../utils/parseData";
import { arrayBufferToString } from "../utils/ArrayBuffer-StringHelper";
import { useDropzone } from "react-dropzone";
import { mergeState } from "../utils/stateManagement";
import { filterRawData } from "../utils/dataSetHelpers";

export type landingProps = {
  lcHandler: React.Dispatch<React.SetStateAction<boolean>>;
  lcVal: boolean;
};

const UploadArea: React.FC<landingProps> = ({ lcHandler, lcVal }) => {
  const [text, setText] = useState("Upload file here");

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file: any) => {
        //TBD
        const reader = new FileReader();

        reader.onabort = () => setText("File reading was aborted");
        reader.onerror = () => setText("File reading failed");
        reader.onload = () => {
          const binaryStr = reader.result;
          const parsedData = parseData(arrayBufferToString(binaryStr));
          const filteredData = filterRawData(parsedData);
          mergeState(filteredData);
          lcHandler(!lcVal);
          setText("File successfully parsed");
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [lcHandler, lcVal]
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
