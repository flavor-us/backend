const social = require("../../../modules/social");
const errorMsg = require("../../../message/error");
const jwt = require('jsonwebtoken');
const tokenAuth = require("../../../modules/tokenAuth");
const uuidConvert = require("../../../modules/uuidConvert");

exports.getAllToken = async (req, res) => {
    var tokens = {};
    try {
        if (!req.body.kakaotoken)
            return (res.status(400).send(errorMsg.notEnoughReq));
        const kakao_id = await tokenAuth.verifyKakaoToken(req.body.kakaotoken);
        const uuid = await uuidConvert.getUuidFromKakaoId(kakao_id);
        console.log("kakao_id = " + kakao_id + "uuid = " + uuid);
        const user = await social.getUserList([kakao_id]);
        if (user.length == 0)
            return (res.status(400).send(errorMsg.noUser));
        tokens.accessToken = jwt.sign({
            kakao_id: kakao_id,
        }, process.env.JWT_TOKEN, {
            expiresIn: '2d',
            issuer: 'limchanyeop',
        });
        tokens.refreshToken = jwt.sign({
            kakao_id: kakao_id,
            uuid: uuid
        }, process.env.JWT_TOKEN, {
            issuer: 'limchanyeop',
        });
        await tokenAuth.uploadRefreshToken(tokens.refreshToken, kakao_id);
    } catch (e) {
        console.log(e);
        if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.uploadFail));
    }
    return (res.status(200).send(tokens));
}

exports.getAccessToken = async (req, res) => {
    var accessToken;
    if (!req.body.kakao_id || !req.body.refreshtoken)
        return (res.status(400).send(errorMsg.notEnoughReq));
    const verifyResult = await tokenAuth.verifyRefreshToken(req.body.refreshtoken, req.body.kakao_id);
    if (verifyResult == true) {
        accessToken = jwt.sign({
            kakao_id: req.body.kakao_id,
        }, process.env.JWT_TOKEN, {
            expiresIn: '2d',
            issuer: 'limchanyeop',
        });
        return (res.status(200).send({ accessToken: accessToken }));
    }
    else
        return (res.status(401).send(errorMsg.invalidToken));
}