import { MongoDbErrorCode } from "../../src/database/mongodb.error-codes.enum";

export const mockedUser = {
    _id: "test",
    email: "test@test.com",
    firstName: "John",
    lastName: "Test",
    password: "hashedpassword"
}

export const mockedUsersService = {
    create: jest.fn()
        .mockResolvedValueOnce(mockedUser)
        .mockRejectedValueOnce({ code: MongoDbErrorCode.UniqueViolation })
        .mockRejectedValueOnce({}),
    findOneByEmail: jest.fn()
        .mockResolvedValueOnce(mockedUser)
}