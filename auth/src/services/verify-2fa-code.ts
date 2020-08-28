import speakeasy, { TotpVerifyOptions } from 'speakeasy';

export async function verifyTwoFactorAuthCode(
  twoFactorAuthSecret: string,
  userToken: string,
  /**
   * Override window (1 window = 30s)
   */
  windowInMin?: number
) {

  const data: TotpVerifyOptions = {
    secret: twoFactorAuthSecret,
    encoding: 'base32',
    token: userToken,
    // allow a window of 1m (2x 30s) here
    window: windowInMin && windowInMin * 2 || 2,
  };

  return speakeasy.totp.verify(data);
}
