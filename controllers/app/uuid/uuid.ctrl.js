const models = require("../../../models");
const errorMsg = require("../../../message/error");

exports.getUuidById = async (req, res) => {
    const user_id = req.body.user_id;
    const uuid = await models.User.findOne({
        attributes: ["uuid"],
        where: {
            id: user_id
        }
    }).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.readFail);
    })
    console.log(typeof (uuid.dataValues.uuid));
    res.status(200).send({ uuid: uuid.dataValues.uuid });
}