import React, { useCallback, useContext, useState } from "react";
import {
  parseArenaHistoryLogData,
  parseData,
} from "../utils/dataParsingHelpers";
import { arrayBufferToString } from "../utils/fileHelpers";
import { useDropzone } from "react-dropzone";
import { consolidateState } from "../utils/localStorageManagement";
import { modifyMatchData } from "../utils/appStateHelpers";
import FileIcon from "../assets/upload-icon.svg";
import { debounce } from "../utils/debounce";
import { LsChangeContext } from "./DashboardWrap";

const UploadArea: React.FC = () => {
  const [, localStoreChangeHandler] = useContext(LsChangeContext);
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
            consolidateState(modifyMatchData(parseData(dataString)));
          } else {
            consolidateState(parseArenaHistoryLogData(dataString));
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
