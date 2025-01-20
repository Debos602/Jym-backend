import { ObjectId, Document } from 'mongoose';

// Extend TUser from Document to access Mongoose instance methods like isModified, save, etc.
export interface TUser extends Document {
  name: string;
  email: string;
  role: 'admin' | 'trainer' | 'trainee';
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}  // This will add Mongoose instance methods



export interface TSignIn {
  user: ObjectId;
  email: string;
  password: string;
}

export interface TDecodedToken {
  userId: string;
  role: string;
}
