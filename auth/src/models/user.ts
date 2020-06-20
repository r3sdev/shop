import mongoose from 'mongoose';
import { Password } from '../services/password';

/**
 * An interface that describes the properties
 * that are required to create a new user
 */
interface UserAttrs {
  fullName: string;
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
  backupToken?: string;
  email: string;
  emailToken?: string;
  emailVerifiedAt?: Date;
  fullName: string;
  password: string;
  phoneNumber?: string;
  phoneNumberToken?: string;
  phoneNumberVerifiedAt?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
  twoFactorAuthEnabled?: boolean;
  twoFactorAuthSecret?: string;
}

const userSchema = new mongoose.Schema({
  backupToken: {
    type: String
  },
  email: {
    required: true,
    type: String
  },
  emailToken: {
    type: String
  },
  emailVerifiedAt: {
    type: Date
  },
  fullName: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  phoneNumber: {
    type: String
  },
  phoneNumberToken: {
    type: String
  },
  phoneNumberVerifiedAt: {
    type: Date
  },
  registeredAt: {
    type: Date,
    default: new Date()
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordTokenExpires: {
    type: Date
  },
  twoFactorAuthEnabled: {
    default: false,
    type: Boolean
  },
  twoFactorAuthSecret: {
    type: String
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
    }
  }
});

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
  /* ensure we save our email lowercase */
  this.set('email', this.get('email').toLowerCase());
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
