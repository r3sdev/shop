import speakeasy, { TotpVerifyOptions } from 'speakeasy';

export function verifyTwoFactorAuthenticationCode(
  twoFactorAuthenticationCode: string,
  user: Express.Request['currentUser'],
) {

  const data: TotpVerifyOptions = {
    secret: user!.twoFactorAuthCode!,
    encoding: 'base32',
    token: twoFactorAuthenticationCode,
  };

  console.log('verifyTwoFactorAuthenticationCode', data);
  
  return speakeasy.totp.verify(data);
}
