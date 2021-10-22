const nameModule = require("../../modules/getName");
const awsUtils = require("../../modules/awsUtils");
const dbUploads = require("../../modules/dbUploads");
require("dotenv").config();

exports.getNames = async (req, res) => {
	let moe = 0.00001; //1m 반경
	var names;
	const gpsDMS;
	if (req.file) {
		const gpsDMS = await nameModule.getExif(req.file.path).catch(function (error) {
			console.log(error);
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
				names = await nameModule.getNameSequelize(gpsDegree[0], gpsDegree[1], moe);
				moe *= 2;
				if (moe > 0.01)
					// 1km
					break;
			} while (Object.keys(names).length < 3);
			nameArray = names.map((item) => {
				return item.dataValues;
			});
			res.send({ name: nameArray });
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

exports.getRekog = async (req, res) => {
	const userId = 1;
	if (req.file) {
		var uploadedFileInfo = await awsUtils.uploadS3Bucket(req.file.path, req.file.mimetype);
		var rekogData = await awsUtils.getLabel(uploadedFileInfo.key);
		console.log(rekogData);
		console.log(uploadedFileInfo);
		res.send({ rekogData: JSON.stringify(rekogData), filename: uploadedFileInfo.key, userId: userId });
	} else {
		res.send({
			name: ["Not Found"],
			msg: "파일을 찾을 수 없습니다.",
		});
	}
};
