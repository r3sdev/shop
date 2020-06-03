import speakeasy, { TotpVerifyOptions } from 'speakeasy';

export async function verifyTwoFactorAuthenticationCode(
  twoFactorAuthSecret: string,
  userToken: string,
) {

  const data: TotpVerifyOptions = {
    secret: twoFactorAuthSecret,
    encoding: 'base32',
    token: userToken,
  };

  return speakeasy.totp.verify(data);
}
