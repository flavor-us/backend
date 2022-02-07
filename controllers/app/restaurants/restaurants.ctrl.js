const nameModule = require("../../../modules/getName");
const errorMsg = require("../../../message/error");
const logger = require("../../../config/logger");
const restModule = require("../../../modules/restaurants");

exports.getRestaurantList = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    if (req.query.lat == "null" || !req.query.lat || !req.query.lng || req.query.lng == "null")
        return (res.status(400).send(errorMsg.notEnoughReq));
    try {
        const defaultLat = Number(req.query.lat);
        const defaultLng = Number(req.query.lng);
        var restList, moe = 0.0004; // 약 4m
        do {
            restList = await nameModule.getNearRestaurants(defaultLat, defaultLng, moe);
            moe *= 2;
            if ((moe > 0.001 && req.query.option != "more") || moe > 0.01) // 약 100m, more 옵션 있을 경우 1km
                break;
        } while ((Object.keys(restList).length < 5 || req.query.option == "more") && Object.keys(restList).length < 20);
        restList = restModule.sortRestaurantList(restModule.addDistanceElements(restList, [defaultLat, defaultLng]));
    } catch (e) {
        logger.error("[getRestaurantList] : " + e);
        return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send({ length: restList.length, result: restList }))
}

