import React from 'react';
import { useRouter } from 'next/router';
import owasp from 'owasp-password-strength-test';

import useRequest from '../../hooks/use-request';

export default () => {

  const router = useRouter();

  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmation, setConfirmation] = React.useState('');
  const [error, setError] = React.useState(null)
  const [passwordErrors, setPasswordErrors] = React.useState([])

  const isValidEmailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const isValidEmail = (email: string) => isValidEmailRegExp.test(email)

  const isStrongPassword = passwordErrors.length === 0;

  const disableSignupButton = !isValidEmail(email)
    || !isStrongPassword
    || !fullName
    || !confirmation
    || !password
    || (confirmation !== password)
    || error;

  const validateEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim()
    setEmail(value)

    if (!isValidEmail(value)) {
      setError(new Error('InvalidEmail'))
    } else {
      setError(null)
    }
  }

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    const result = owasp.test(value);
    setPasswordErrors(result.errors)

    setPassword(value)
  }

  const validatePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();

    setPassword(value)
  }

  const validateConfirmation = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim()
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
    body: { fullName, email, password, passwordConfirmation: confirmation },
    onSuccess: () => router.push('/auth/email/confirm')
  });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <div className="col-xs-12 offset-md-3 col-md-6">
      <div className="card">
        <div className="card-body">

          <form onSubmit={onSubmit}>
            <h2>Sign Up</h2>
            <hr />

            <div className="form-group">
              <label>Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={(e) => setFullName(e.target.value.trim())}
                className="form-control"
                autoComplete="name"
              />
            </div>

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
                onChange={onChangePassword}
                onBlur={validatePassword}
                className="form-control"
                type="password"
                autoComplete="new-password"
              />
              {
                !password && (
                  <small id="passwordHelp" className="form-text text-muted">
                    The password must be at least 10 characters long,
                    contain at least one lowercase letter,
                    one uppercase letter, one number and one special character..
                  </small>
                )
              }
              <ul>
                {
                  passwordErrors.map(error => (
                    <li key={error}>
                      <small id="passwordErrors" className="form-text text-danger">
                        {error}
                      </small>
                    </li>
                  ))
                }
              </ul>
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
                error?.message === 'PasswordDoNotMatch' || (
                  (password && confirmation) &&
                  (password !== confirmation)) &&
                (
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
