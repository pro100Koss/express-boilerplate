import User from '@/models/User';
import authService from '@/services/AuthService';
import bcrypt from 'bcrypt';
import {sendValidationErrors} from '@/helpers/validationHelpers';
import {Request, Response} from '@types';

const loginAction = async function (req: Request, res: Response) {
  req.checkBody('email', 'Enter a valid email').isEmail().exists().notEmpty();
  req.checkBody('password', 'Password is required').exists().notEmpty();

  if (!(await req.getValidationResult()).isEmpty()) return sendValidationErrors(req, res);

  const {email, password} = req.body;
  const user = await User.findOne({email}).exec();
  const isHashEqual = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !isHashEqual) {
    return res.status(403).send({error: 'Incorrect credentials'});
  }

  try {
    const token = await authService.loginUser(user);
    return res.status(200).send({token});
  } catch (error) {
    return res.status(403).send({error: error.message});
  }
};

export default loginAction;
