import { useAppDispatch } from "../../../../redux/hooks"
import CheckBoxControl from "./CheckBoxControl"

interface CheckBoxControlReduxProps {
  onChangeDispatch(payload: any): {
    payload: any
    type: string
  }
  label: string
  checked?: boolean
  readOnly?: boolean
}

function CheckBoxControlRedux({ onChangeDispatch: onSelectDispatch, label, checked, readOnly = false }: CheckBoxControlReduxProps) {
  const dispatch = useAppDispatch();

  const onChange = (value: boolean) => {
    dispatch(onSelectDispatch(value));
  }

  return (
    <CheckBoxControl
      onChange={onChange}
      label={label}
      checked={checked}
      readOnly={readOnly}
    />
  );
}

export default CheckBoxControlRedux;