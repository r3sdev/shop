import { Response } from 'express';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { PassThrough } from 'stream';

export function getTwoFactorAuthenticationCode() {
  const name = process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME || '2FA';
  const secretCode = speakeasy.generateSecret({
    name,
    issuer: name,
    length: 10
  });
  return {
    otpauthUrl: secretCode.otpauth_url,
    base32: secretCode.base32,
  };
}


export function respondWithQRCode(data: string, res: Response) {
  QRCode.toDataURL(data, function (err, url) {
    res.send(url)
  });
}
