const dbUpload = require("../../../modules/dbUpload");
const models = require("../../../models");
const errorMsg = require("../../../message/error");
const completeMsg = require("../../../message/complete");
const Sequelize = require("sequelize");
const kakaoIdConvert = require("../../../modules/kakaoIdConvert");
const Op = Sequelize.Op;

exports.uploadContents = async (req, res) => {
    const content = {
        user_id: req.body.user_id,
        rest_id: req.body.rest_id,
        date: new Date(),
        filename: `${req.body.filename}`,
        rekognition: req.body.rekog,
        restname: req.body.restname,
        lat: req.body.lat,
        lng: req.body.lng,
        adj1_id: req.body.adj1_id,
        adj2_id: req.body.adj2_id,
        locationtag_id: req.body.locationtag_id,
    }
    await dbUpload.uploadContent(content).then((content_id) => {
        res.status(201).send({ msg: completeMsg.uploadComplete.msg, content_id: content_id });
    }).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.uploadFail);
    });
}

exports.updateContents = async (req, res) => {
    const content = {
        adj1_id: req.body.adj1_id,
        adj2_id: req.body.adj2_id,
        locationtag_id: req.body.locationtag_id
    }
    await dbUpload.updateContents(content, req.params.content_id).then((content_id) => {
        res.status(201).send({ msg: completeMsg.updateComplete.msg, content_id: content_id });
    }).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.updateFail);
    });
}

exports.deleteContents = async (req, res) => {
    var content;
    try {
        content = await models.Contents.destroy({
            where: {
                id: req.params.content_id
            }
        });
    } catch (e) {
        console.log(e);
        res.status(400).send(errorMsg.deleteFail)
    }
    if (content)
        res.status(204).send();
    else
        res.status(400).send(errorMsg.deleteFail)
}

exports.getMyContents = async (req, res) => {
    const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.readFail);
    })
    const contents = await models.Contents.findAll({
        where: { user_id: user_id }
    }).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.readFail);
    })
    res.status(200).json(contents)
}

exports.getRelevantContents = async (req, res) => {
    const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.readFail);
    })
    const friends = await models.Relation.findAll({
        attributes: ['followed_id'],
        where: {
            follower_id: user_id
        }
    }).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.readFail)
    })
    const friendList = friends.map((item) => {
        return item.dataValues.followed_id;
    })
    const contents = await models.Contents.findAll({
        where: { [Op.or]: [{ user_id: { [Op.in]: friendList } }, { user_id: user_id }] },
        order: [['date', 'DESC']],
    })
    res.status(200).send(contents);
}
