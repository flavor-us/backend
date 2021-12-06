const models = require("../../../models")
const errorMsg = require("../../../message/error");

exports.getadj1 = async (_, res) => {
    const adj1 = await models.Tag_FirstAdj.findAll({

    }).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.readFail);
    })
    res.status(200).send(adj1);
}

exports.getadj2 = async (_, res) => {
    const adj2 = await models.Tag_FirstAdj.findAll({

    }).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.readFail);
    })
    res.status(200).send(adj2);
}

exports.getlocationtag = async (_, res) => {
    const locationtag = await models.Tag_FirstAdj.findAll({

    }).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.readFail);
    })
    res.status(200).send(locationtag);
}