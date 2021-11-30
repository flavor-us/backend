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
            attributes: ["follower_id"],
            where: {
                followed_id: user.id
            }
        })
        const followerList = followed.map((item) => {
            return item.dataValues.follower_id;
        })
        return followerList;
    }).then((followerList) => {
        res.status(200).send({ followerList: followerList });
    }).catch((err) => {
        console.log(err);
        res.status(400).send(errorMsg.readFail);
    })
}

exports.getFollower = async (req, res) => {
    await models.User.findOne({
        where: {
            uuid: req.params.user_uuid
        }
    }).then(async (user) => {
        const follower = await models.Relation.findAll({
            attributes: ["followed_id"],
            where: {
                follower_id: user.id
            }
        }).catch((e) => console.log(e));
        const followerList = follower.map((item) => {
            return item.dataValues.followed_id;
        })
        return followerList
    }).then((followerList) => {
        res.status(200).send({ followerList: followerList });
    }).catch((err) => {
        console.log(err);
        res.status(400).send(errorMsg.readFail);
    })
}
exports.deleteFollower = async (req, res) => {
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