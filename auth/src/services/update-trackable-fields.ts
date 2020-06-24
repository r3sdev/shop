import ipify from 'ipify';
import { UserDoc } from '../models/user';

export default async (user: UserDoc): Promise<UserDoc> => {

  const ipAddress = await ipify();

  let oldCurrent: Date | string = user.currentSignInAt;
  let newCurrent: Date | string = new Date();

  user.lastSignInAt = oldCurrent || newCurrent;
  user.currentSignInAt = newCurrent;

  oldCurrent = user.currentSignInIP;
  newCurrent = ipAddress;

  user.lastSignInIP = oldCurrent || newCurrent;
  user.currentSignInIP = newCurrent;
  
  user.signInCount += 1;

  await user.save()

  return user;
};
