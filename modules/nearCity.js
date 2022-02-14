const models = require("../models");
const logger = require("../config/logger");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const distanceModule = require("../modules/distance");

exports.getNearCity = async function (lat, lng) {
    var moe = 0.005;
    var cityList, city = {};
    do {
        cityList = await searchNearCity(parseFloat(lat), parseFloat(lng), moe);
        moe *= 3;
    } while (Object.keys(cityList).length < 1);
    cityList = distanceModule.sortListByDistance(distanceModule.addDistanceElements(cityList, [lat, lng]));
    city = {
        name: cityList ? cityList[0].name : null,
        distance: cityList ? await distanceModule.getMeterDistance(lat, cityList[0].lat, lng, cityList[0].lng) : null
    }
    return (city);
}

searchNearCity = async function (lat, lng, moe) {
    var city = {};
    try {
        city = await models.City.findAll({
            attributes: ["name", "lat", "lng"],
            where: {
                lat: { [Op.between]: [lat - moe, lat + moe] },
                lng: { [Op.between]: [lng - moe, lng + moe] },
            },
        });
    } catch (error) {
        logger.error(error);
    }
    return city;
};