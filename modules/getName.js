var ExifImage = require("exif").ExifImage;
const Sequelize = require("sequelize");
const models = require("../models");
const Op = Sequelize.Op;
const errorMsg = require("../message/error");
const logger = require("../../../config/logger");

exports.getExif = function (file) {
	return new Promise(function (resolve, reject) {
		try {
			new ExifImage({ image: file }, function (error, exifData) {
				if (error) reject(logger.error("Error: " + error.message));
				else resolve([exifData.gps.GPSLatitude, exifData.gps.GPSLongitude]);
			});
		} catch (error) {
			reject(logger.error("Error: " + error.message));
		}
	});
};

exports.getNearRestaurants = async function (lat, lng, moe) {
	var restaurants;
	try {
		restaurants = await models.Restaurants.findAll({
			attributes: ["name", "lat", "lng", "id"],
			where: {
				lat: { [Op.between]: [lat - moe, lat + moe] },
				lng: { [Op.between]: [lng - moe, lng + moe] },
			},
		});
	} catch (error) {
		logger.error(error);
	}
	return restaurants;
};

exports.convertLatLng = function (lat_DMS, lng_DMS) {
	if (lat_DMS && lng_DMS) {
		const lat_Degree = lat_DMS[0] + lat_DMS[1] / 60 + lat_DMS[2] / 3600;
		const lng_Degree = lng_DMS[0] + lng_DMS[1] / 60 + lng_DMS[2] / 3600;
		return [lat_Degree, lng_Degree];
	} else {
		logger.error("error : something wrong in lat_DMS , lng_DMS")
		throw (errorMsg.noLatLng);
	}
};
