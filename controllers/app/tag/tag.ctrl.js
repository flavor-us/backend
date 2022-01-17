const models = require("../../../models")
const errorMsg = require("../../../message/error");
const logger = require("../../../config/logger");

exports.getadj1 = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    var adj1;
    try {
        adj1 = await models.Tag_FirstAdj.findAll({});
    } catch (e) {
        logger.error("[getadj1] : " + JSON.stringify(e));
        return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send({ result: adj1 }));
}

exports.getadj2 = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    var adj2;
    try {
        adj2 = await models.Tag_SecondAdj.findAll({});
    } catch (e) {
        logger.error("[getadj2] : " + JSON.stringify(e));
        return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send({ result: adj2 }));
}

exports.getlocationtag = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    var locationtag;
    try {
        locationtag = await models.Tag_Location.findAll({})
    } catch (e) {
        logger.error("[getlocationtag] : " + JSON.stringify(e));
        return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send({ result: locationtag }));
}