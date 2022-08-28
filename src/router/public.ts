import {Router} from 'express';
import wrapAwait from '@/wrapAwait';
import {welcomeAction} from '@/actions/welcomeAction';
import publicController from '@/controllers/PublicController';

const router = Router() as any;

router.get('/', wrapAwait(welcomeAction));

router.use('/browse', publicController.router);

export default router;
