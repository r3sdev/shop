import express, { Response, Request } from 'express';

const router = express.Router();

router.get('/auth', async (req: Request, res: Response) => {
  res.json({
    name: 'auth',
  });
});


router.post('/auth/signin', async (req: Request, res: Response) => {
  res.redirect(307, 'http://auth-srv/api/users/signin');
});

router.post('/auth/signup', async (req: Request, res: Response) => {
  res.redirect(307, 'http://auth-srv/api/users/signup');
});

router.post('/auth/signout', async (req: Request, res: Response) => {
  res.redirect(307, 'http://auth-srv/api/users/signout');
});

export { router as authRouter };
