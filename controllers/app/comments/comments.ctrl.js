const models = require("../../../models");
const errorMsg = require("../../../message/error");
const completeMsg = require("../../../message/complete");
const kakaoIdConvert = require("../../../modules/kakaoIdConvert");
const dbUpload = require("../../../modules/dbUpload");
const logger = require("../../../config/logger");

exports.uploadComments = async (req, res) => {
    var comment_id;
    logger.info(`${req.method} ${req.url}`);
    if (!req.body.kakao_id || !req.body.content)
        return (res.status(400).send(errorMsg.notEnoughReq));
    try {
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.body.kakao_id);
        const comment = {
            user_id: user_id,
            content_id: req.params.content_id,
            content: req.body.content
        }
        comment_id = await dbUpload.uploadComment(comment);
    } catch (e) {
        logger.error("[uploadComments] : " + JSON.stringify(e));
        if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else
            return (res.status(400).send(errorMsg.uploadFail));
    }
    return (res.status(201).send({ msg: completeMsg.uploadComplete.msg, comment_id: comment_id }));
}

exports.deleteComments = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    try {
        if (!req.params.comment_id)
            throw (errorMsg.notEnoughReq);
        const comment = await models.Comments.destroy({
            where: {
                id: req.params.comment_id
            }
        });
        if (!comment)
            throw (errorMsg.noComment);
    } catch (e) {
        logger.error("[deleteComments] : " + JSON.stringify(e));
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noComment)
            return (res.status(400).send(errorMsg.noComment));
        else
            return (res.status(400).send(errorMsg.deleteFail));
    }
    return (res.status(204).send());

}