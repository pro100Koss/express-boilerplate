import bcrypt from 'bcrypt';
import logger from '@/components/logger';
import User, {IUser} from '@/models/User';
import {Request, Response} from '@types';
import {sendValidationErrors} from '@/helpers/validationHelpers';

const signupAction = async (req: Request, res: Response) => {
  req.checkBody('firstName', 'First name is required').exists().notEmpty();
  req.checkBody('lastName', 'Last name is required').exists().notEmpty();
  req.checkBody('email', 'Enter a valid email').isEmail().exists().notEmpty();
  req.checkBody('password', 'Password is required').exists().notEmpty();
  req.checkBody('password', 'Password min length must be 6 symbols').isLength({min: 6}).notEmpty();

  if (!(await req.getValidationResult()).isEmpty()) return sendValidationErrors(req, res);

  const {firstName, lastName, email, password} = req.body;

  let user: IUser | null = null;
  const hash = await bcrypt.hash(password, 6);
  try {
    user = await new User({firstName, lastName, email, passwordHash: hash}).save();
  } catch (err) {
    logger.error(err);
    user?.remove();

    const error = 'Cannot create user';
    return res.status(422).send({error});
  }
};

export default signupAction;
