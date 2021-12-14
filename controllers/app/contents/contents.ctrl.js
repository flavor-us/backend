const dbUpload = require("../../../modules/dbUpload");
const models = require("../../../models");
const errorMsg = require("../../../message/error");
const completeMsg = require("../../../message/complete");
const Sequelize = require("sequelize");
const kakaoIdConvert = require("../../../modules/kakaoIdConvert");
const Op = Sequelize.Op;

exports.uploadContents = async (req, res) => {
    var content_id;
    try {
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
        content_id = await dbUpload.uploadContent(content);
    } catch (e) {
        console.log(e);
        return (res.status(400).send(errorMsg.uploadFail));
    };
    return (res.status(201).send({ msg: completeMsg.uploadComplete.msg, content_id: content_id }));
}

exports.updateContents = async (req, res) => {
    var content_id;
    try {
        const content = {
            adj1_id: req.body.adj1_id,
            adj2_id: req.body.adj2_id,
            locationtag_id: req.body.locationtag_id
        }
        content_id = await dbUpload.updateContents(content, req.params.content_id);
    } catch (e) {
        console.log(e);
        res.status(400).send(errorMsg.updateFail);
    }
    return (res.status(201).send({ msg: completeMsg.updateComplete.msg, content_id: content_id }));
}

exports.deleteContents = async (req, res) => {
    try {
        const content = await models.Contents.destroy({
            where: {
                id: req.params.content_id
            }
        });
        if (!content)
            throw 'No contents arresponding req.params.content_id'
    } catch (e) {
        console.log(e);
        return (res.status(400).send(errorMsg.deleteFail));
    }
    return (res.status(204).send());
}

exports.getMyContents = async (req, res) => {
    var contents;
    try {
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id);
        contents = await models.Contents.findAll({
            where: { user_id: user_id }
        })
    } catch (e) {
        console.log(e);
        res.status(400).send(errorMsg.readFail);
    }
    res.status(200).json(contents)
}

exports.getRelevantContents = async (req, res) => {
    var contents;
    try {
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id);
        const friends = await models.Relation.findAll({
            attributes: ['followed_id'],
            where: {
                follower_id: user_id
            }
        })
        const friendList = friends.map((item) => {
            return item.dataValues.followed_id;
        })
        contents = await models.Contents.findAll({
            where: { [Op.or]: [{ user_id: { [Op.in]: friendList } }, { user_id: user_id }] },
            order: [['date', 'DESC']],
        })
    } catch (e) {
        console.log(e);
        res.status(400).send(errorMsg.readFail)
    }
    res.status(200).send(contents);
}
