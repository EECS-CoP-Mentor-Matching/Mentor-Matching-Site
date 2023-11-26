interface EmailPasswordProps {
  setEmail: (email: string) => void
  setPassword: (password: string) => void
}

function EmailPassword(props: EmailPasswordProps) {
  return (
    <div>
      <div className='login-form-item'>
        <div className='login-form-input'>Email</div>
        <input onChange={(e) => {
          props.setEmail(e.target.value);
        }}/>
      </div>
      <div className='login-form-item'>
        <div className='login-form-input'>Password</div>
        <input onChange={(e) => {
          props.setPassword(e.target.value);
        }}/>
      </div>
    </div>
  )
}

export default EmailPassword;