import updateTrackableFields from '../update-trackable-fields';
import { User } from '../../models/user';

it('should update the trackable fields of a user', async () => {
    await global.signin();

    const user = await User.findOne({email: "test@test.com"});

    expect(user!.signInCount).toEqual(0)
    expect(user!.currentSignInAt).toBeUndefined()
    expect(user!.lastSignInAt).toBeUndefined()
    expect(user!.currentSignInIP).toBeUndefined()
    expect(user!.lastSignInIP).toBeUndefined()

    await updateTrackableFields(user!);

    expect(user!.signInCount).toEqual(1)
    expect(user!.currentSignInAt).toBeDefined()
    expect(user!.lastSignInAt).toBeDefined()
    expect(user!.currentSignInIP).toBeDefined()
    expect(user!.lastSignInIP).toBeDefined()
})