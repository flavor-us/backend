const models = require("../models");

exports.getUserIdByKakaoId = async function (kakao_id) {
    const user_id = await models.User.findOne({
        where: {
            kakao_id: kakao_id
        }
    }).catch((e) => {
        console.log(e);
        throw 'Error has occured on Sequelize FindOne'
    })
    if (!user_id)
        throw 'there is no user_id corresponding to kakao_id'
    else
        return (user_id);
}

exports.getKakaoIdByUserId = async function (user_id) {
    const kakao_id = await models.User.findOne({
        where: {
            id: user_id
        }
    }).catch((e) => {
        console.log(e);
        throw 'Error has occured on Sequelize FindOne'
    })
    if (!kakao_id)
        throw 'there is no user_id corresponding to kakao_id'
    else
        return (kakao_id.kakao_id);
}