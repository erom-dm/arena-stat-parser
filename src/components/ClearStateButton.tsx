import React, { useContext, useState } from "react";
import { clearLocalStorage } from "../utils/stateManagement";
import { useNavigate } from "react-router-dom";
import { LsChangeContext } from "./DashboardWrap";

export type clearStateBtnProps = {
  toggleModal: () => void;
};

const ClearStateButton: React.FC<clearStateBtnProps> = ({ toggleModal }) => {
  const [, localStoreChangeHandler] = useContext(LsChangeContext);
  const navigate = useNavigate();
  const [pressed, setPressed] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  const handleClick = () => {
    if (!pressed) {
      setPressed((prevState) => !prevState);
      setDisabled(true);
      setTimeout(() => setDisabled(false), 3500);
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
    ? "clear-state-button clear-state-button--disabled settings-button"
    : pressed
    ? "clear-state-button clear-state-button--enabled settings-button"
    : "clear-state-button settings-button";

  return (
    <div className="settings-group__wrap">
      <div className="settings-group__text">
        {pressed
          ? "Are you sure?"
          : "Wipe ALL uploaded log data. Make sure to have backup"}
      </div>
      <button className={buttonClass} onClick={handleClick} disabled={disabled}>
        {pressed ? "Yes, I'm sure" : "Clear local storage"}
      </button>
    </div>
  );
};

export default ClearStateButton;
