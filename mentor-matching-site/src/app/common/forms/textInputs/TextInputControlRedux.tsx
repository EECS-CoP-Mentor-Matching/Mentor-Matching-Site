
import { useAppDispatch } from "../../../../redux/hooks";
import TextInputControl from "./TextInputControl";

interface TextInputControlReduxProps {
  onInputDispatch(payload: any): {
    payload: any
    type: string
  }
  onInputValidation?: (value: string) => boolean
  onSubmit?: () => void
  onSubmitValidation?: (value: string) => boolean
  label?: string
  value?: any
  readonly?: boolean
  widthMulti?: number
  sensitive?: boolean
  style?: any
}

function TextInputControlRedux({ onInputDispatch, onInputValidation, onSubmit, onSubmitValidation, label, value, readonly = false, widthMulti, sensitive, style }: TextInputControlReduxProps) {
  const dispatch = useAppDispatch();

  const onInput = (data: string) => { dispatch(onInputDispatch(data)); }

  return (
    <TextInputControl onInput={onInput}
      onInputValidation={onInputValidation}
      onSubmit={onSubmit}
      onSubmitValidation={onSubmitValidation}
      label={label}
      value={value}
      readonly={readonly}
      widthMulti={widthMulti}
      sensitive={sensitive}
      style={style}
    />
  );
}

export default TextInputControlRedux;