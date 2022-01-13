import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const selectAllOption: SessionSelectOption = useMemo(
    () => ({
      value: 0,
      label: "All Sessions",
    }),
    []
  );
  const [selected, setSelected] = useState<MultiValue<SessionSelectOption>>([]);
  const valueRef = useRef(selected);
  valueRef.current = selected;

  const sessionKeys: number[] = useMemo(
    () => [...sessionData.keys()],
    [sessionData]
  );
  const options: SessionSelectOption[] = useMemo(() => {
    return sessionKeys
      .reduce((array, current, index) => {
        const formattedData: string = dayjs.unix(current).format("DD/MM/YY"); //"HH:mm - DD/MM/YY"
        array.push({
          value: current,
          label: `Session ${index + 1} - ${formattedData}`,
        });
        return array;
      }, [] as SessionSelectOption[])
      .reverse();
  }, [sessionKeys]);

  const isSelectAllSelected = useCallback(() => {
    return valueRef?.current?.length === options.length;
  }, [options.length]);

  const handleChange = useCallback(
    (
      newValue: MultiValue<SessionSelectOption>,
      actionMeta: ActionMeta<SessionSelectOption>
    ) => {
      const selectedTimestampArray: number[] = [];
      const { action, option, removedValue } = actionMeta;
      if (
        action === "select-option" &&
        option?.value === selectAllOption.value
      ) {
        setSelected(options);
        selectedTimestampArray.push(...options.map((option) => option?.value));
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
          ...filteredOptions.map((option) => option?.value)
        );
      } else {
        setSelected(newValue || []);
        selectedTimestampArray.push(...newValue.map((option) => option?.value));
      }
      onChange && onChange(selectedTimestampArray);
    },
    [isSelectAllSelected, onChange, options, selectAllOption.value]
  );

  useEffect(() => {
    // Resets selected to empty arr, if selected value wasn't within session keys
    if (selected.length) {
      let overlap = true;
      const selectedValues = selected.map((el) => el?.value);
      selectedValues.forEach((val) => {
        if (!sessionKeys.includes(val)) {
          overlap = false;
        }
      });
      if (!overlap) {
        setSelected([]);
      }
    }
  }, [selected, sessionKeys]);

  useEffect(() => {
    if (options.length) {
      setSelected((prevSelected) => (!prevSelected ? [options[0]] : []));
    }
    handleChange([options[0]], {
      action: "select-option",
      option: options[0],
    });
  }, [options, handleChange]);

  const isOptionSelected = (option: SessionSelectOption): boolean => {
    return (
      isSelectAllSelected() ||
      valueRef?.current?.some(({ value }) => value === option.value)
    );
  };

  const getValue = useCallback(() => {
    return isSelectAllSelected() ? [selectAllOption] : selected;
  }, [isSelectAllSelected, selectAllOption, selected]);

  return (
    <Select
      placeholder={"Select session..."}
      className={"session-select"}
      classNamePrefix={"session-select"}
      isOptionSelected={isOptionSelected}
      options={[selectAllOption, ...options]}
      value={getValue()}
      onChange={handleChange}
      hideSelectedOptions={false}
      closeMenuOnSelect={false}
      isMulti
      menuPlacement={"auto"}
    />
  );
};

export default SessionSelect;
