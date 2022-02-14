const models = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const logger = require("../config/logger");
const distanceModule = require("../modules/distance");

exports.getNearStation = async function (lat, lng) {
    var moe = 0.0004;//0.0012 -> 0.0036 -> 0.0108
    var stationList, station = {};
    do {
        stationList = await searchNearStation(parseFloat(lat), parseFloat(lng), moe);
        if (moe > 0.11)//1.1km
            break;
        moe *= 3;
    } while ((Object.keys(stationList).length < 1))
    if (Object.keys(stationList).length > 0) {
        stationList = distanceModule.sortListByDistance(distanceModule.addDistanceElements(stationList, [lat, lng]));
        console.log(stationList);
        station = {
            name: stationList[0].name + "역",
            distance: await distanceModule.getMeterDistance(lat, stationList[0].lat, lng, stationList[0].lng)
        }
        return (station);
    }
    else
        return (null);
}

searchNearStation = async function (lat, lng, moe) {
    var station = {};
    try {
        station = await models.Stations.findAll({
            attributes: ["name", "lat", "lng"],
            where: {
                lat: { [Op.between]: [lat - moe, lat + moe] },
                lng: { [Op.between]: [lng - moe, lng + moe] },
            },
        });
    } catch (error) {
        logger.error(error);
    }
    console.log(station);
    return station;
};