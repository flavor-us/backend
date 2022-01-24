const models = require("../models");

exports.makerelation = async (follower_id, followed_id) => {
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
    await follower.addFollower(followed);
}