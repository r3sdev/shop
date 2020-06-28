import express, { Request, Response, NextFunction } from 'express';
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

import { requireAuth } from '@ramsy-dev/microservices-shop-common';

var s3 = new aws.S3({
  endpoint: 'ams3.digitaloceanspaces.com',
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'cdn-ramsy-dev',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

const router = express.Router();

router.post(
  '/api/media/upload', 
  upload.array('image', 1),
  function (req: Request, res: Response, next: NextFunction) {
    res.send('Successfully uploaded ' + req.files.length + ' files!');

  });

export { router as uploadRouter };
