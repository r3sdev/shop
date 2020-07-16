import express, { response } from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
    req.session = {
        ...req.session,
        jwt: null
    }

    res.send({})
})

export {router as signoutRouter}