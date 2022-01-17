const models = require("../models");
const kakaoIdConvert = require("../modules/kakaoIdConvert");
const errorMsg = require("../message/error");
const request = require("request-promise-native");
const uuidConvert = require("../modules/uuidConvert")
const jwt = require('jsonwebtoken');
const logger = require("../config/logger");

exports.verifyRefreshToken = async (requestToken, kakao_id) => {
    var refreshToken, verifyResult, uuid;
    try {
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(kakao_id);
        refreshToken = await models.Token.findOne({
            where: {
                user_id: user_id
            }
        });
    } catch (e) {
        return (false);
    }
    refreshToken = refreshToken.dataValues.refreshtoken;
    verifyResult = jwt.verify(refreshToken, process.env.JWT_TOKEN);
    uuid = await uuidConvert.getUuidFromKakaoId(kakao_id);
    if (requestToken == refreshToken && verifyResult.kakao_id == kakao_id && verifyResult.uuid == uuid)
        return (true);
    else
        return (false);
}

exports.verifyKakaoToken = async (kakaoToken) => {
    var profile;
    let kakaoOptions = {
        url: 'https://kapi.kakao.com/v1/user/access_token_info',
        method: 'GET',
        headers: {
            'Authorization': "Bearer " + kakaoToken
        },
        encoding: 'UTF-8',
    }
    try {
        await request(kakaoOptions, function (err, resp, body) {
            try {
                if (err || resp.statusCode != 200) {
                    throw ("errorCode :" + resp.statusCode);
                }
                else
                    profile = JSON.parse(body);
            } catch (e) {
                logger.error("[verifyKakaoToken] : " + JSON.stringify(e));
            }
        })
    } catch (e) {
        logger.error("[verifyKakaoToken] : " + JSON.stringify(e));
        return (false);
    }
    return (profile.id)
}

exports.uploadRefreshToken = async (refreshToken, kakao_id) => {
    try {
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(kakao_id);
        const result = await models.Token.update(
            { refreshtoken: refreshToken },
            {
                where: {
                    user_id: user_id
                }
            }
        )
        logger.error("result[0] = " + result[0])
        if (!result[0]) {
            await models.Token.create({
                user_id: user_id,
                refreshtoken: refreshToken
            })
        }
    } catch (e) {
        logger.error("[uploadRefreshToken] : " + JSON.stringify(e));
        if (e == errorMsg.noUser)
            throw (errorMsg.noUser);
        else
            throw (errorMsg.uploadFail);
    }
}