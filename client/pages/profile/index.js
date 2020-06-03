import useRequest from '../../hooks/use-request';

export default ({ currentUser }) => {

  const [twoFactAuthEnabled, setTwoFactAuthEnabled] = React.useState(currentUser.twoFactorAuthEnabled)
  const [isHovered, setHovered] = React.useState(false)
  const [image, setImage] = React.useState(null);
  const [userToken, setUserToken] = React.useState('');

  const { doRequest: doRequestGet2FACode, errors: get2FACodeErrors } = useRequest({
    url: '/api/users/2fa/generate',
    method: 'post',
    body: {},
    onSuccess: (base64) => {
      setImage(base64)
    }
  });

  const { doRequest: doRequestEnable2FA, errors: enable2FAErrors } = useRequest({
    url: '/api/users/2fa/enable',
    method: 'post',
    body: {
      userToken: userToken
    },
    onSuccess: (res) => {
      setImage(null);
      setUserToken('');
      setTwoFactAuthEnabled(true)
    }
  });

  const { doRequest: doRequestDisable2FA, errors: disable2FAErrors } = useRequest({
    url: '/api/users/2fa/disable',
    method: 'post',
    body: {},
    onSuccess: (res) => {
      setTwoFactAuthEnabled(false)
    }
  });

  const onClick = (event) => {
    event.preventDefault();

    if (!twoFactAuthEnabled && !userToken) {
      doRequestGet2FACode()
    } else {
      doRequestDisable2FA();
    }

    if (userToken) {
      doRequestEnable2FA()
    }
  }

  return (
    <div>
      <h3>Profile</h3>
      <hr />
      <form>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            autoComplete="email"
            defaultValue={currentUser.email}
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
            </small>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" id="password"
            placeholder="Password" autoComplete="current-password" />
        </div>

        <div className="form-group">
          {get2FACodeErrors}
          {
            twoFactAuthEnabled
              ? (
                <button className={isHovered ? "btn btn-danger" : "btn btn-outline-success"}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  onClick={onClick}
                >
                  {
                    isHovered
                      ? "Disable Two-factor Authentication"
                      : "Two-factor Authentication Enabled"
                  }
                </button>
              )
              : (
                <button className="btn btn-success" onClick={onClick}>
                  Enable Two-factor Authentication
                </button>
              )
          }
        </div>
        {
          image && (
            <div>
              {enable2FAErrors}

              <img src={image} />
              <input
                type="text" placeholder="Enter auth token"
                onChange={e => setUserToken(e.target.value)}
              />
            </div>
          )
        }

        <button type="submit" className="btn btn-primary" onClick={onClick}>
          Save
          </button>
      </form>
      <hr />
      <pre>
        <code>
          {JSON.stringify(currentUser, undefined, 2)}
        </code>
      </pre>

    </div>
  )
}