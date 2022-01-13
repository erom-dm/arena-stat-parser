import React, { useState } from "react";
import { makeTextFile } from "../utils/createBackupFile";
import { INSTANCE_DATA } from "../utils/stateManagement";
import dayjs from "dayjs";

const CreateBackupFileButton: React.FC = () => {
  const [file, setFIle] = useState<null | string>(null);

  const handleClick = () => {
    const localStorageData = window.localStorage.getItem(INSTANCE_DATA);
    localStorageData && makeTextFile(localStorageData, file, setFIle);
  };

  const currentDate: string = dayjs().format("DD/MM/YY");

  return (
    <div className={"create-backup-btn__wrap"}>
      <button
        className={"create-backup-btn settings-button"}
        onClick={handleClick}
      >
        Create Data Backup
      </button>
      {file && (
        <a
          className={"create-backup-btn__link"}
          download={`ArenaLogBackup_${currentDate}.txt`}
          href={file}
        >
          {"Download Backup \uD83D\uDDCE"}
        </a>
      )}
      <span className="create-backup-btn__text">
        - Download all logged data as text file.
      </span>
    </div>
  );
};

export default CreateBackupFileButton;
