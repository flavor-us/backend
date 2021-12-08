const request = require('request');
const models = require("../../../models");
const errorMsg = require("../../../message/error");
const completeMsg = require("../../../message/complete");

// exports.testApi = async (req, resp) => {
//     let kakaoOptions = {
//         url: 'https://kapi.kakao.com/ v1/api/talk/friends',  // target에 해당하는 것을 적기
//         method: 'GET',
//         headers: {
//             'Authorization': "Bearer rYZXl4TN0iXmASb_4masdTBmt2yHJtvvZjprAQo9cpgAAAF9k-V3IA"
//         },
//         encoding: 'UTF-8',
//     }
//     request(kakaoOptions, function (err, res, body) {
//         if (!err && res.statusCode == 200) {
//             console.log(JSON.parse(body));
//             resp.status(200).send(JSON.parse(body))
//         }
//         else {
//             console.log(err, body, res);
//             resp.status(400).send("failed")
//         }
//     })
// }

exports.updateToken = async (req, res) => {
    const uuid = req.params.user_uuid;
    if (!uuid)
        res.status(400).send(errorMsg.updateFail);
    const user = await models.User.findOne({
        where: {
            uuid: uuid
        }
    }).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.updateFail);
    });
    user.set({
        kakaotoken: req.body.kakaotoken
    })
    await user.save();
    res.status(201).send(completeMsg.updateComplete);
}