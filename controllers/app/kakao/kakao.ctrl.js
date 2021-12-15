const request = require('request');
const models = require("../../../models");
const errorMsg = require("../../../message/error");
const completeMsg = require("../../../message/complete");
const dbUpload = require("../../../modules/dbUpload");

exports.getProfile = async (req, res) => {
    var profile;
    try {
        if (!req.params.kakao_id)
            throw (errorMsg.notEnoughReq);
        const kakaoToken = await models.User.findOne({
            attributes: ['kakaotoken'],
            where: {
                kakao_id: req.params.kakao_id
            }
        })
        if (!kakaoToken) {
            throw (errorMsg.noToken);
        }
        let kakaoOptions = {
            url: 'https://kapi.kakao.com/v1/api/talk/profile',  // target에 해당하는 것을 적기
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + kakaoToken.dataValues.kakaotoken
            },
            encoding: 'UTF-8',
        }
        request(kakaoOptions, function (err, resp, body) {
            if (err || res.statusCode != 200)
                throw (err);
            else
                profile = JSON.parse(body);
        })
    } catch (e) {
        console.log(e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noToken)
            return (res.status(400).send(errorMsg.noToken));
        else
            return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send(profile));
}

exports.getFriendList = async (req, res) => {
    var friendList;
    try {
        if (!req.params.kakao_id)
            throw (errorMsg.notEnoughReq);
        const kakaoToken = await models.User.findOne({
            attributes: ['kakaotoken'],
            where: {
                kakao_id: req.params.kakao_id
            }
        })
        if (!kakaoToken) {
            throw (errorMsg.noToken)
        }
        let kakaoOptions = {
            url: 'https://kapi.kakao.com/v1/api/talk/friends',  // target에 해당하는 것을 적기
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + kakaoToken.dataValues.kakaotoken
            },
            encoding: 'UTF-8',
        }
        request(kakaoOptions, function (err, resp, body) {
            if (err || res.statusCode != 200)
                throw (err);
            else
                friendList = JSON.parse(body);
        })
    } catch (e) {
        console.log(e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noToken)
            return (res.status(400).send(errorMsg.noToken));
        else
            return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send(profile));
}

exports.updateToken = async (req, res) => {
    try {
        if (!req.params.kakao_id)
            throw (errorMsg.notEnoughReq);
        await dbUpload.updateToken(req.body.kakaotoken);
    } catch (e) {
        console.log(e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else
            return (res.status(400).send(errorMsg.updateFail));
    }
    return (res.status(201).send(completeMsg.updateComplete));
}