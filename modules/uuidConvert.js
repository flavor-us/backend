const models = require("../models");
const errorMsg = require("../message/error")
exports.getIdFromUuid = async (uuid) => {
    const user = await models.User.findOne({
        where: {
            uuid: uuid
        }
    }).catch((e) => console.log(e));
    if (!user)
        throw (errorMsg.noUser)
    return (user.id)
}

exports.getUuidFromKakaoId = async (kakao_id) => {
    const user = await models.User.findOne({
        where: {
            kakao_id: kakao_id
        }
    }).catch((e) => console.log(e));
    if (!user)
        throw (errorMsg.noUser)
    return (user.uuid)
}
