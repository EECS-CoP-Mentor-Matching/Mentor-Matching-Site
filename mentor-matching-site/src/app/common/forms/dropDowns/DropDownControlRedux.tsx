import { TextField, Autocomplete, FormControl } from "@mui/material";
import { DropDownOption } from "../../../../types/types";
import DropDownControl from "./DropDownControl";
import { useAppDispatch } from "../../../../redux/hooks";
import { useState } from "react";

interface DropDownControlProps {
  onSelectDispatch(payload: any): {
    payload: any
    type: string
  }
  options: DropDownOption[]
  label?: string
  selectedValue?: any
  valueIs?: ('id' | 'label')
}

function DropDownControlRedux({ onSelectDispatch, options, label, selectedValue, valueIs = 'id' }: DropDownControlProps) {
  const dispatch = useAppDispatch();

  const onSelect = (id: any, label: any) => {
    console.log(id, label)
    if (valueIs === 'id') {
      dispatch(onSelectDispatch(id));
    }
    else {
      dispatch(onSelectDispatch(label));
    }
  }

  return (
    <DropDownControl onSelect={onSelect}
      options={options}
      label={label}
      selectedValue={selectedValue}
      valueIs={valueIs} />
  );
}

export default DropDownControlRedux;