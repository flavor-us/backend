const social = require("../../../modules/social");
const errorMsg = require("../../../message/error");
const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.getJwt = async (req, res) => {
    var responseData = {};
    try {
        if (!req.body.kakao_id)
            return (res.status(400).send(errorMsg.notEnoughReq));
        const user = await social.getUserList([req.body.kakao_id]);
        if (user.length == 0)
            return (res.status(400).send(errorMsg.noUser));
        const token = jwt.sign({ //토큰 발급
            kakao_id: req.body.kakao_id,
        }, process.env.JWT_TOKEN, {
            issuer: 'limchanyeop',
        });
        responseData.token = token;
    } catch (e) {
        console.log(e);
        return (res.send(e));
    }
    return (res.send(responseData));
}