import speakeasy from 'speakeasy';

export function generateTwoFactorAuthCode(secret: string, time?: number) {
    return speakeasy.totp({
        secret,
        encoding: 'base32',
        time
    });
}