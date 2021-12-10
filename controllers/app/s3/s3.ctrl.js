const awsUtils = require("../../../modules/awsUtils");
const errorMsg = require("../../../message/error");
const rekognition = require("../../../modules/rekognition");
const kakaoIdConvert = require("../../../modules/kakaoIdConvert");

exports.s3Upload = async (req, res) => {
    const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.readFail);
    })
    if (req.file && user_id) {
        var uploadedFileInfo = await awsUtils.uploadS3Bucket(req.file.path, req.file.mimetype, user_id).catch(e => {
            console.log(e);
            res.status(400).send(errorMsg.s3UploadFail);
        });
        res.status(201).send({ filename: uploadedFileInfo.key.split("/")[1] });
    } else {
        res.status(400).send(errorMsg.s3UploadFail);
    }
}

exports.s3MulterUpload = async (req, res) => {
    if (req.file)
        res.status(201).send({ filepath: req.file.location });
    else
        res.status(400).send(errorMsg.uploadFail);
}

exports.s3Delete = async (req, res) => {
    const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.readFail);
    })
    const filename = req.params.filename;
    if (!user_id || !filename)
        res.status(400).send(errorMsg.notEnoughReq);
    const filepath = user_id + "/" + filename;
    await awsUtils.deleteS3Bucket(filepath).catch((e) => {
        res.status(400).send(errorMsg.deleteFail);
    })
    res.status(204).send();
}

exports.getRekog = async (req, res) => {
    const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.query.kakaoId).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.rekogFail);
    })
    const key = user_id + "/" + req.query.s3ImageKey;
    console.log(key);
    const rekogData = await awsUtils.getLabel(key).catch((e) => {
        console.log(e)
        res.status(400).send(errorMsg.rekogFail);
    });
    if (rekogData) {
        const is_food = rekognition.foodOrNot(rekogData)
        rekogData.is_food = is_food;
        res.status(200).json({ rekogData })
    }
    else
        res.status(400).send(errorMsg.rekogFail);
}