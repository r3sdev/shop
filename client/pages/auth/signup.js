import React from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmation, setConfirmation] = React.useState('');
  const [error, setError] = React.useState(null)

  const isValidEmailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const isValidEmail = (email) => isValidEmailRegExp.test(email)

  const disableSignupButton = !isValidEmail(email) 
  || !confirmation || !password || (confirmation !== password) || error;


  const validateEmail = (e) => {
    const value = e.target.value.trim()
    setEmail(value)

    if (!isValidEmail(value)) {
      setError(new Error('InvalidEmail'))
    } else {
      setError(null)
    }
  }

  const validatePassword = (e) => {
    const value = e.target.value.trim();
    setPassword(value)
  }

  const validateConfirmation = (e) => {
    const value = e.target.value.trim()
    setConfirmation(value)

    if (value !== password) {
      setError(new Error('PasswordDoNotMatch'))
    } else {
      setError(null)
    }
  }

  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/auth/email/confirm')
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <div className="col-xs-12 offset-md-3 col-md-6">
      <div class="card">
        <div class="card-body">

          <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <hr />
            <div className="form-group">
              <label>Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
                className="form-control"
                autoComplete="email"
              />
              {
                error?.message === 'InvalidEmail' ?
                  <small id="emailHelp" className="form-text text-danger">
                    Please check your email address
                  </small>
                  :
                  <small id="emailHelp" className="form-text text-muted">
                    We'll never share your email with anyone else.
                  </small>
              }

            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePassword}
                className="form-control"
                type="password"
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label>Password Confirmation</label>
              <input
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                onBlur={validateConfirmation}
                className="form-control"
                type="password"
                autoComplete="password-confirmation"
              />
              {
                error?.message === 'PasswordDoNotMatch' && (
                  <small id="emailHelp" className="form-text text-danger">
                    Passwords do not match
                  </small>
                )
              }
            </div>
            <hr />
            {errors}
            <button className="btn btn-primary btn-block" disabled={disableSignupButton}>
              Sign Up
            </button>
          </form>


        </div>
      </div>
    </div>
  );
};
