
import { useAppDispatch } from "../../../redux/hooks";
import TextInputControl from "./TextInputControl";

interface TextInputControlReduxProps {
  onInputDispatch(payload: string): {
    payload: string
    type: string
  }
  onInputValidation?: (value: string) => boolean
  onSubmit?: () => void
  onSubmitValidation?: (value: string) => boolean
  label: string
  value: string
  readonly?: boolean
  widthMulti?: number
  sensitive?: boolean
}

function TextInputControlRedux({ onInputDispatch, onInputValidation, onSubmit, onSubmitValidation, label, value, readonly, widthMulti, sensitive }: TextInputControlReduxProps) {
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
    />
  );
}

export default TextInputControlRedux;