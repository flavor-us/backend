const awsUtils = require("../../../modules/awsUtils");
const errorMsg = require("../../../message/error");
const rekognition = require("../../../modules/rekognition");
const kakaoIdConvert = require("../../../modules/kakaoIdConvert");

exports.s3Upload = async (req, res) => { //Used Only Web Ctrl
    var uploadedFileInfo;
    try {
        if (!req.params.kakaoId || !req.file)
            throw (errorMsg.notEnoughReq)
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id);
        uploadedFileInfo = await awsUtils.uploadS3Bucket(req.file.path, req.file.mimetype, user_id);
    } catch {
        return (res.status(400).send(errorMsg.s3UploadFail));
    }
    return (res.status(201).send({ filename: uploadedFileInfo.key.split("/")[1] }));
}

exports.s3MulterUpload = async (req, res) => {
    if (req.file)
        return (res.status(201).send({ filepath: req.file.location }));
    else
        return (res.status(400).send(errorMsg.s3UploadFail));
}

exports.s3Delete = async (req, res) => {
    try {
        if (!req.params.kakao_id || req.params.filename)
            throw (errorMsg.notEnoughReq);
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id);
        const filename = req.params.filename;
        const filepath = user_id + "/" + filename;
        await awsUtils.deleteS3Bucket(filepath);
    } catch (e) {
        console.log(e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.deleteFail));
    }
    return (res.status(204).send());
}

exports.getRekog = async (req, res) => {
    var rekogData;
    try {
        if (!req.query.kakaoId || !req.query.s3ImageKey)
            throw (errorMsg.notEnoughReq);
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.query.kakaoId);
        const key = user_id + "/" + req.query.s3ImageKey;
        rekogData = await awsUtils.getLabel(key);
        if (!rekogData)
            throw (errorMsg.rekogFail);
        const is_food = rekognition.foodOrNot(rekogData)
        rekogData.is_food = is_food;
    } catch (e) {
        console.log(e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.rekogFail));
    }
    return (res.status(200).json({ rekogData }));
}