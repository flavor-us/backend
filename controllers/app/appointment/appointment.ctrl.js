const models = require("../../../models")
const errorMsg = require("../../../message/error")
const completeMsg = require("../../../message/complete")
const app = require("../../../app")

exports.requestAppointment = async (req, res) => {
    try {
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
            return res.status(400).send(errorMsg.noUser);
        await request.addRequest(requested, { through: { restname: req.body.restname } });
    } catch (e) {
        console.log(e);
        return res.status(400).send(errorMsg.uploadFail);
    }
    return (res.status(201).send(completeMsg.uploadComplete));
}

exports.checkRequested = async (req, res) => {
    var requested
    try {
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
        console.log(e);
        res.status(400).send(errorMsg.readFail)
    }
    res.status(200).json({ requested: requested });
}

exports.removeAppointment = async (req, res) => {
    try {
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
        console.log(e);
        return (res.status(400).send(errorMsg.deleteFail));
    }
    res.status(204).send();
}

