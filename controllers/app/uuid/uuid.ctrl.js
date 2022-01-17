const models = require("../../../models");
const errorMsg = require("../../../message/error");
const logger = require("../../../config/logger");

exports.getUuidById = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    var uuid;
    try {
        if (!req.params.user_id)
            throw (errorMsg.notEnoughReq)
        const user_id = req.params.user_id;
        uuid = await models.User.findOne({
            attributes: ["uuid"],
            where: {
                id: user_id
            }
        })
        if (!uuid)
            throw (errorMsg.noUser);
    } catch (e) {
        logger.error("[getUuidById] : " + JSON.stringify(e));
        if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send({ uuid: uuid.dataValues.uuid }));
}