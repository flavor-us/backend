const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require("aws-sdk");
const kakaoIdConvert = require("../modules/kakaoIdConvert");
const errorMsg = require("../message/error");
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const storage = multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname })
    },
    key: async function (req, file, cb) {
        var user_id;
        try {
            const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id);
            if (!user_id)
                throw (errorMsg.noUser);
        } catch (e) {
            console.log(e);
            if (e == errorMsg.noUser)
                cb(new Error(errorMsg.noUser));
            else
                cb(new Error(errorMsg.uploadFail));
        }
        cb(null, `${user_id}/${Date.now()}.${file.mimetype.split('/')[1]}`);
    },
})

exports.upload = multer({ storage: storage });