import wrapAwait from '../wrapAwait';
import {Request, Response} from '@types';
import {Router} from 'express';

class ProtectedController {
  router = Router();

  constructor() {
    const router = this.router;
    router.get('/', wrapAwait(this.index));
    router.post('/welcome-email', wrapAwait(this.welcomeEmail));
  }

  index(req: Request, res: Response) {
    return res.send({msg: 'Protected action'});
  }

  welcomeEmail(req: Request, res: Response) {
    const {email} = req.body;

    const text = 'Some text';
    const text2 = 'Another text';

    //@todo refactor mailer
    (res as unknown as {mailer: any}).mailer.send(
      {template: 'emails/article_mention'},
      {
        to: email,
        subject: 'Somebody tagged you in an article',
        text,
        text2,
      },
      (err: Error) => {
        if (err) {
          console.error(err);
        }
      },
    );

    res.send();
  }
}

const welcomeController = new ProtectedController();
export default welcomeController;
