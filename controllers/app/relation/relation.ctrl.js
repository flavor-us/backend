const models = require("../../../models");
const errorMsg = require("../../../message/error");
const completeMsg = require("../../../message/complete");
const kakaoIdConvert = require("../../../modules/kakaoIdConvert")

exports.getFollower = async (req, res) => {
    var followerList;
    try {
        if (!req.params.kakao_id)
            throw (errorMsg.notEnoughReq);
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id);
        if (!user_id)
            throw (errorMsg.noUser);
        const followed = await models.Relation.findAll({
            attributes: ["follower_id"],
            where: {
                followed_id: user_id
            }
        })
        followerList = followed.map((item) => {
            return item.dataValues.follower_id;
        })
    } catch (e) {
        console.log(e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.readFail));
    }
    res.status(200).send({ followerList: followerList });
}

exports.getFollowed = async (req, res) => {
    var followedList;
    try {
        if (!req.params.kakao_id)
            throw (errorMsg.notEnoughReq);
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id);
        if (!user_id)
            throw (errorMsg.noUser);
        const followed = await models.Relation.findAll({
            attributes: ["followed_id"],
            where: {
                follower_id: user_id
            }
        })
        followedList = followed.map((item) => {
            return item.dataValues.followed_id;
        })
    } catch (e) {
        console.log(e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send({ followedList: followedList }));
}

exports.deleteFollower = async (req, res) => {
    try {
        if (!req.params.kakao_id)
            throw (errorMsg.notEnoughReq);
        const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id);
        if (!user_id)
            throw (errorMsg.noUser);
        await models.Relation.destroy({
            where: {
                follower_id: user_id,
                followed_id: req.params.delete_id
            }
        })
    } catch (e) {
        console.log(e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noUser)
            res.status(400).send(errorMsg.noUser);
        else
            res.status(400).send(errorMsg.deleteFail);
    }
    res.status(204).send();
}

exports.makeRelation = async (req, res) => {
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
        console.log(e);
        if (e == errorMsg.notEnoughReq)
            return (res.status(400).send(errorMsg.notEnoughReq));
        else if (e == errorMsg.noUser)
            return (res.status(400).send(errorMsg.noUser));
        else
            return (res.status(400).send(errorMsg.uploadFail));
    }
    res.status(201).send(completeMsg.complete);
}