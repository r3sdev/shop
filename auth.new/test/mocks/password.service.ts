import { WrongCredentialsException } from "../../src/exception";
     
export const mockedPasswordService = {
    verifyPassword: jest.fn()
        .mockResolvedValueOnce(true)
        .mockRejectedValue(new WrongCredentialsException())
}