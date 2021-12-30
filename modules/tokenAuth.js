const models = require("../models");
const kakaoIdConvert = require("../modules/kakaoIdConvert");
const errorMsg = require("../message/error");
const request = require("request-promise-native");
exports.verifyRefreshToken = async (requestToken, kakao_id) => {
    try {
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(kakao_id);
        const refreshToken = await models.Token.findOne({
            where: {
                user_id: user_id
            }
        });
        if (requestToken == refreshToken)
            return (true);
        else
            return (false);
    } catch (e) {
        return (false);
    }
}

exports.verifyKakaoToken = async (kakaoToken) => {
    var profile;
    let kakaoOptions = {
        url: 'https://kapi.kakao.com/v1/user/access_token_info',  // target에 해당하는 것을 적기
        method: 'GET',
        headers: {
            'Authorization': "Bearer " + kakaoToken
        },
        encoding: 'UTF-8',
    }
    try {
        await request(kakaoOptions, function (err, resp, body) {
            console.log(resp.statusCode);
            if (err || resp.statusCode != 200)
                throw (err);
            else
                profile = JSON.parse(body);
        })
    } catch (e) {
        console.log(e);
        return (false);
    }
    console.log(profile);
    return (profile.id)
}

exports.uploadRefreshToken = async (refreshToken, kakao_id) => {
    try {
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(kakao_id);
        if (!user_id)
            throw (errorMsg.noUser)
        const result = await models.Token.update(
            { refreshToken: refreshToken },
            {
                where: {
                    user_id: user_id
                }
            }
        )
        if (!result[0]) {
            await models.Token.create({
                user_id: user_id,
                refreshtoken: refreshToken
            })
        }
    } catch (e) {
        console.log(e);
        throw (errorMsg.uploadFail);
    }
}