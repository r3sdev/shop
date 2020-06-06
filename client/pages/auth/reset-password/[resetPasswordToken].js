import Router from 'next/router';
import useRequest from '../../../hooks/use-request';

const ResetPassword = ({ resetPasswordToken, error }) => {

  const [password, setPassword] = React.useState('');
  const [confirmation, setConfirmation] = React.useState('')

  const { doRequest, resetErrors } = useRequest({
    url: `/api/users/reset-password`,
    method: 'post',
    body: { resetPasswordToken, password, confirmation },
    onSuccess: () => Router.push('/')
  })

  const isDisabled = password.length === 0 || password !== confirmation

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest()
  }

  const onRequestPassword = () => {
    Router.push('/auth/forgot-password')
  }

  if (error === 'NotFound') {
    return (
      <div>
        <h3>This link is invalid</h3>
        <p>
          Password reset links can only be used once and expire after an hour for security purposes, 
          please request another password reset link below to continue
        </p>
        <button className="btn btn-primary" onClick={onRequestPassword}>
          Reset Password
        </button>
      </div>
    )
  }

  if (error === 'LinkExpired') {
    return (
      <div>
        <h3>This link has expired</h3>
        <p>
          Password reset links expire after an hour for security purposes, 
          please request another password reset link below to continue
        </p>
        <button className="btn btn-primary" onClick={onRequestPassword}>
          Reset Password
        </button>
      </div>
    )
  }

  return (
    <div>
      <h3>Reset password</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            type="password"
            autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <label>Password confirmation</label>
          <input
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            className="form-control"
            type="password"
            autoComplete="new-password-confirmation"
          />
        </div>

        {resetErrors}

        <button className="btn btn-primary" disabled={isDisabled}>
          Reset password
          </button>
      </form>
    </div>
  )
}


ResetPassword.getInitialProps = async (context, client) => {
  const { resetPasswordToken } = context.query;

  const { data: { error} } = await client.get(`/api/users/reset-password/${resetPasswordToken}`);


  return { resetPasswordToken, error }
}

export default ResetPassword