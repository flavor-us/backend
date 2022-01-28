const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const sharp = require("sharp");

const ImageUpload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        shouldTransform: true,
        transforms: [
            {
                id: "resized",
                key: function (req, file, cb) {
                    let extension = path.extname(file.originalname);
                    cb(null, Date.now().toString() + extension);
                },
                transform: function (req, file, cb) {
                    cb(null, sharp().resize(100, 100));
                },
            },
        ],
        acl: "public-read-write",
    }),
});

const uploadImageMulterMiddleware = ImageUpload.single("file");