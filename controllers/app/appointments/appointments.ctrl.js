const models = require("../../../models")
const errorMsg = require("../../../message/error")
const completeMsg = require("../../../message/complete")
const logger = require("../../../config/logger");
const kakaoIdConvert = require("../../../modules/kakaoIdConvert");
const dbUpload = require("../../../modules/dbUpload");

exports.requestAppointment = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    try {
        if (!req.body.request || !req.body.requested)
            throw (errorMsg.notEnoughReq)
        const request_id = await kakaoIdConvert.getUserIdByKakaoId(req.body.request);
        const requested_id = await kakaoIdConvert.getUserIdByKakaoId(req.body.requested);
        const appointment = {
            request_id: request_id,
            requested_id: requested_id,
            restname: req.body.restname
        }
        const result = await dbUpload.uploadAppointment(appointment);
        if (!result)
            throw (errorMsg.appointmentFail);
    } catch (e) {
        console.log(typeof (e.parent));
        if (e.parent !== undefined && e.parent.code == "ER_DUP_ENTRY")
            return (res.status(400).send(errorMsg.duplicatedEntry));
        logger.error("requestAppointment : " + e)
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
            attributes: ["id", "restname"],
            include: [
                { attributes: ["username"], model: models.User },
            ],
            where: {
                requested_id: user.dataValues.id
            }
        })
    } catch (e) {
        logger.error("[checkRequested] : " + JSON.stringify(e));
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).json({ result: requested }));
}

exports.removeAllAppointments = async (req, res) => {
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
        logger.error("[removeAllAppointments] : " + JSON.stringify(e));
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(204).send());
}

exports.removeAppointment = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    try {
        const appointment_id = req.params.appointment_id;
        await models.Appointments.destroy({
            where: {
                id: appointment_id
            }
        })
    } catch (e) {
        logger.error("[removeAppointment] : " + JSON.stringify(e));
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else
            return (res.status(400).send(errorMsg.deleteFail));
    }
    return (res.status(204).send());
}