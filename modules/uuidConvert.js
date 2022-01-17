const models = require("../models");
const errorMsg = require("../message/error");
const logger = require("../config/logger");

exports.getIdFromUuid = async (uuid) => {
    const user = await models.User.findOne({
        where: {
            uuid: uuid
        }
    }).catch((e) => logger.error("[getIdFromUuid] : " + e));
    if (!user)
        throw (errorMsg.noUser)
    return (user.id)
}

exports.getUuidFromKakaoId = async (kakao_id) => {
    const user = await models.User.findOne({
        where: {
            kakao_id: kakao_id
        }
    }).catch((e) => logger.error("[getUuidFromKakaoId] : " + e));
    if (!user)
        throw (errorMsg.noUser)
    return (user.uuid)
}
