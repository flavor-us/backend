const nameModule = require("../../modules/getName");
const awsUtils = require("../../modules/awsUtils");
const dbUploads = require("../../modules/dbUpload");
const logger = require("../../config/logger");

exports.getNames = async (req, res) => {
	let moe = 0.0001; // 10m 반경
	var names;
	const userId = 1;
	var gpsDMS;
	if (req.file) {
		gpsDMS = await nameModule.getExif(req.file.path).catch(function (e) {
			logger.error("[getNames] : ", e);
			res.send({
				name: ["Not Found"],
				msg: "EXIF 정보를 추출할 수 없습니다."
			})
		});
	} else {
		res.send({
			name: ["Not Found"],
			msg: "파일을 찾을 수 없습니다.",
		});
	}
	if (gpsDMS) {
		const gpsDegree = nameModule.convertLatLng(gpsDMS[0], gpsDMS[1]);
		if (gpsDegree) {
			do {
				names = await nameModule.getNearRestaurants(gpsDegree[0], gpsDegree[1], moe);
				moe *= 2;
				if (moe > 0.005)
					// 500m
					break;
			} while (Object.keys(names).length < 3);
			restData = names.map((item) => {
				return item.dataValues;
			});
			var uploadedFileInfo = await awsUtils.uploadS3Bucket(req.file.path, req.file.mimetype, userId);
			var rekogData = await awsUtils.getLabel(uploadedFileInfo.key);
			res.render("web/select.html", { restData: restData, rekogData: JSON.stringify(rekogData), filename: uploadedFileInfo.key, userId: userId });
		} else {
			res.send({
				name: ["Not Found"],
				msg: "EXIF 데이터가 있으나, 위도 경도 정보는 찾을 수 없었습니다.",
			});
		}
	} else
		res.send({
			msg: "Cannot get ExifData",
		});
};

exports.dbUpload = async (req, res) => {
	var contents = {
		user_id: req.body.user,
		date: new Date(),
		filename: `${req.body.filename}`,
		rekognition: req.body.rekog,
		restname: req.body.restname
	};
	dbUploads.uploadContent(contents).catch((e) => logger.error("[dbUpload] : ", e));
	res.render("web/map.html", { name: req.body.restname, lat: req.body.lat, lng: req.body.lng, KakaoApikey: process.env.KAKAO_JAVASCRIPT_KEY });
};