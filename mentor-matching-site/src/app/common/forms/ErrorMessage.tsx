import { FormControl } from "@mui/material"

interface ErrorMessageProps {
  errorState: ErrorState
}

export interface ErrorState {
  isError: boolean
  errorMessage: string
}

export const parseError = (error: any): ErrorState => {
  let errorMessage = 'Unknown error';
  if (error instanceof Error) errorMessage = error.message;
  return {
    isError: true,
    errorMessage: errorMessage
  } as ErrorState;
}

export const resetError = () => {
  return {
    isError: false,
    errorMessage: ''
  } as ErrorState;
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