const models = require("../models");

exports.getIdFromUuid = async (uuid) => {
    const user = await models.User.findOne({
        where: {
            uuid: uuid
        }
    }).catch((e) => console.log(e));
    return (user.id)
}
