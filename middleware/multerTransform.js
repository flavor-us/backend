const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const sharp = require("sharp");
const AWS = require("aws-sdk");
const logger = require("../config/logger");
const errorMsg = require("../message/error");
const kakaoIdConvert = require("../modules/kakaoIdConvert");

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const ImageUpload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        shouldTransform: true,
        transforms: [
            {
                id: "resizeimage",
                key: async function (req, file, cb) {
                    var user_id;
                    try {
                        user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id);
                    } catch (e) {
                        logger.error("[multerresizeS3] : " + e);
                        if (e == errorMsg.noUser)
                            req.error = errorMsg.noUser;
                        else
                            req.error = errorMsg.uploadFail;
                    }
                    cb(null, `${user_id}/${Date.now()}.${file.mimetype.split('/')[1]}`);
                },
                transform: function (req, file, cb) {
                    cb(null, sharp().resize({ width: 1080 }));//비율 유지한 채 변경
                },
            },
        ],
        acl: "public-read-write",
    }),
});

exports.uploadImageMulterMiddleware = ImageUpload.single("photo");