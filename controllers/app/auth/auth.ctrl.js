const social = require("../../../modules/social");
const errorMsg = require("../../../message/error");
const jwt = require('jsonwebtoken');
const tokenAuth = require("../../../modules/tokenAuth");

exports.getAllToken = async (req, res) => {
    var token = {};
    try {
        if (!req.body.kakaoToken)
            return (res.status(400).send(errorMsg.notEnoughReq));
        const kakao_id = await tokenAuth.verifyKakaoToken(req.body.kakaoToken);
        console.log("kakao_id = " + kakao_id);
        const user = await social.getUserList([kakao_id]);
        console.log(user);
        if (user.length == 0)
            return (res.status(400).send(errorMsg.noUser));
        token.accessToken = jwt.sign({
            kakao_id: req.body.kakao_id,
        }, process.env.JWT_TOKEN, {
            expiresIn: '2d',
            issuer: 'limchanyeop',
        });
        token.refreshToken = jwt.sign({
            kakao_id: req.body.kakao_id,
        }, process.env.JWT_TOKEN, {
            issuer: 'limchanyeop',
        });
        tokenAuth.uploadRefreshToken(token.refreshToken, kakao_id);
    } catch (e) {
        console.log(e);
        return (res.send(e));
    }
    return (res.send(token));
}

exports.getAccessToken = async (req, res) => {
    var accessToken;
    const verifyResult = await tokenAuth.verifyRefreshToken(req.body.refreshToken, req.body.kakao_id);
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