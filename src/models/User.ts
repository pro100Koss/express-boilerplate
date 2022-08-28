import mongoose, {Document, Schema} from 'mongoose';
import {AnyJson} from '@/types/AnyJson';

export interface IUser extends Document {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
}

export const UserSchema = new Schema<IUser>(
  {
    firstName: String,
    lastName: String,
    email: String,
    passwordHash: String,
  },
  {
    versionKey: false,
    toObject: {
      transform(doc: Document<IUser>, ret: AnyJson) {
        delete ret.__v;
        delete ret._id;
        delete ret.passwordHash;
        ret.id = doc._id;
      },
    },
  },
);

export const User = mongoose.model<IUser>('User', UserSchema);
export default User;
