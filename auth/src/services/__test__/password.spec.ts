import {Password} from '../password';

it('should be able to hash a given password', async () => {
    const password = await Password.toHash("password");

    expect(password.split("")).toHaveLength(145)
})

it('should be able to compare a previously hashed password with given password', async () => {
    const password = await Password.toHash("password");
    const isEqual= await Password.compare(password, "password")

    expect(isEqual).toBeTruthy()
})