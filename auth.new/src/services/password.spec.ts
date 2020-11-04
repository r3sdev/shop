import { Password } from './'

describe('Password', () => {
    it('hashes a plain text password', async () => {
        const hash = await Password.toHash("test")

        expect(hash.split(".")).toHaveLength(2)
    })

    it('compares a valid password with a hash', async () => {
        const hash = await Password.toHash("test")

        expect(Password.compare(hash, "test")).toBeTruthy()
    })

    it('rejects an invalid password with a hash', async () => {
        const hash = await Password.toHash("test")

        expect(await Password.compare(hash, "test1")).toBeFalsy()
    })
})