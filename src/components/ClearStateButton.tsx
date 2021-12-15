import React, { useState } from "react";
import { clearLocalStorage } from "../utils/stateManagement";
import { useNavigate } from "react-router-dom";

export type clearStateBtnProps = {
  localStoreChangeHandler: React.Dispatch<React.SetStateAction<boolean>>;
  toggleModal: () => void;
};

const ClearStateButton: React.FC<clearStateBtnProps> = ({
  localStoreChangeHandler,
  toggleModal,
}) => {
  const navigate = useNavigate();
  const [pressed, setPressed] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  const handleClick = () => {
    if (!pressed) {
      setPressed((prevState) => !prevState);
      setDisabled(true);
      setTimeout(() => setDisabled(false), 5000);
    }
    if (pressed) {
      setPressed((prevState) => !prevState);
      setDisabled(false);
      toggleModal();
      clearLocalStorage(); // wipe local storage
      localStoreChangeHandler((prevState) => !prevState); // update dashboard state
      navigate("/", { replace: false });
    }
  };

  const buttonClass = disabled
    ? "clear-state-button clear-state-button--disabled"
    : "clear-state-button";

  return (
    <div className="clear-state-button__wrap">
      <button className={buttonClass} onClick={handleClick} disabled={disabled}>
        {pressed ? "Yes, I'm sure" : "Clear local storage"}
      </button>
      <div className="clear-state-button__text">
        {pressed
          ? "Are you sure?"
          : "- Wipe all uploaded log data. Make sure to have backup."}
      </div>
    </div>
  );
};

export default ClearStateButton;
