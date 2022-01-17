const social = require("../../../modules/social");
const errorMsg = require("../../../message/error");
const jwt = require('jsonwebtoken');
const tokenAuth = require("../../../modules/tokenAuth");
const uuidConvert = require("../../../modules/uuidConvert");
const logger = require("../../../config/logger");

exports.getAllToken = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    var tokens = {};
    try {
        if (!req.params.kakaotoken)
            return (res.status(400).send(errorMsg.notEnoughReq));
        const kakao_id = await tokenAuth.verifyKakaoToken(req.params.kakaotoken);
        const uuid = await uuidConvert.getUuidFromKakaoId(kakao_id);
        const user = await social.getUserListByKakaoId([kakao_id]);
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
        logger.error("[getAllToken] : " + e);
        if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.uploadFail));
    }
    return (res.status(200).send(tokens));
}

exports.getAccessToken = async (req, res) => {
    var accessToken;
    if (!req.params.kakao_id || !req.params.refreshtoken)
        return (res.status(400).send(errorMsg.notEnoughReq));
    const verifyResult = await tokenAuth.verifyRefreshToken(req.params.refreshtoken, req.params.kakao_id);
    if (verifyResult == true) {
        accessToken = jwt.sign({
            kakao_id: req.params.kakao_id,
        }, process.env.JWT_TOKEN, {
            expiresIn: '2d',
            issuer: 'limchanyeop',
        });
        return (res.status(200).send({ accessToken: accessToken }));
    }
    else
        return (res.status(401).send(errorMsg.invalidToken));
}