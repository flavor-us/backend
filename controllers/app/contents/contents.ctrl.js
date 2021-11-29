const dbUpload = require("../../../modules/dbUpload");
const models = require("../../../models");
const errorMsg = require("../../../message/error");
const completeMsg = require("../../../message/complete");

exports.uploadContents = async (req, res) => {
    const content = {
        user_id: req.body.user,
        date: new Date(),
        filename: `${req.body.filename}`,
        rekognition: req.body.rekog,
        restname: req.body.restname,
        tagList: req.body.tagList
    }
    await dbUpload.uploadContent(content).then((content_id) => {
        res.status(201).send([completeMsg.uploadComplete, { content_id: content_id }]);
    }).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.uploadFail);
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
    const userUUID = req.params.user_uuid;
    const user = await models.User.findOne({
        where: {
            uuid: userUUID
        }
    }).catch((e) => {
        console.log(e)
        res.status(400).send(errorMsg.readFail);
    });
    const user_id = user.id;
    const contents = await models.Contents.findAll({
        where: { user_id: user_id }
    })
    res.status(200).json(contents)
}