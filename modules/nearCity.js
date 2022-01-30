const models = require("../models");
const logger = require("../config/logger");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getNearCity = async function (lat, lng) {
    var moe = 0.005;
    var cityData, city = {};
    do {
        cityData = await getCity(parseFloat(lat), parseFloat(lng), moe);
        moe *= 3;
    } while (!cityData);
    city = {
        name: cityData ? cityData.dataValues.name : null,
        distance: cityData ? await getMeterDistance(lat, cityData.dataValues.lat, lng, cityData.dataValues.lng) : null
    }
    return (city);
}

getMeterDistance = async function (lat1, lat2, lng1, lng2) {
    var distance = Math.round(Math.sqrt(Number(Number(Math.pow(lat1 - lat2, 2)).toFixed(8)) + Number(Number(Math.pow(lng1 - lng2, 2)).toFixed(8))) * 100000);
    if (distance > 1000)
        distance = Math.ceil((distance / 1000) * 10) / 10 + "k";
    return (distance + "m");
}

getCity = async function (lat, lng, moe) {
    var city = {};
    try {
        city = await models.City.findOne({
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