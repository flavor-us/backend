const models = require("../../../models");
const errorMsg = require("../../../message/error");
const completeMsg = require("../../../message/complete");
const kakaoIdConvert = require("../../../modules/kakaoIdConvert")

exports.getFollower = async (req, res) => {
    const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.readFail);
    });
    const followed = await models.Relation.findAll({
        attributes: ["follower_id"],
        where: {
            followed_id: user_id
        }
    }).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.readFail);
    })
    const followerList = followed.map((item) => {
        return item.dataValues.follower_id;
    })
    res.status(200).send({ followerList: followerList });
}

exports.getFollowed = async (req, res) => {
    const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.readFail);
    });
    const followed = await models.Relation.findAll({
        attributes: ["followed_id"],
        where: {
            follower_id: user_id
        }
    }).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.readFail);
    })
    const followedList = followed.map((item) => {
        return item.dataValues.followed_id;
    })
    res.status(200).send({ followedList: followedList });
}
exports.deleteFollower = async (req, res) => {
    const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.readFail);
    })
    await models.Relation.destroy({
        where: {
            follower_id: user_id,
            followed_id: req.params.delete_id
        }
    }).catch((e) => {
        console.log(e);
        res.status(400).send(errorMsg.deleteFail);
    })
    res.status(204).send();

}

exports.makeRelation = async (req, res) => {
    const followed_id = req.body.followed_id;
    const follower_id = req.body.follower_id;
    if (!followed_id || !follower_id)
        return res.status(400).send(errorMsg.notEnoughReq);
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
        return res.status(400).send(errorMsg.noUser);
    await followed.addFollower(follower);
    res.status(201).send(completeMsg.complete);
}