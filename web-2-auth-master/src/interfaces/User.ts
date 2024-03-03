import {Document} from 'mongoose';
interface User extends Document {
  user_name: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
}

interface OutputUser {
  id: string;
  user_name: string;
  email: string;
}

interface UserInput {
  user_name: string;
  email: string;
  password: string;
}

interface LoginUser {
  _id: string;
  user_name: string;
  email: string;
  role: 'user' | 'admin';
}
interface ResponseUser {
  message: string;
  user: LoginUser;
}

export {User, OutputUser, UserInput, LoginUser, ResponseUser};
