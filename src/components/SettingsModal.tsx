import React, { useState } from "react";
import { ReactComponent as GearIcon } from "../assets/gear.svg";
import Modal from "react-modal";
import ClearStateButton from "./ClearStateButton";

export type settingsModalProps = {
  localStoreChangeHandler: React.Dispatch<React.SetStateAction<boolean>>;
};

Modal.setAppElement("#root");

const SettingsModal: React.FC<settingsModalProps> = ({
  localStoreChangeHandler,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const toggleModal = () => {
    setOpen((prevState) => !prevState);
  };

  return (
    <div className={"settings-modal__container"}>
      <button className={"settings-modal__settings-btn"} onClick={toggleModal}>
        <GearIcon />
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
        <ClearStateButton
          localStoreChangeHandler={localStoreChangeHandler}
          toggleModal={toggleModal}
        />
      </Modal>
    </div>
  );
};

export default SettingsModal;
