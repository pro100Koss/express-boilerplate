import {Router} from 'express';
import {protectedRouter} from '@/router/index';

const router = Router() as any;

router.use('/protected', protectedRouter.router);

export default router;
