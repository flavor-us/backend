const models = require("../../../models")
const errorMsg = require("../../../message/error")
const completeMsg = require("../../../message/complete")
const logger = require("../../../config/logger");

exports.requestAppointment = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    try {
        if (!req.body.request || !req.body.requested)
            throw (errorMsg.notEnoughReq)
        const request = await models.User.findOne({
            where: {
                id: req.body.request
            }
        })
        const requested = await models.User.findOne({
            where: {
                id: req.body.requested
            }
        })
        if (!request || !requested)
            throw (res.status(400).send(errorMsg.noUser));
        await request.addRequest(requested, { through: { restname: req.body.restname } });
    } catch (e) {
        logger.error(req.kakao_id ? req.kakao_id : req.header.host, "[requestAppointment] : ", e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.uploadFail));
    }
    return (res.status(201).send(completeMsg.uploadComplete));
}

exports.checkRequested = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    var requested;
    try {
        if (!req.body.user_id)
            throw (errorMsg.notEnoughReq)
        const user = await models.User.findOne({
            where: {
                id: req.body.user_id
            }
        })
        if (!user)
            return (res.status(400).send(errorMsg.noUser));
        requested = await models.Appointment.findAll({
            where: {
                requested_id: user.dataValues.id
            }
        })
    } catch (e) {
        logger.error("[checkRequested] : ", e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).json({ result: requested }));
}

exports.removeAppointment = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    try {
        if (!req.body.user_id)
            throw (errorMsg.notEnoughReq)
        const user = await models.User.findOne({
            where: {
                id: req.body.user_id
            }
        })
        if (!user)
            return res.status(400).send(errorMsg.noUser);
        await models.Appointment.destroy({
            where: {
                requested_id: user.dataValues.id
            }
        })
    } catch (e) {
        logger.error("[removeAppointment] : ", e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(204).send());
}
