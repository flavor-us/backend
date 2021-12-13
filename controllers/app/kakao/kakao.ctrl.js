const request = require('request');
const models = require("../../../models");
const errorMsg = require("../../../message/error");
const completeMsg = require("../../../message/complete");

exports.getProfile = async (req, res) => {
    const kakaoToken = await models.User.findOne({
        attributes: ['kakaotoken'],
        where: {
            kakao_id: req.params.kakao_id
        }
    }).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.readFail);
    })
    console.log(kakaoToken)
    let kakaoOptions = {
        url: 'https://kapi.kakao.com/v1/api/talk/profile',  // target에 해당하는 것을 적기
        method: 'GET',
        headers: {
            'Authorization': "Bearer " + kakaoToken.dataValues.kakaotoken
        },
        encoding: 'UTF-8',
    }
    request(kakaoOptions, function (err, resp, body) {
        if (!err && res.statusCode == 200) {
            console.log(JSON.parse(body));
            res.status(200).send(JSON.parse(body))
        }
        else {
            console.log(err, body, res);
            res.status(400).send("failed")
        }
    })
}

exports.getFriendList = async (req, res) => {
    const kakaoToken = await models.User.findOne({
        attributes: ['kakaotoken'],
        where: {
            kakao_id: req.params.kakao_id
        }
    }).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.readFail);
    })
    let kakaoOptions = {
        url: 'https://kapi.kakao.com/v1/api/talk/friends',  // target에 해당하는 것을 적기
        method: 'GET',
        headers: {
            'Authorization': "Bearer " + kakaoToken.dataValues.kakaotoken
        },
        encoding: 'UTF-8',
    }
    request(kakaoOptions, function (err, resp, body) {
        if (!err && res.statusCode == 200) {
            console.log(JSON.parse(body));
            res.status(200).send(JSON.parse(body))
        }
        else {
            console.log(err, body, res);
            res.status(400).send("failed")
        }
    })
}

exports.updateToken = async (req, res) => {
    const user = await models.User.findOne({
        where: {
            kakao_id: req.params.kakao_id
        }
    }).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.updateFail);
    });
    if (user) {
        user.set({
            kakaotoken: req.body.kakaotoken
        })
        await user.save();
        res.status(201).send(completeMsg.updateComplete);
    } else {
        res.status(400).send(errorMsg.updateFail);
    }
}