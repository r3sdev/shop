import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

const FOLDER_NAME = 'images';

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
        metadata: function (_, file, cb) {
            cb(null, {
                originalname: file.originalname,
            });
        },
        key: function (_, file, cb) {
            console.log(file);
            cb(null, `${FOLDER_NAME}/${file.originalname}`);
        },
    }),
});

export { upload }