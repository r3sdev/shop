import React from 'react';
import { Tabs, Tab } from 'react-bootstrap'
import crypto from 'crypto';
import useRequest from '../../hooks/use-request';
import PhoneInput from 'react-phone-number-input'
import QRCode from 'qrcode'

const Profile = ({ currentUser }) => {

  const [twoFactAuthEnabled, setTwoFactAuthEnabled] = React.useState(currentUser?.twoFactorAuthEnabled)
  const [isHoveringDisable2fa, setHoveredDisable2fa] = React.useState(false)
  const [isHoveringRemoveBackup, setHoveredRemoveBackup] = React.useState(false)
  const [image, setImage] = React.useState<any>(null);
  const [userToken, setUserToken] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [phoneNumberToken, setPhoneNumberToken] = React.useState('');
  const [showVerification, setShowVerification] = React.useState(false);
  const [backupEnabled, setBackupEnabled] = React.useState(!!currentUser?.phoneNumberVerified);
  const [otpAuthUrl, setOtpAuthUrl] = React.useState('');

  // Encrypt email for gravatar
  const md5Email = crypto.createHash('md5').update(currentUser?.email || '').digest("hex");

  /**
   * Request 2FA code
   */
  const { doRequest: doRequestGet2FACode, errors: get2FACodeErrors } = useRequest({
    url: '/api/users/2fa/generate',
    method: 'post',
    body: {},
    onSuccess: ({otpauthUrl}: {otpauthUrl: string}) => {
      // FIXME regenerate every x seconds

      setOtpAuthUrl(otpauthUrl);

      // QRCode.toDataURL(otpauthUrl, { errorCorrectionLevel: 'H' })
      // .then(url => {
      //   console.log(url)
      //   setImage(url)

      // })
      // .catch(err => {
      //   console.error(err)
      // })
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
    onSuccess: () => {
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
    onSuccess: () => {
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

    if (!twoFactAuthEnabled) {
      console.log('generate', twoFactAuthEnabled, userToken)
      doRequestGet2FACode()
    } else {
      console.log('disable', twoFactAuthEnabled, userToken)
      disable2FA();
    }

    if (userToken) {
      console.log('enable', twoFactAuthEnabled, userToken)
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

  const show2FAButton = () => {
    return twoFactAuthEnabled
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
        <React.Fragment>
          {enable2FAErrors}
          <button className="btn btn-success" onClick={onEnable2FA}
            disabled={!!(image && !userToken)}
          >
            Enable Two-factor Authentication
          </button>
        </React.Fragment>
      )
  }

  const showQRCode = () => {
    return (!twoFactAuthEnabled && image) && (
      <div>
        <img src={image!} />
        <input
          className="form-control mt-1 mb-3"
          type="text"
          placeholder="Enter auth token"
          onChange={e => setUserToken(e.target.value)}
        />
      </div>
    )
  }

  const showDisableBackupMethod = () => {
    return (
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
    )
  }

  const showVerificationInput = () => {
    return (
      <div>
        <div className="form-group">
          <label htmlFor="verification-code">
            Verification code
          </label>
          <input
            type="verification-code"
            className="form-control"
            id="verification-code"
            placeholder="Verification code"
            autoComplete="verification-code"
            value={phoneNumberToken}
            onChange={e => setPhoneNumberToken(e.target.value)}
            onBlur={e => setPhoneNumberToken(e.target.value.trim())}
          />
        </div>
        <div className="form-group">
          {addBackupMethodErrors}
          <button
            className="btn btn-success"
            onClick={onAddBackupMethod}
            disabled={phoneNumberToken.length === 0}
          >
            Add backup method
          </button>
        </div>
      </div>
    )
  }

  const showVerifyPhoneNumber = () => {
    return (
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
          <button
            className="btn btn-success"
            onClick={onVerifyPhoneNumber}
            disabled={phoneNumber?.length === 0}
          >
            Verify phone number
          </button>
        </div>
      </div>
    )
  }

  React.useEffect(() => {
    if (otpAuthUrl) {
      console.log('Changes detected', otpAuthUrl)

      QRCode.toDataURL(otpAuthUrl, { errorCorrectionLevel: 'H' })
      .then(url => {
        setImage(url)
      })
      .catch(err => {
        console.error(err)
      })
    }
  },[otpAuthUrl])

  return (
    <div className="col-xs-12 offset-md-3 col-md-6 mt-5 mb-5">
      <div className="card">
        <div className="card-body">

          <div>
            <h3 style={{ marginTop: 10, marginBottom: 10 }}>Settings</h3>

            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
              <Tab eventKey="profile" title="Profile">

                <div style={{ padding: '25px 5px' }}>

                  <div className="row mb-2">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-body">
                          <img src={`https://gravatar.com/avatar/${md5Email}`} className="rounded float-left pr-3" alt={md5Email} />
                          <div>
                            <h6>{currentUser?.fullName}</h6>
                            <p>
                              Member since {new Date(currentUser?.registeredAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form>
                    <div className="form-group">
                      <label htmlFor="email">Email address</label>
                      <input type="email"
                        className="form-control"
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        autoComplete="email"
                        defaultValue={currentUser?.email}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input type="password" className="form-control" id="password"
                        placeholder="Password" autoComplete="current-password"
                      />
                      <small id="passwordHelp" className="form-text text-muted">
                        Only enter your password when you want to change it
                </small>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" onClick={onEnable2FA}>
                      Save
                  </button>

                  </form>

                </div>


              </Tab>
              <Tab eventKey="security" title="Security">

                <div style={{ padding: '25px 5px' }}>
                  <form>
                    <div className="form-group">
                      <label htmlFor="two-factor-authentication">Two-Factor Authentication</label>
                      <div>
                        {get2FACodeErrors}
                        {disable2FAErrors}
                        {showQRCode()}
                        {show2FAButton()}
                      </div>
                    </div>
                    <hr />
                    {
                      backupEnabled
                        ?
                        showDisableBackupMethod()
                        :
                        showVerification
                          ? showVerificationInput()
                          : showVerifyPhoneNumber()
                    }
                  </form>

                </div>

              </Tab>
            </Tabs>



          </div>

        </div>
      </div>
    </div>
  )
}

Profile.getInitialProps = async (context, _client, currentUser) => {
  const { res } = context;

  if (res && !currentUser) {
    res.writeHead(301, {
      Location: '/auth/signin'
    });
    res.end();
  }
  return {};
}

export default Profile;
