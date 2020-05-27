import express, { Response, Request } from 'express';

const router = express.Router();

router.get('/auth', async (req: Request, res: Response) => {
  res.json({
    name: 'auth',
  });
});

const BASE_URL = 'https://ticketing.ramsy.dev';

router.get('/auth/*', async (req: Request, res: Response) => {
  const url = req.url.split('/auth/')[1];
  res.redirect(307, `${BASE_URL}/api/users/${url}`);
});

router.post('/auth/*', async (req: Request, res: Response) => {
  const url = req.url.split('/auth/')[1];
  res.redirect(307, `${BASE_URL}/api/users/${url}`);
});

router.put('/auth/*', async (req: Request, res: Response) => {
  const url = req.url.split('/auth/')[1];
  res.redirect(307, `${BASE_URL}/api/users/${url}`);
});

router.patch('/auth/*', async (req: Request, res: Response) => {
  const url = req.url.split('/auth/')[1];
  res.redirect(307, `${BASE_URL}/api/users/${url}`);
});

router.delete('/auth/*', async (req: Request, res: Response) => {
  const url = req.url.split('/auth/')[1];
  res.redirect(307, `${BASE_URL}/api/users/${url}`);
});


export { router as authRouter };
