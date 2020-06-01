import speakeasy, { TotpVerifyOptions } from 'speakeasy';
import { User } from '../models/user';

export async function verifyTwoFactorAuthenticationCode(
  twoFactorAuthenticationCode: string,
  userId: string,
) {

  const user = await User.findById(userId)

  if (!user || !user.twoFactorAuthCode) {
    return false
  }

  const data: TotpVerifyOptions = {
    secret: user.twoFactorAuthCode,
    encoding: 'base32',
    token: twoFactorAuthenticationCode,
  };

  return speakeasy.totp.verify(data);
}
