const request = require('request');
const models = require("../../../models");
const errorMsg = require("../../../message/error");
const completeMsg = require("../../../message/complete");

exports.getProfile = async (req, res) => {
    var profile;
    try {
        const kakaoToken = await models.User.findOne({
            attributes: ['kakaotoken'],
            where: {
                kakao_id: req.params.kakao_id
            }
        })
        if (!kakaoToken) {
            throw 'Token not found'
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
        return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send(profile));
}

exports.getFriendList = async (req, res) => {
    var friendList;
    try {
        const kakaoToken = await models.User.findOne({
            attributes: ['kakaotoken'],
            where: {
                kakao_id: req.params.kakao_id
            }
        })
        if (!kakaoToken) {
            throw 'Token not found'
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
        return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send(profile));
}

exports.updateToken = async (req, res) => {
    try {
        const user = await models.User.findOne({
            where: {
                kakao_id: req.params.kakao_id
            }
        });
        if (!user) {
            throw 'User not found'
        }
        await user.set({
            kakaotoken: req.body.kakaotoken
        })
        await user.save();
    } catch (e) {
        console.log(e);
        res.status(400).send(errorMsg.updateFail);
    }
    res.status(201).send(completeMsg.updateComplete);
}