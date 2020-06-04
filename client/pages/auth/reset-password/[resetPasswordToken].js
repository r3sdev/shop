import Router from 'next/router';
import useRequest from '../../../hooks/use-request';

const ResetPassword = ({ resetPasswordToken}) => {

  const [password, setPassword] = React.useState('');
  const [confirmation, setConfirmation] = React.useState('')

  const { doRequest, errors } = useRequest({
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

        {errors}

        <button className="btn btn-primary" disabled={isDisabled}>
          Reset password
          </button>
      </form>
    </div>
  )
}


ResetPassword.getInitialProps = async (context, client) => {
  const { resetPasswordToken } = context.query;

  return { resetPasswordToken }
}

export default ResetPassword