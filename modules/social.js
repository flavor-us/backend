const models = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const logger = require("../../../config/logger");

exports.getUserList = async function (list) {
    const UserList = await models.User.findAll({
        attributes: ["id", "username", "profileimg_path"],
        where: { kakao_id: { [Op.in]: list } }
    })
    return (UserList);
}