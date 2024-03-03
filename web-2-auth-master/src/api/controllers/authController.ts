import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import CustomError from '../../classes/CustomError';
import bcrypt from 'bcryptjs';
import LoginMessageResponse from '../../interfaces/LoginMessageResponse';
import userModel from '../models/userModel';
import {LoginUser} from '../../interfaces/User';

const login = async (
  req: Request<{}, {}, {username: string; password: string}>,
  res: Response<LoginMessageResponse>,
  next: NextFunction
) => {
  try {
    const {username, password} = req.body;
    if (!username || !password) {
      throw new CustomError('username and password are required', 400);
    }
    // Note: email is used as username
    const user = await userModel.findOne({email: username});
    if (!user) {
      throw new CustomError('User or password is incorrect', 200);
    }
    if (user.password && !bcrypt.compareSync(password, user.password)) {
      throw new CustomError('User or password is incorrect', 200);
    }

    if (!process.env.JWT_SECRET) {
      next(new CustomError('JWT secret not set', 500));
      return;
    }
    const outUserToken: LoginUser = {
      _id: user._id,
      user_name: user.user_name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(outUserToken, process.env.JWT_SECRET);

    const message: LoginMessageResponse = {
      token,
      message: 'Login successful',
      user: {
        id: user._id,
        user_name: user.user_name,
        email: user.email,
      },
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

export {login};
