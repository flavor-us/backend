const models = require("../../../models")
const errorMsg = require("../../../message/error")
const completeMsg = require("../../../message/complete")
const app = require("../../../app")

exports.requestAppointment = async (req, res) => {
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
    try {
        await request.addRequest(requested, { through: { restname: req.body.restname } });
    } catch (e) {
        console.log(e);
        return res.status(400).send(errorMsg.uploadFail);
    }
    res.status(201).send(completeMsg.uploadComplete);
}

exports.checkRequested = async (req, res) => {
    const user = await models.User.findOne({
        where: {
            id: req.body.user_id
        }
    }).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.readFail)
    })
    if (!user)
        return res.status(400).send(errorMsg.noUser);
    const requested = await models.Appointment.findAll({
        where: {
            requested_id: user.dataValues.id
        }
    }).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.readFail)
    })
    res.status(200).json({ requested: requested });
}

exports.removeAppointment = async (req, res) => {
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
    res.status(204).send();
}

