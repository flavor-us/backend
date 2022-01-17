const models = require("../../../models");
const errorMsg = require("../../../message/error");
const logger = require("../../../config/logger");

exports.getUserIdByKakaoId = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    var user_id;
    try {
        if (!req.params.kakao_id)
            throw (errorMsg.notEnoughReq)
        const kakao_id = req.params.kakao_id;
        user_id = await models.User.findOne({
            attributes: ["id"],
            where: {
                kakao_id: kakao_id
            }
        })
        if (!user_id)
            throw (errorMsg.noUser);
    } catch (e) {
        logger.error("[getUserIdByKakaoId] : " + e);
        if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else
            return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send({ user_id: user_id.dataValues.id }));
}