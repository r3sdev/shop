import speakeasy from 'speakeasy';

export function generateTwoFactorAuthCode() {

  const name = process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME || '2FA';
  const issuer = name;
  
  const secretCode = speakeasy.generateSecret({ name, issuer, length: 20 });

  return {
    otpauthUrl: secretCode.otpauth_url,
    base32: secretCode.base32,
  };
}


