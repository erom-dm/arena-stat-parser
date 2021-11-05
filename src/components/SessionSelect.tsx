import React, { useRef, useState } from "react";
import { MatchSessions, SessionSelectOption } from "../Types/ArenaTypes";
import Select, { ActionMeta, MultiValue } from "react-select";
import dayjs from "dayjs";

export type sessionSelectProps = {
  sessionData: MatchSessions;
  onChange: (value: number[]) => void;
};

const SessionSelect: React.FC<sessionSelectProps> = ({
  sessionData,
  onChange,
}) => {
  const [selected, setSelected] = useState<MultiValue<SessionSelectOption>>([]);
  const valueRef = useRef(selected);
  valueRef.current = selected;

  const sessionKeys: number[] = [...sessionData.keys()];
  const selectAllOption: SessionSelectOption = {
    value: 0,
    label: "All Data",
  };
  const options: SessionSelectOption[] = [];
  sessionKeys.forEach((key, idx) => {
    const formattedData: string = dayjs.unix(key).format("HH:mm - DD/MM/YY");
    const sessionOption = {
      value: key,
      label: `Session ${idx + 1}, @ ${formattedData}`,
    };
    options.push(sessionOption);
  });
  options.reverse();

  const isSelectAllSelected = () =>
    valueRef?.current?.length === options.length;

  const getOptions = () => [selectAllOption, ...options];

  const isOptionSelected = (option: SessionSelectOption): boolean =>
    valueRef?.current?.some(({ value }) => value === option.value) ||
    isSelectAllSelected();

  const getValue = () => (isSelectAllSelected() ? [selectAllOption] : selected);

  const handleChange = (
    newValue: MultiValue<SessionSelectOption>,
    actionMeta: ActionMeta<SessionSelectOption>
  ) => {
    const selectedTimestampArray: number[] = [];
    const { action, option, removedValue } = actionMeta;
    if (action === "select-option" && option?.value === selectAllOption.value) {
      setSelected(options);
      selectedTimestampArray.push(...options.map((option) => option.value));
    } else if (
      (action === "deselect-option" &&
        option?.value === selectAllOption.value) ||
      (action === "remove-value" &&
        removedValue?.value === selectAllOption.value)
    ) {
      setSelected([]);
    } else if (
      actionMeta.action === "deselect-option" &&
      isSelectAllSelected()
    ) {
      const filteredOptions = options.filter(
        ({ value }) => value !== option?.value
      );
      setSelected(filteredOptions);
      selectedTimestampArray.push(
        ...filteredOptions.map((option) => option.value)
      );
    } else {
      setSelected(newValue || []);
      selectedTimestampArray.push(...newValue.map((option) => option.value));
    }
    onChange && onChange(selectedTimestampArray);
  };

  return (
    <Select
      className={"session-select"}
      classNamePrefix={"session-select"}
      defaultValue={selectAllOption}
      isOptionSelected={isOptionSelected}
      options={getOptions()}
      value={getValue()}
      onChange={handleChange}
      hideSelectedOptions={false}
      closeMenuOnSelect={false}
      isMulti
    />
  );
};

export default SessionSelect;
