const request = require('request-promise-native');
const models = require("../../../models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const errorMsg = require("../../../message/error");
const completeMsg = require("../../../message/complete");
const dbUpload = require("../../../modules/dbUpload");
const social = require("../../../modules/social");
const logger = require("../../../config/logger");

exports.getProfile = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
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
        await request(kakaoOptions, function (err, resp, body) {
            if (err || resp.statusCode != 200)
                throw (err);
            else
                profile = JSON.parse(body);
        })
    } catch (e) {
        logger.error("[getProfile] : " + e);
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
    logger.info(`${req.method} ${req.url}`);
    var friends, friendList;
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
            url: 'https://kapi.kakao.com/v1/api/talk/friends',// target에 해당하는 것을 적기
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + kakaoToken.dataValues.kakaotoken
            },
            encoding: 'UTF-8',
        }
        friendList = await request(kakaoOptions, function (err, resp, body) {
            if (err || resp.statusCode != 200) {
                throw (err);
            }
            else
                return body;
        })
        friendList = JSON.parse(friendList).elements.map((item) => {
            return item.id;
        })
        friends = await social.getUserList(friendList);
    } catch (e) {
        logger.error("[getFriendList] : " + e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noToken)
            return (res.status(400).send(errorMsg.noToken));
        else
            return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send({ result: friends }));
}

exports.updateToken = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    try {
        if (!req.params.kakao_id || !req.body.kakaotoken)
            throw (errorMsg.notEnoughReq);
        await dbUpload.updateToken(req.body.kakaotoken, req.params.kakao_id);
    } catch (e) {
        logger.error("[updateToken] : " + e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else
            return (res.status(400).send(errorMsg.updateFail));
    }
    return (res.status(201).send(completeMsg.updateComplete));
}