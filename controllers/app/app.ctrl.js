const nameModule = require("../../modules/getName");
const awsUtils = require("../../modules/awsUtils");
const dbUploads = require("../../modules/dbUploads");
require("dotenv").config();

exports.getNames = async (req, res) => {
	let moe = 0.0001; //10m 반경
	var names;
	var gpsDMS;
	if (req.file) {
		var gpsDMS = await nameModule.getExif(req.file.path).catch(function (error) {
			console.log(error);
		});
	} else {
		res.status(400).send({
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
				if (moe > 0.005)
					// 500m
					break;
			} while (Object.keys(names).length < 3);
			restData = names.map((item) => {
				return item.dataValues;
			});
			res.status(200).json({ restData: restData });
		} else {
			res.status(400).send({
				name: ["Not Found"],
				msg: "EXIF 데이터가 있으나, 위도 경도 정보는 찾을 수 없었습니다.",
			});
		}
	} else
		res.status(400).send({
			msg: "Cannot get ExifData",
		});
};

exports.getRekog = async (req, res) => {
	const userId = 1;
	if (req.file) {
		var uploadedFileInfo = await awsUtils.uploadS3Bucket(req.file.path, req.file.mimetype);
		var rekogData = await awsUtils.getLabel(uploadedFileInfo.key);
		res.status(200).send({ rekogData: JSON.stringify(rekogData), filename: uploadedFileInfo.key, userId: userId });
	} else {
		res.status(400).send({
			name: ["Not Found"],
			msg: "파일을 찾을 수 없습니다.",
		});
	}
};

exports.dbupload = async (req, res) => {
	var contents = {
		user_id: req.body.user,
		date: new Date(),
		filename: `${req.body.filename}`,
		rekognition: req.body.rekog,
		restname: req.body.restname
	};
	dbUploads.uploadContent(contents).catch((e) => {
		console.log(e);
		res.status(400).send({ msg: "Contents를 업로드 하지 못했습니다." })
	});
	res.status(201).send({ msg: "Content를 성공적으로 업로드했습니다." });
}