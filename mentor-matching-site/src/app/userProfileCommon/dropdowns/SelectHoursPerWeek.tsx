import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { HOURS_PER_WEEK_OPTIONS } from "../../../types/userProfile";
import { useAppDispatch } from "../../../redux/hooks";

interface SelectHoursPerWeekProps {
  onSelectDispatch(payload: any): {
    payload: any
    type: string
  }
  currentValue?: string
}

function SelectHoursPerWeek({ onSelectDispatch, currentValue }: SelectHoursPerWeekProps) {
  const dispatch = useAppDispatch();

  const handleChange = (value: string) => {
    dispatch(onSelectDispatch(value));
  };

  return (
    <FormControl fullWidth sx={{ minWidth: 250 }}>
      <InputLabel>Hours Available Per Week</InputLabel>
      <Select
        value={currentValue || ""}
        onChange={(e) => handleChange(e.target.value)}
        label="Hours Available Per Week"
      >
        <MenuItem value="">
          <em>Select availability</em>
        </MenuItem>
        {HOURS_PER_WEEK_OPTIONS.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SelectHoursPerWeek;
