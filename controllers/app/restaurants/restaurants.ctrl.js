const nameModule = require("../../../modules/getName");
const errorMsg = require("../../../message/error");
// const deleteFileModule = require("../../../modules/deleteFile");
const logger = require("../../../config/logger");
const restModule = require("../../../modules/restaurants");

// exports.getNames = async (req, res) => {
//     logger.info(`${req.method} ${req.url}`);
//     var restData, restList, moe = 0.00004; // 약 4m 반경
//     var defaultData = {};
//     try {
//         if (!req.file)
//             throw (errorMsg.notEnoughReq);
//         const gpsDMS = await nameModule.getExif(req.file.path);
//         if (!gpsDMS || !gpsDMS[0] || !gpsDMS[1]) {
//             throw (errorMsg.noLatLng);
//         } else {
//             const gpsDegree = nameModule.convertLatLng(gpsDMS[0], gpsDMS[1]);
//             console.log(gpsDegree);
//             [defaultData.lat, defaultData.lng] = [String(gpsDegree[0]), String(gpsDegree[1])];
//             do {
//                 restList = await nameModule.getNearRestaurants(gpsDegree[0], gpsDegree[1], moe);
//                 moe *= 3;
//                 if (moe > 0.003) // 약100m
//                     break;
//             } while (Object.keys(restList).length < 3 || moe < 0.0005);
//             restData = restList.map((item) => {
//                 return item.dataValues;
//             });
//         }
//     } catch (e) {
//         logger.error("[getNames] : " + e);
//         if (e == errorMsg.noLatLng)
//             return (res.status(400).send(errorMsg.noLatLng));
//         if (e == errorMsg.noRestaurants)
//             return (res.status(400).send(errorMsg.noRestaurants));
//         else
//             return (res.status(400).send(errorMsg.readFail));
//     } finally {
//         deleteFileModule.deleteFile(req.file.path);
//     }
//     return (res.status(200).json({ default_lat: defaultData.lat, default_lng: defaultData.lng, result: restData }));
// }

exports.getRestaurantList = async (req, res) => {
    logger.info(`${req.method} ${req.url}`);
    if (req.query.lat == "null" || !req.query.lat || !req.query.lng || req.query.lng == "null")
        return (res.status(400).send(errorMsg.notEnoughReq));
    try {
        const defaultLat = Number(req.query.lat);
        const defaultLng = Number(req.query.lng);
        var restList, moe = 0.00004;
        do {
            restList = await nameModule.getNearRestaurants(defaultLat, defaultLng, moe);
            moe *= 2;
            if (moe > 0.001) // 약 100m
                break;
        } while (Object.keys(restList).length < 5);
        restList = restModule.sortRestaurantList(restModule.addDistanceElements(restList, [defaultLat, defaultLng]));
    } catch (e) {
        logger.error("[getRestaurantList] : " + e);
        return (res.status(400).send(errorMsg.readFail));
    }
    return (res.status(200).send({ length: restList.length, result: restList }))
}