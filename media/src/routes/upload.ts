import express, { Request, Response, NextFunction } from 'express';
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { requireAuth } from '@ramsy-dev/microservices-shop-common';

import { MediaItem } from '../../models/media-item';

const FOLDER_NAME = 'images';
const CDN_URL = 'https://cdn-ramsy-dev.ams3.cdn.digitaloceanspaces.com/images/';

var s3 = new aws.S3({
  endpoint: 'ams3.digitaloceanspaces.com',
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
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

const router = express.Router();

router.use(upload.single('image'));

router.post('/api/media/upload', async (req: Request, res: Response) => {
  const kind = req.query.kind;
  const url = CDN_URL + req.file.originalname;

  const items = await MediaItem.find({ url });

  // Prevent duplicates
  if (items.length === 0) {
    const mediaItem = MediaItem.build({
      kind: kind.toString(),
      url,
      userId: req.currentUser!.id,
    });

    await mediaItem.save();
    // FIXME: Add event publisher
    console.log('MediaItem created', mediaItem);
  }

  res.send({ image: url });
});

export { router as uploadRouter };
