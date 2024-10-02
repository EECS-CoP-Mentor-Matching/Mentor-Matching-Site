import TextInputControl from "../../common/forms/textInputs/TextInputControl";

interface PasswordProps {
  label: string,
  onInput: (value: string) => void,
}

function Password({ label, onInput }: PasswordProps) {
  return (
      <TextInputControl
          label={label}
          onInput={(e) => onInput(e)}
          sensitive={true}
          widthMulti={0.25} />
  );
}

export default Password;