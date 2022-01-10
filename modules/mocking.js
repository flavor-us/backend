const models = require("../models");
const dbUpload = require("./dbUpload");
const { v4: uuidv4 } = require('uuid');
const kakaoIdConvert = require("../modules/kakaoIdConvert");
const logger = require("../../../config/logger");

exports.makeMock = async function () {
    var id = {};
    id.content = await dbUpload.uploadContent({
        user_id: 1,
        rest_id: 10000,
        filename: "jest",
        rekog: { Labels: { "jest": "jest" } },
        restname: "jest",
        adj1_id: 1,
        adj2_id: 1,
        locationtag_id: 1,
        lat: 127.1,
        lng: 37.1
    })
    id.user = await dbUpload.uploadUser({
        username: "jest",
        signupdate: new Date(),
        email: "jest@jest.com",
        kakaotoken: "testtoken",
        uuid: uuidv4(),
        kakao_id: 999
    });
    id.kakao = await kakaoIdConvert.getKakaoIdByUserId(id.user);
    return (id);
}

exports.deleteMock = async function () {
    await models.Contents.destroy({
        where: {
            filename: "jest"
        }
    });
    await models.User.destroy({
        where: {
            username: "jest"
        }
    });
}

