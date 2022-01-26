import React, { useContext, useState } from "react";
import { ReactComponent as GearIcon } from "../assets/gear.svg";
import Modal from "react-modal";
import ClearStateButton from "./ClearStateButton";
import CreateBackupFileButton from "./CreateBackupFileButton";
import { SettingsModalContext } from "./ToolBar";
import LocalStorageStatusDisplay from "./LocalStorageStatusDisplay";
import ClearSessionState from "./ClearSessionState";

Modal.setAppElement("#root");

const SettingsModal: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const modalContext = useContext(SettingsModalContext);
  const toggleModal = () => {
    setOpen((prevState) => !prevState);
    modalContext && modalContext((prevState) => !prevState);
  };

  return (
    <div className={"settings-modal__container"}>
      <button className={"settings-modal__settings-btn"} onClick={toggleModal}>
        <div className={"settings-modal__settings-btn-content-wrap"}>
          <span>Settings</span>
          <GearIcon />
        </div>
      </button>
      <Modal
        className={"settings-modal__body"}
        overlayClassName={"settings-modal__overlay"}
        isOpen={open}
        contentLabel={"Settings Modal"}
        onRequestClose={toggleModal}
        shouldCloseOnOverlayClick={true}
      >
        <button
          className="settings-modal__close-modal-btn"
          onClick={toggleModal}
        />
        <div className="settings-modal__misc-section">
          <LocalStorageStatusDisplay />
          <CreateBackupFileButton />
        </div>
        <div className="settings-modal__state-deletion-section">
          <ClearStateButton toggleModal={toggleModal} />
          <ClearSessionState />
        </div>
      </Modal>
    </div>
  );
};

export default SettingsModal;
