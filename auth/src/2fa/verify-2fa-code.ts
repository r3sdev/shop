import speakeasy from 'speakeasy';
import type { UserDoc } from '../models/user';

export function verifyTwoFactorAuthenticationCode(
         twoFactorAuthenticationCode: string,
         user: Express.Request['currentUser'],
       ) {
         return speakeasy.totp.verify({
           secret: user!.twoFactorAuthCode!,
           encoding: 'base32',
           token: twoFactorAuthenticationCode,
         });
       }
