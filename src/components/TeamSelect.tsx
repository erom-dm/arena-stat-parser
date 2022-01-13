import React, { useCallback, useEffect, useMemo, useState } from "react";
import Select, { SingleValue } from "react-select";
import { TeamSelectOption } from "../Types/ArenaTypes";

type teamSelectProps = {
  onChange: (value: string) => void;
  teams: string[];
};

const TeamSelect: React.FC<teamSelectProps> = ({ teams, onChange }) => {
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
    if (options.length) {
      setSelected((prevSelected) => (!prevSelected ? options[0] : null));
    }
    handleChange(options[0]);
  }, [teams, options, handleChange]);

  return (
    <Select
      className={"team-select"}
      classNamePrefix={"team-select"}
      options={options}
      value={selected}
      onChange={handleChange}
      menuPlacement={"auto"}
    />
  );
};

export default TeamSelect;
