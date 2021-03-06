const models = require("../models");
const errorMsg = require("../message/error");
const logger = require("../config/logger");

exports.getUserIdByKakaoId = async function (kakao_id) {
    const user_id = await models.User.findOne({
        where: {
            kakao_id: kakao_id
        }
    }).catch((e) => {
        logger.error("[getUserIdByKakaoId] : " + JSON.stringify(e));
        throw 'Error has occured on Sequelize FindOne'
    })
    if (!user_id)
        throw (errorMsg.noUser)
    else
        return (user_id.id);
}

exports.getKakaoIdByUserId = async function (user_id) {
    const kakao_id = await models.User.findOne({
        where: {
            id: user_id
        }
    }).catch((e) => {
        logger.error("[getKakaoIdByUserId] : " + JSON.stringify(e));
        throw 'Error has occured on Sequelize FindOne'
    })
    if (!kakao_id)
        throw (errorMsg.noUser)
    else
        return (kakao_id.kakao_id);
}