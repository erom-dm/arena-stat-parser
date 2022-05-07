import React from "react";
import { NavLink } from "react-router-dom";
import { ChartNamesAndRoutes } from "../types/ArenaTypes";

export type buttonGroupProps = {
  buttonLabels: ChartNamesAndRoutes[];
};

const ButtonGroup: React.FC<buttonGroupProps> = ({ buttonLabels }) => {
  const buttons = buttonLabels.map(([label, route], idx) => {
    return (
      <NavLink key={idx} className={`button-group__button`} to={route}>
        {label}
      </NavLink>
    );
  });

  return <div className={"button-group"}>{buttons}</div>;
};

export default ButtonGroup;
