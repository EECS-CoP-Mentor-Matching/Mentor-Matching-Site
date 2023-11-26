import React from 'react';

function Login() {
  return (
    <div>
      <div>Hello, please login</div>
      <div>
        Email <input></input>
      </div>
      <div>
        Password <input></input>
      </div>
      <button>Login</button>
      <a href="/create-account">Create an Account</a>
    </div>
  );
}

export default Login;