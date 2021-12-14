const models = require("../../../models");
const errorMsg = require("../../../message/error");

exports.getUuidById = async (req, res) => {
    var uuid;
    try {
        const user_id = req.body.user_id;
        uuid = await models.User.findOne({
            attributes: ["uuid"],
            where: {
                id: user_id
            }
        })
        if (!uuid)
            throw (errorMsg.noUser);
    } catch (e) {
        console.log(e);
        if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send({ uuid: uuid.dataValues.uuid }));
}