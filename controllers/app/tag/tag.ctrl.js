const models = require("../../../models")
const errorMsg = require("../../../message/error");

exports.getadj1 = async (_, res) => {
    var adj1;
    try {
        adj1 = await models.Tag_FirstAdj.findAll({});
    } catch (e) {
        console.log(e);
        return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send({ adj1: adj1 }));
}

exports.getadj2 = async (_, res) => {
    var adj2;
    try {
        adj2 = await models.Tag_SecondAdj.findAll({});
    } catch (e) {
        console.log(e);
        return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send({ adj2: adj2 }));
}

exports.getlocationtag = async (_, res) => {
    var locationtag;
    try {
        locationtag = await models.Tag_Location.findAll({})
    } catch (e) {
        console.log(e);
        return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send({ locationtag: locationtag }));
}