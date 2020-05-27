import express, { Response, Request } from 'express';
import swaggerUi from 'swagger-ui-express';

const router = express.Router();

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

export { router as swaggerRouter };
