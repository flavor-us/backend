const models = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getNearStation = async function (lat, lng) {
    var moe = 0.00004;
    var stationData;
    do {
        stationData = await getStation(lat, lng, moe);
        moe *= 10;
        if (moe > 0.05) // 약 5000m
            break;
    } while (!stationData);
    var station = {
        name: stationData ? stationData.dataValues.name : null,
        distance: stationData ? await getMeterDistance(lat, stationData.dataValues.lat, lng, stationData.dataValues.lng) : null
    }
    return (station);
}

getMeterDistance = async function (lat1, lat2, lng1, lng2) {
    var distance = Math.round(Math.sqrt(Number(Number(Math.pow(lat1 - lat2, 2)).toFixed(8)) + Number(Number(Math.pow(lng1 - lng2, 2)).toFixed(8))) * 100000);
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
        console.log(error);
    }
    return station;
};