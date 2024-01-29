import { FormControl } from "@mui/material"

interface ErrorMessageProps {
  errorState: Error
}

export interface Error {
  isError: boolean
  errorMessage: string
}

function ErrorMessage({ errorState }: ErrorMessageProps) {

  return (
    <>
      {errorState.isError &&
        <FormControl style={{ color: 'red' }}>
          {errorState.errorMessage}
        </FormControl>
      }
    </>
  )
}

export default ErrorMessage;