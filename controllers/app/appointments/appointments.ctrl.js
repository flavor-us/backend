const models = require("../../../models")
const errorMsg = require("../../../message/error")
const completeMsg = require("../../../message/complete")
const logger = require("../../../config/logger");
const kakaoIdConvert = require("../../../modules/kakaoIdConvert");

exports.requestAppointment = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    try {
        if (!req.body.request || !req.body.requested)
            throw (errorMsg.notEnoughReq)
        const request_id = await kakaoIdConvert.getUserIdByKakaoId(req.body.request);
        const requested_id = await kakaoIdConvert.getUserIdByKakaoId(req.body.requested);
        const request = await models.User.findOne({
            where: {
                id: request_id
            }
        })
        const requested = await models.User.findOne({
            where: {
                id: requested_id
            }
        })
        if (!request || !requested)
            throw (res.status(400).send(errorMsg.noUser));
        const result = await request.addRequest(requested, { through: { restname: req.body.restname } })
        if (!result)
            throw (errorMsg.appointmentFail);
    } catch (e) {
        logger.error(req.kakao_id ? req.kakao_id : req.headers.host, " [requestAppointments] : ", e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else if (e == errorMsg.appointmentFail)
            return (res.status(400).send(errorMsg.appointmentFail));
        else
            return (res.status(400).send(errorMsg.uploadFail));
    }
    return (res.status(201).send(completeMsg.uploadComplete));
}

exports.checkRequested = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    var requested;
    try {
        if (!req.params.kakao_id)
            throw (errorMsg.notEnoughReq)
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id);
        const user = await models.User.findOne({
            where: {
                id: user_id
            }
        })
        if (!user)
            return (res.status(400).send(errorMsg.noUser));
        requested = await models.Appointments.findAll({
            attributes: ["restname"],
            include: [
                { attributes: ["username"], model: models.User },
            ],
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
        if (!req.params.kakao_id)
            throw (errorMsg.notEnoughReq)
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id);
        const user = await models.User.findOne({
            where: {
                id: user_id
            }
        })
        if (!user)
            return res.status(400).send(errorMsg.noUser);
        await models.Appointments.destroy({
            where: {
                requested_id: user.dataValues.id
            }
        })
    } catch (e) {
        logger.error("[removeAppointments] : ", e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(204).send());
}
