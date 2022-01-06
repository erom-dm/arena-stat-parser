import React, { useCallback, useState } from "react";
import { parseArenaStatParserLogData, parseData } from "../utils/parseData";
import { arrayBufferToString } from "../utils/ArrayBuffer-StringHelper";
import { useDropzone } from "react-dropzone";
import { consolidateState } from "../utils/stateManagement";
import { modifyDataAndAddIds } from "../utils/dataSetHelpers";
import FileIcon from "../assets/upload-icon.svg";
import { debounce } from "../utils/debounce";

export type landingProps = {
  localStoreChangeHandler: React.Dispatch<React.SetStateAction<boolean>>;
};

const UploadArea: React.FC<landingProps> = ({ localStoreChangeHandler }) => {
  const [text, setText] = useState("Parse log");
  const [dragHover, setDragHover] = useState("");

  const handleDragEnterHover = () => {
    setDragHover("drag-hover");
  };
  const handleDragLeaveHover = () => {
    setDragHover("");
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file: any) => {
        const reader = new FileReader();

        reader.onabort = () => setText("File reading was aborted");
        reader.onerror = () => setText("File reading failed");
        reader.onload = () => {
          const binaryStr = reader.result;
          const dataString = arrayBufferToString(binaryStr);
          const isNovaInstanceTrackerLogFile =
            dataString.startsWith("\r\nNITdatabase");
          if (isNovaInstanceTrackerLogFile) {
            consolidateState(modifyDataAndAddIds(parseData(dataString)));
          } else {
            consolidateState(parseArenaStatParserLogData(dataString));
          }
          localStoreChangeHandler((prevState) => !prevState);
          setText("Log parsed!");
          setTimeout(() => {
            setText("Parse log");
          }, 4000);
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [localStoreChangeHandler]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div
      className={`upload-area ${dragHover}`}
      onDragOver={debounce(() => handleDragEnterHover(), 1000)}
      onDragLeave={debounce(() => handleDragLeaveHover(), 1000)}
      onDrop={handleDragLeaveHover}
    >
      <div {...getRootProps()} className="upload-area__content-wrap">
        <input {...getInputProps()} />
        <p>{text}</p>
        <img src={FileIcon} alt="file-icon" />
      </div>
    </div>
  );
};

export default UploadArea;
