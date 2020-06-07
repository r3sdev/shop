import useRequest from '../../hooks/use-request';
import PhoneInput from 'react-phone-number-input'

export default ({ currentUser }) => {

  const [twoFactAuthEnabled, setTwoFactAuthEnabled] = React.useState(currentUser.twoFactorAuthEnabled)
  const [isHoveringDisable2fa, setHoveredDisable2fa] = React.useState(false)
  const [isHoveringRemoveBackup, setHoveredRemoveBackup] = React.useState(false)
  const [image, setImage] = React.useState(null);
  const [userToken, setUserToken] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [phoneNumberToken, setPhoneNumberToken] = React.useState('');
  const [showVerification, setShowVerification] = React.useState(false);
  const [backupEnabled, setBackupEnabled] = React.useState(!!currentUser.phoneNumberVerified)

  /**
   * Request 2FA code
   */
  const { doRequest: doRequestGet2FACode, errors: get2FACodeErrors } = useRequest({
    url: '/api/users/2fa/generate',
    method: 'post',
    body: {},
    onSuccess: (base64) => {
      setImage(base64)
    }
  });

  /**
   * Enable 2FA
   */
  const { doRequest: enable2FA, errors: enable2FAErrors } = useRequest({
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

  /**
   * Disable 2FA
   */
  const { doRequest: disable2FA, errors: disable2FAErrors } = useRequest({
    url: '/api/users/2fa/disable',
    method: 'post',
    body: {},
    onSuccess: (res) => {
      setTwoFactAuthEnabled(false)
    }
  });

  /**
   * Request phone verification code
   */
  const { doRequest: requestPhoneValidationToken, errors: requestPhoneValidationTokenErrors } = useRequest({
    url: '/api/users/phone-number/verification/request',
    method: 'post',
    body: { phoneNumber },
    onSuccess: () => {
      setPhoneNumber('');
      setShowVerification(true)
    }
  });

  /**
   * Add backup method
   */
  const { doRequest: addBackupMethod, errors: addBackupMethodErrors } = useRequest({
    url: '/api/users/phone-number/verification/validate',
    method: 'post',
    body: { phoneNumberToken },
    onSuccess: () => {
      setShowVerification(false);
      setBackupEnabled(true);
    }
  });

  /**
 * Add remove backup method
 */
  const { doRequest: removeBackupMethod, errors: removeBackupMethodErrors } = useRequest({
    url: '/api/users/phone-number/remove',
    method: 'post',
    body: {},
    onSuccess: () => {
      setBackupEnabled(false);
    }
  });


  const onEnable2FA = (event) => {
    event.preventDefault();

    if (!twoFactAuthEnabled && !userToken) {
      doRequestGet2FACode()
    } else {
      disable2FA();
    }

    if (userToken) {
      enable2FA()
    }
  }


  const onAddBackupMethod = (event) => {
    event.preventDefault();

    console.log('Adding backup method', phoneNumber)
    addBackupMethod()
  }

  const onVerifyPhoneNumber = (event) => {
    event.preventDefault();
    console.log('Verifying phone number', phoneNumber)
    requestPhoneValidationToken()
  }

  const onDisableBackupMethod = (event) => {
    event.preventDefault()

    console.log('Disabling backup method')
    removeBackupMethod()
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
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" id="password"
            placeholder="Password" autoComplete="current-password" />
        </div>

        <div className="form-group">
          {get2FACodeErrors}
          {disable2FAErrors}
          {
            twoFactAuthEnabled
              ? (
                <button className={isHoveringDisable2fa ? "btn btn-danger" : "btn btn-outline-success"}
                  onMouseEnter={() => setHoveredDisable2fa(true)}
                  onMouseLeave={() => setHoveredDisable2fa(false)}
                  onClick={onEnable2FA}
                >
                  {
                    isHoveringDisable2fa
                      ? "Disable Two-factor Authentication"
                      : "Two-factor Authentication Enabled"
                  }
                </button>
              )
              : (
                <button className="btn btn-success" onClick={onEnable2FA}>
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

        {
          backupEnabled
            ?
            <div className="form-group">
              {removeBackupMethodErrors}
              <button className={isHoveringRemoveBackup ? "btn btn-danger" : "btn btn-outline-success"}
                onClick={onDisableBackupMethod}
                onMouseEnter={() => setHoveredRemoveBackup(true)}
                onMouseLeave={() => setHoveredRemoveBackup(false)}
              >
                {
                  isHoveringRemoveBackup
                    ? "Remove Backup Method"
                    : "Backup Method Enabled"
                }
              </button>
            </div>
            :
            showVerification
              ? (
                <div>
                  <div className="form-group">
                    <label htmlFor="verification-code">Verification code</label>
                    <input type="verification-code" className="form-control" id="verification-code"
                      placeholder="Verification code" autoComplete="verification-code"
                      value={phoneNumberToken}
                      onChange={e => setPhoneNumberToken(e.target.value)}
                      onBlur={e => setPhoneNumberToken(e.target.value.trim())}
                    />
                  </div>
                  <div className="form-group">
                    {addBackupMethodErrors}
                    <button className="btn btn-success" onClick={onAddBackupMethod}
                      disabled={phoneNumberToken.length === 0}>
                      Add backup method
                  </button>
                  </div>
                </div>
              )
              : (
                <div>
                  <div className="form-group">
                    <label htmlFor="phone-number">Backup Method</label>

                    <PhoneInput
                      defaultCountry='NL'
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={setPhoneNumber}
                    />
                  </div>
                  <div className="form-group">
                    {requestPhoneValidationTokenErrors}
                    <button className="btn btn-success" onClick={onVerifyPhoneNumber} disabled={phoneNumber?.length === 0}>
                      Verify phone number
                  </button>
                  </div>
                </div>
              )
        }

        <button type="submit" className="btn btn-primary btn-block" onClick={onEnable2FA}>
          Save
        </button>

      </form>

    </div>
  )
}