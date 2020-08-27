import { generateTwoFactorAuthCode } from '../generate-two-factor-auth-code'

it('should generate a two-factor authentication code', () => {
    const code = generateTwoFactorAuthCode();

    expect(code.base32.split("")).toHaveLength(32)
    expect(code.otpauthUrl?.startsWith("otpauth://totp/2FA?secret=")).toBeTruthy();
    expect(code.otpauthUrl?.split("otpauth://totp/2FA?secret=")[1]).toEqual(code.base32)
})