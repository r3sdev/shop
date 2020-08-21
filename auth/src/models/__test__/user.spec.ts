import {User} from '../user';

describe('User', () => {

    const setup = async (override?: Record<string, string>) => {
        const user = User.build({
            email: "test@test.com", 
            password: "123456", 
            fullName: "Jest Test",
            ...override
        })

        await user.save()

        return user;
    }

    it('should be invalid if email, password or fullName is empty', (done) => {
        // @ts-ignore
        const user = User.build({})

        user.validate(function(err) {
            expect(err.errors.email).toBeDefined()
            expect(err.errors.password).toBeDefined()
            expect(err.errors.fullName).toBeDefined()

            done();
        });
    })

    it('should rename _id -> id', async () => {
        const user = await setup();

        expect(user.toJSON()._id).not.toBeDefined()
        expect(user.toJSON().id).toBeDefined()
    });

    it('should does not serialize the password field', async () => {
        const user = await setup();

        expect(user.toJSON().password).not.toBeDefined()
    });

    it('should store the user password as a hash', async () => {
        const user = await setup();

        expect(user.password.split("")).toHaveLength(145)
    })

    it('should not rehash the password when it is unchanged', async () => {
        const user = await setup();

        const currentHash = user.password;

        user.set({
            name: "Update Test",
            email: "jest@test.com"
        })

        await user.save();

        expect(user.password).toEqual(currentHash)
    })

    it('should lowercase the email field', async () => {
        const email = "TEST@TEST.COM";
        const user = await setup({email});

        expect(user.email).toEqual(email.toLowerCase())

    })
})