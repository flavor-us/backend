const models = require("../../../models");
const errorMsg = require("../../../message/error");
const Sequelize = require("sequelize");
const uuidConvert = require("../../../modules/uuidConvert");
const Op = Sequelize.Op;

exports.getFeedsContents = async (req, res) => {
    const user_id = await uuidConvert.getIdFromUuid(req.params.user_uuid);
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
        where: { user_id: { [Op.in]: friendList } }
    })
    res.status(200).send(contents);
}