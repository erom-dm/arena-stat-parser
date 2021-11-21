import React, { useCallback, useState } from "react";
import { parseData } from "../utils/parseData";
import { arrayBufferToString } from "../utils/ArrayBuffer-StringHelper";
import { useDropzone } from "react-dropzone";
import { consolidateState } from "../utils/stateManagement";
import { modifyDataAndAddIds } from "../utils/dataSetHelpers";

export type landingProps = {
  localStoreChangeHandler: React.Dispatch<React.SetStateAction<boolean>>;
  localStorageChangeValue: boolean;
};

const UploadArea: React.FC<landingProps> = ({
  localStoreChangeHandler,
  localStorageChangeValue,
}) => {
  const [text, setText] = useState("Upload file");

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file: any) => {
        //TBD
        const reader = new FileReader();

        reader.onabort = () => setText("File reading was aborted");
        reader.onerror = () => setText("File reading failed");
        reader.onload = () => {
          const binaryStr = reader.result;
          consolidateState(
            modifyDataAndAddIds(parseData(arrayBufferToString(binaryStr)))
          );
          localStoreChangeHandler(!localStorageChangeValue);
          setText("File successfully parsed");
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [localStoreChangeHandler, localStorageChangeValue]
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
