import { TextField, Autocomplete, FormControl } from "@mui/material";
import { DropDownOption } from "../../../../types/types";
import DropDownControl from "./DropDownControl";
import { useAppDispatch } from "../../../../redux/hooks";

interface DropDownControlProps {
  onSelectDispatch(payload: any): {
    payload: any
    type: string
  }
  options: DropDownOption[]
  label?: string
  selectedOption?: any
}

function DropDownControlRedux({ onSelectDispatch, options, label, selectedOption }: DropDownControlProps) {
  const dispatch = useAppDispatch();

  const onSelect = (value: any) => {
    dispatch(onSelectDispatch(value));
  }

  return (
    <DropDownControl onSelect={onSelect}
      options={options}
      label={label}
      selectedOption={selectedOption} />
  );
}

export default DropDownControlRedux;