import { verifyTwoFactorAuthCode } from '../verify-2fa-code';
import { generateTwoFactorAuthSecret } from '../generate-2fa-secret';
import speakeasy from 'speakeasy';
import { generateTwoFactorAuthCode } from '../generate-2fa-code';


it('should correctly verify 2FA codes', async () => {
    const { base32 } = generateTwoFactorAuthSecret();
    var token = speakeasy.totp({
        secret: base32,
        encoding: 'base32',
    });

    const isValid = await verifyTwoFactorAuthCode(base32, token)

    expect(isValid).toBeTruthy()
})

it('should be valid for only one window', async () => {
    const { base32: secret } = generateTwoFactorAuthSecret();

    const minDiff = 15;
    const validTime = new Date(new Date().valueOf() + minDiff * 60000).getTime() / 1000;

    var validToken = generateTwoFactorAuthCode(secret, validTime)

    const isValid = await verifyTwoFactorAuthCode(secret, validToken, minDiff)

    expect(isValid).toBeTruthy()



    const expiredTime = new Date(new Date().valueOf() + 16 * 60000).getTime() / 1000;

    var invalidToken = generateTwoFactorAuthCode(secret, expiredTime)

    const isInvalid = await verifyTwoFactorAuthCode(secret, invalidToken, minDiff)
    expect(isInvalid).toBeFalsy()
})