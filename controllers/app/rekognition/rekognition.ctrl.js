const awsUtils = require("../../../modules/awsUtils");
const errorMsg = require("../../../message/error");
const rekognition = require("../../../modules/rekognition");

exports.s3Upload = async (req, res) => {
    const user_id = req.param.user_id;
    if (req.file && user_id) {
        var uploadedFileInfo = await awsUtils.uploadS3Bucket(req.file.path, req.file.mimetype, user_id).catch(e => {
            res.status(400).send(errorMsg.s3UploadFail);
        });
        res.status(201).send({ filename: uploadedFileInfo.key });
    } else {
        res.status(400).send(errorMsg.s3UploadFail);
    }
}

exports.getRekog = async (req, res) => {
    const key = req.query.s3ImageKey;
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