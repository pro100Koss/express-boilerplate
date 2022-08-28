import JWT from 'jsonwebtoken';
import {IUser} from '@/models/User';

export class AuthService {
  loginUser = async (user: IUser) => this.createToken(user);

  createToken(user: IUser) {
    return JWT.sign({id: `${user.id}`}, process.env.SECRET_TOKEN || '');
  }
}

const authService = new AuthService();
export default authService;
