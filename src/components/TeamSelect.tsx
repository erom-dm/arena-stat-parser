import React, { useCallback, useEffect, useMemo, useState } from "react";
import Select, { MenuPlacement, SingleValue } from "react-select";
import { TeamSelectOption } from "../Types/ArenaTypes";

type teamSelectProps = {
  onChange: (value: string) => void;
  teams: string[];
  menuPlacement?: MenuPlacement;
  setDefaultValue?: boolean;
};

const TeamSelect: React.FC<teamSelectProps> = ({
  teams,
  onChange,
  menuPlacement = "auto",
  setDefaultValue = true,
}) => {
  const [selected, setSelected] = useState<SingleValue<TeamSelectOption>>();
  const options: TeamSelectOption[] = useMemo(
    () =>
      teams.map((team) => ({
        value: team,
        label: team,
      })),
    [teams]
  );
  const handleChange = useCallback(
    (newValue: SingleValue<TeamSelectOption>) => {
      setSelected(newValue);
      onChange && newValue && onChange(newValue.value);
    },
    [setSelected, onChange]
  );
  useEffect(() => {
    if (setDefaultValue) {
      if (options.length) {
        setSelected((prevSelected) => (!prevSelected ? options[0] : null));
      }
      handleChange(options[0]);
    } else {
      if (options.length) {
        setSelected((prevState) => {
          if (prevState) {
            if (!teams.includes(prevState?.value)) {
              return null;
            } else {
              return prevState;
            }
          }
        });
      }
    }
  }, [teams, options, handleChange, setDefaultValue]);

  return (
    <Select
      className={"team-select"}
      classNamePrefix={"team-select"}
      placeholder={"Select team..."}
      options={options}
      value={selected}
      onChange={handleChange}
      menuPlacement={menuPlacement}
    />
  );
};

export default TeamSelect;
