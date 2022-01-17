const dbUpload = require("../../../modules/dbUpload");
const models = require("../../../models");
const errorMsg = require("../../../message/error");
const completeMsg = require("../../../message/complete");
const { v4: uuidv4 } = require('uuid');
const kakaoIdConvert = require("../../../modules/kakaoIdConvert");
const logger = require("../../../config/logger");

exports.addUser = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    var user_id;
    try {
        if (!req.body.email || !req.body.username || !req.body.kakao_id)
            throw (errorMsg.notEnoughReq);
        const user = {
            uuid: uuidv4(),
            signupdate: new Date(),
            email: req.body.email,
            username: req.body.username,
            kakaotoken: req.body.kakaotoken,
            kakao_id: req.body.kakao_id
        }
        user_id = await dbUpload.uploadUser(user);
    } catch (e) {
        logger.error("[addUser] : " + JSON.stringify(e));
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else
            return (res.status(400).send(errorMsg.uploadFail));
    };
    return (res.status(201).send({ msg: completeMsg.uploadComplete.msg, user_id: user_id }));
}

exports.deleteUser = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    try {
        if (!req.params.kakao_id)
            throw (errorMsg.notEnoughReq);
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id);
        const result = await models.User.destroy({
            where: {
                id: user_id
            }
        });
        if (!result)
            throw (errorMsg.noUser)
    } catch (e) {
        logger.error("[deleteUser] : " + JSON.stringify(e));
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.deleteFail));
    }
    return (res.status(204).send());
}

exports.editProfile = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    try {
        let profile = {};
        if (!req.params.kakao_id || (!req.body.username && !req.body.profileimg_path))
            throw (errorMsg.notEnoughReq);
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id);
        if (req.body.username)
            profile.username = req.body.username
        if (req.body.profileimg_path)
            profile.profileimg_path = req.body.profileimg_path
        await dbUpload.updateProfile(profile, user_id);
    } catch (e) {
        logger.error("[editProfile] : " + JSON.stringify(e));
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.updateFail));
    }
    return (res.status(201).send(completeMsg.updateComplete));
}

exports.getProfile = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    var profile;
    try {
        if (!req.params.user_id)
            throw (errorMsg.notEnoughReq);
        const user_id = req.params.user_id;
        profile = await models.User.findOne({
            attributes: ["username", "profileimg_path"],
            where: {
                id: user_id
            }
        })
        if (!user_id)
            throw (errorMsg.noUser);
    } catch (e) {
        logger.error("[getProfile] : " + JSON.stringify(e));
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send(profile));
}