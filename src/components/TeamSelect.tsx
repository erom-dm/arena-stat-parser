import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import { TeamSelectOption } from "../Types/ArenaTypes";

type teamSelectProps = {
  onChange: (value: string) => void;
  teams: string[];
};

const TeamSelect: React.FC<teamSelectProps> = ({ teams, onChange }) => {
  const [selected, setSelected] = useState<SingleValue<TeamSelectOption>>();
  const options: TeamSelectOption[] = teams.map((team) => ({
    value: team,
    label: team,
  }));
  useEffect(() => {
    if (options.length && !selected) {
      setSelected(options[0]);
    }
    handleChange(options[0]);
  }, [teams]);

  const handleChange = (newValue: SingleValue<TeamSelectOption>) => {
    setSelected(newValue);
    onChange && newValue && onChange(newValue.value);
  };

  return (
    <Select
      className={"team-select"}
      classNamePrefix={"team-select"}
      options={options}
      value={selected}
      onChange={handleChange}
    />
  );
};

export default TeamSelect;
