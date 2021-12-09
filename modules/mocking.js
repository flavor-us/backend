const models = require("../models");
const dbUpload = require("./dbUpload");
exports.makeMock = async function () {
    var id;
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
        email: "jest@jest.com",
        kakaotoken: "testtoken"
    });
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

