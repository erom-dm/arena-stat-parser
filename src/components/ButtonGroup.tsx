import React, { Dispatch, SetStateAction, useState } from "react";

export type buttonGroupProps = {
  buttonLabels: string[];
  selected: string;
  onChange: Dispatch<SetStateAction<string>>;
};

const ButtonGroup: React.FC<buttonGroupProps> = ({
  buttonLabels,
  selected,
  onChange,
}) => {
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    label: string
  ) => {
    onChange && onChange(label);
  };

  const buttons = buttonLabels.map((label, idx) => {
    const isClicked = label === selected;
    return (
      <button
        key={idx}
        name={label}
        className={`button-group__button${
          isClicked ? " button-group__button--selected" : ""
        }`}
        onClick={(e) => handleClick(e, label)}
      >
        {label}
      </button>
    );
  });

  return <div className={"button-group"}>{buttons}</div>;
};

export default ButtonGroup;
