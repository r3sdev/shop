import Router from 'next/router';
import useRequest from '../hooks/use-request';

export default ({ userId }) => {
  const [userToken, setUserToken] = React.useState('')

  const { doRequest, errors } = useRequest({
    url: '/api/users/2fa/validate',
    method: 'post',
    body: { userId, userToken },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  }

  const onSendBackupCode = () => {
    event.preventDefault()

  }

  return (
    <div>
      <h3>Two-factor authentication</h3>
      <p>Open your authentication app and enter the code.</p>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>6-digit code</label>
          <input
            value={userToken}
            onChange={(e) => setUserToken(e.target.value)}
            className="form-control"
            autoComplete="code"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Verify code</button>
      </form>

      <p className="mt-3">
        Can't access your authentication app?
        <br />
        <div style={{ color: 'blue', cursor: 'pointer' }} onClick={onSendBackupCode}>
          Send an sms instead
        </div> or contact support
      </p>
    </div>
  )
}