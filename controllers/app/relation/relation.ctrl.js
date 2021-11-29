const models = require("../../../models");
const errorMsg = require("../../../message/error");
const completeMsg = require("../../../message/complete");

exports.getFollower = async (req, res) => {
    await models.User.findOne({
        where: {
            uuid: req.params.user_uuid
        }
    }).then(async (user) => {
        const followed = await models.Relation.findAll({
            attributes: ["following_id"],
            where: {
                followed_id: user.id
            }
        })
        const followerList = followed.map((item) => {
            return item.dataValues.following_id;
        })
        return followerList;
    }).then((followerList) => {
        res.status(200).send({ followerList: followerList });
    }).catch((err) => {
        console.log(err);
        res.status(400).send(errorMsg.readFail);
    })
}

exports.getFollowing = async (req, res) => {
    await models.User.findOne({
        where: {
            uuid: req.params.user_uuid
        }
    }).then(async (user) => {
        const following = await models.Relation.findAll({
            attributes: ["followed_id"],
            where: {
                following_id: user.id
            }
        }).catch((e) => console.log(e));
        const followingList = following.map((item) => {
            return item.dataValues.followed_id;
        })
        return followingList
    }).then((followingList) => {
        res.status(200).send({ followingList: followingList });
    }).catch((err) => {
        console.log(err);
        res.status(400).send(errorMsg.readFail);
    })
}
exports.deleteFollowing = async (req, res) => {
    await models.User.findOne({
        where: {
            uuid: req.params.user_uuid
        }
    }).then(async (user) => {
        await models.Relation.destroy({
            where: {
                follower_id: user.id,
                followed_id: req.params.delete_id
            }
        }).catch((e) => console.log(e));
    }).then(() => {
        res.status(204).send();
    }).catch((err) => {
        console.log(err);
        res.status(400).send(errorMsg.deleteFail);
    })
}

exports.makeRelation = async (req, res) => {
    const followed_id = req.body.followed_id;
    const following_id = req.body.following_id;
    if (!followed_id || !following_id)
        return res.status(400).send(errorMsg.notEnoughReq);
    const followed = await models.User.findOne({
        where: {
            id: followed_id
        }
    })
    const following = await models.User.findOne({
        where: {
            id: following_id
        }
    })
    await followed.addFollowing(following);
    res.status(201).send(completeMsg.complete);
}