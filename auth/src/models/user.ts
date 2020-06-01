import mongoose from 'mongoose';
import { Password } from '../services/password';

/**
 * An interface that describes the properties
 * that are required to create a new user
 */
interface UserAttrs {
  email: string;
  password: string;
}

/**
 * An interface that describes the properties
 * that a User Modal has
 */
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

/**
 * An interface that describes the properties
 * that a User Document has
 */
export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  twoFactorAuthCode?: string
  isTwoFactorAuthEnabled?: boolean
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    twoFactorAuthCode: {
      type: String,
    },
    isTwoFactorAuthEnabled: {
      type: Boolean
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
  },
);

userSchema.set('versionKey', 'version');


/**
 * Needs to be a function, not an arrow function
 * because of this binding
 */
userSchema.pre('save', async function (done) {
  /* only hash when password is modified */
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

/**
 * Needed to make mongoose type safe
 *
 * @example User.build({email: '', password: '})
 */
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
