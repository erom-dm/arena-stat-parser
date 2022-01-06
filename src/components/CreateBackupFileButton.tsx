import React, { useState } from "react";
import { makeTextFile } from "../utils/createBackupFile";
import { INSTANCE_DATA } from "../utils/stateManagement";

const CreateBackupFileButton: React.FC = () => {
  const [file, setFIle] = useState<null | string>(null);

  const handleClick = () => {
    const localStorageData = window.localStorage.getItem(INSTANCE_DATA);
    localStorageData && makeTextFile(localStorageData, file, setFIle);
  };

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
          download="ArenaLogBackup.txt"
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
