import express, { NextFunction } from 'express';
import helmet from 'helmet';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@ramsy-dev/microservices-shop-common';
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

const FOLDER_NAME = 'images';
const CDN_URL ='https://cdn-ramsy-dev.ams3.cdn.digitaloceanspaces.com/images/';

var s3 = new aws.S3({
  endpoint: 'ams3.digitaloceanspaces.com',
  accessKeyId: 'CA4KOUCR3KBJX7PD6EWE', // process.env.SPACES_KEY,
  secretAccessKey: 'rgLdulL4QuvmnFhKyyuC3hT793x5kj4+ieaIOtyAAGw', // process.env.SPACES_SECRET,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'cdn-ramsy-dev',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, {
        originalname: file.originalname,
      });
    },
    key: function (request, file, cb) {
      console.log(file);
      cb(null, `${FOLDER_NAME}/${file.originalname}`);
    },
  }),
});

const app = express();

app.use(helmet());
app.set('trust proxy', true);
app.use(
  cookieSession({
    name: 'shop',
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);

app.use(currentUser);


app.post('/api/media/upload', upload.single('image'), function (req, res, next) {
  res.send({ image: CDN_URL + req.file.originalname });
});


// Catch all non defined urls
app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
