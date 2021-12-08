import React from "react";
import { Link } from "react-router-dom";
import { ChartNamesAndRoutes } from "../Types/ArenaTypes";
import { useLocation } from "react-router-dom";

export type buttonGroupProps = {
  buttonLabels: ChartNamesAndRoutes[];
};

const ButtonGroup: React.FC<buttonGroupProps> = ({ buttonLabels }) => {
  const location = useLocation();

  const buttons = buttonLabels.map(([label, route], idx) => {
    const isClicked = route === location.pathname;
    return (
      <Link
        key={idx}
        className={`button-group__button${
          isClicked ? " button-group__button--selected" : ""
        }`}
        to={route}
      >
        {label}
      </Link>
    );
  });

  return <div className={"button-group"}>{buttons}</div>;
};

export default ButtonGroup;
