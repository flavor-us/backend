const models = require("../../../models");
const errorMsg = require("../../../message/error");

exports.getUserIdByKakaoId = async (req, res) => {
    var user_id;
    try {
        if (!req.body.kakao_id)
            throw (errorMsg.notEnoughReq)
        const kakao_id = req.body.kakao_id;
        user_id = await models.User.findOne({
            attributes: ["id"],
            where: {
                kakao_id: kakao_id
            }
        })
        if (!user_id)
            throw (errorMsg.noUser);
    } catch (e) {
        console.log(e);
        if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send({ user_id: user_id.dataValues.id }));
}