const models = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const logger = require("../config/logger");

exports.getNearStation = async function (lat, lng) {
    var moe = 0.0004;
    var stationData, station = {};
    do {
        stationData = await getStation(parseFloat(lat), parseFloat(lng), moe);
        moe *= 3;
        if (moe > 0.01)
            break;
    } while (!stationData);
    if (stationData) {
        station = {
            name: stationData.dataValues.name + "역",
            distance: await getMeterDistance(lat, stationData.dataValues.lat, lng, stationData.dataValues.lng)
        }
        return (station);
    }
    else
        return (null);
}

getMeterDistance = async function (lat1, lat2, lng1, lng2) {
    var distance = Math.round(Math.sqrt(Number(Number(Math.pow(lat1 - lat2, 2)).toFixed(8)) + Number(Number(Math.pow(lng1 - lng2, 2)).toFixed(8))) * 100000);
    if (distance > 1000)
        distance = Math.ceil((distance / 1000) * 10) / 10 + "k";
    return (distance + "m");
}

getStation = async function (lat, lng, moe) {
    var station = {};
    try {
        station = await models.Stations.findOne({
            attributes: ["name", "lat", "lng"],
            where: {
                lat: { [Op.between]: [lat - moe, lat + moe] },
                lng: { [Op.between]: [lng - moe, lng + moe] },
            },
        });
    } catch (error) {
        logger.error(error);
    }
    return station;
};