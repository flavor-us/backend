const dbUpload = require("../../../modules/dbUpload");
const models = require("../../../models");
const errorMsg = require("../../../message/error");
const completeMsg = require("../../../message/complete");
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();

exports.addUser = async (req, res) => {
    if (!req.body.email || !req.body.username)
        return res.status(400).send(errorMsg.notEnoughReq);
    const user = {
        uuid: uuidv4(),
        signupdate: new Date(),
        email: req.body.email,
        username: req.body.username
    }
    await dbUpload.uploadUser(user).then((id) => {
        res.status(201).send({ msg: completeMsg.uploadComplete.msg, user_id: id });
    }).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.uploadFail)
    });
}

exports.deleteUser = async (req, res) => {
    var result;
    try {
        result = await models.User.destroy({
            where: {
                id: req.params.user_id
            }
        });
    } catch (e) {
        console.log(e);
        res.status(400).send(errorMsg.deleteFail)
    }
    if (result)
        res.status(204).send();
    else
        res.status(400).send(errorMsg.deleteFail)

}

exports.editProfile = async (req, res) => {
    var profile, user_id;
    profile = {
        username: req.body.username,
        profileImgPath: req.body.profileImgPath
    }
    if (req.body.user_id) {
        user_id = req.body.user_id;
    } else {
        res.status(400).send(errorMsg.notEnoughReq);
    }
    const id = await dbUpload.updateProfile(profile, user_id).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.updateFail);
    })
    res.status(201).send(completeMsg.updateComplete)
}