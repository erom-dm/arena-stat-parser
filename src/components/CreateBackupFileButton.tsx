import React, { useState } from "react";
import dayjs from "dayjs";
import { MATCH_DATA_MIN } from "../utils/constants";
import { makeTextFile } from "../utils/fileHelpers";

const CreateBackupFileButton: React.FC = () => {
  const [file, setFIle] = useState<null | string>(null);

  const handleClick = () => {
    const localStorageData = window.localStorage.getItem(MATCH_DATA_MIN);
    localStorageData && makeTextFile(localStorageData, file, setFIle);
  };

  const currentDate: string = dayjs().format("DD/MM/YY");

  return (
    <div className={"settings-group__wrap"}>
      <span className="settings-group__text">
        Download all logged data as text file:
      </span>
      <div className="settings-group__selection-wrap">
        <button
          className={"settings-group settings-button"}
          onClick={handleClick}
        >
          Create Data Backup
        </button>
        {file && (
          <a
            className={"settings-group__link"}
            download={`ArenaLogBackup_${currentDate}.txt`}
            href={file}
          >
            {"Download Backup \uD83D\uDDCE"}
          </a>
        )}
      </div>
    </div>
  );
};

export default CreateBackupFileButton;
