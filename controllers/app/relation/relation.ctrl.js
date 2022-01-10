const models = require("../../../models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const errorMsg = require("../../../message/error");
const completeMsg = require("../../../message/complete");
const kakaoIdConvert = require("../../../modules/kakaoIdConvert")
const social = require("../../../modules/social");
const logger = require("../../../config/logger");

exports.getFollower = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    var followers;
    try {
        if (!req.params.kakao_id)
            throw (errorMsg.notEnoughReq);
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id);
        const followed = await models.Relation.findAll({
            attributes: ["follower_id"],
            where: {
                followed_id: user_id
            }
        })
        const followerList = followed.map((item) => {
            return item.dataValues.follower_id;
        })
        followers = await social.getUserList(followerList);
    } catch (e) {
        logger.error("[getFollower] : ", e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send({ result: followers }));
}

exports.getFollowed = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    var followeds;
    try {
        if (!req.params.kakao_id)
            throw (errorMsg.notEnoughReq);
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id);
        const followed = await models.Relation.findAll({
            attributes: ["followed_id"],
            where: {
                follower_id: user_id
            }
        })
        const followedList = followed.map((item) => {
            return (item.dataValues.followed_id);
        })
        followeds = await social.getUserList(followedList);
    } catch (e) {
        logger.error("[getFollowed] : ", e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send({ result: followeds }));
}

exports.deleteFollower = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    try {
        if (!req.params.kakao_id)
            throw (errorMsg.notEnoughReq);
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id);
        await models.Relation.destroy({
            where: {
                follower_id: user_id,
                followed_id: req.params.delete_id
            }
        })
    } catch (e) {
        logger.error("[deleteFollower] : ", e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.deleteFail));
    }
    return (res.status(204).send());
}

exports.makeRelation = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    try {
        const followed_id = req.body.followed_id;
        const follower_id = req.body.follower_id;
        if (!followed_id || !follower_id)
            throw (errorMsg.notEnoughReq);
        const followed = await models.User.findOne({
            where: {
                id: followed_id
            }
        })
        const follower = await models.User.findOne({
            where: {
                id: follower_id
            }
        })
        if (!followed || !follower)
            throw (errorMsg.noUser);
        await followed.addFollower(follower);
    } catch (e) {
        logger.error("[makeRelation] : ", e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.uploadFail));
    }
    return (res.status(201).send(completeMsg.complete));
}