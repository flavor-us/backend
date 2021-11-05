const nameModule = require("../../modules/getName");
const awsUtils = require("../../modules/awsUtils");
const dbUpload = require("../../modules/dbUpload");
const models = require("../../models");
const errorMsg = require("../../message/error");
const completeMsg = require("../../message/complete");

require("dotenv").config();

//행위는 get 메소드는 post (req.file 받기 위해)
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

// exports.getRekog = async (req, res) => {
// 	const userId = 1;
// 	if (req.file) {
// 		var uploadedFileInfo = await awsUtils.uploadS3Bucket(req.file.path, req.file.mimetype);
// 		var rekogData = await awsUtils.getLabel(uploadedFileInfo.key);
// 		res.status(200).send({ rekogData: JSON.stringify(rekogData), filename: uploadedFileInfo.key, userId: userId });
// 	} else {
// 		res.status(400).send({
// 			name: ["Not Found"],
// 			msg: "파일을 찾을 수 없습니다.",
// 		});
// 	}
// };

exports.s3Upload = async (req, res) => {
	const userId = req.param.user_id;
	if (req.file && userId) {
		var uploadedFileInfo = await awsUtils.uploadS3Bucket(req.file.path, req.file.mimetype, userId).catch(e => {
			res.status(400).send({
				name: ["Not Found"],
				msg: "s3 버킷에 업로드 할 수 없습니다.",
			});
		});
		res.status(201).send({ filename: uploadedFileInfo.key });
	} else {
		res.status(400).send({
			name: ["Not Found"],
			msg: "s3 버킷에 업로드 할 수 없습니다.",
		});
	}
}

exports.getRekog = async (req, res) => {
	const key = req.query.s3ImageKey;
	const rekogData = await awsUtils.getLabel(key).catch((e) => {
		console.log(e)
		res.status(400).send({
			name: ["Not Found"],
			msg: "s3버킷에서 이미지 정보를 추출할 수 없습니다"
		});
	});
	if (rekogData)
		res.status(200).send({ rekogData: JSON.stringify(rekogData) })
	else
		res.status(400).send({
			msg: "s3버킷에서 이미지 정보를 추출할 수 없습니다"
		});
}

exports.uploadContents = async (req, res) => {
	const content = {
		user_id: req.body.user,
		date: new Date(),
		filename: `${req.body.filename}`,
		rekognition: req.body.rekog,
		restname: req.body.restname
	};
	const tagId = req.body.tagId;
	await dbUpload.uploadContent(content, tagId).then((contentId) => {
		res.status(201).send({ msg: "Content를 성공적으로 업로드했습니다.", contentId: contentId });
	}).catch((e) => {
		console.log(e);
		res.status(400).send({ msg: "Content를 업로드 하지 못했습니다." })
	});
}

exports.deleteContents = async (req, res) => {
	var content;
	try {
		content = await models.Contents.destroy({
			where: {
				id: req.params.content_id
			}
		});
	} catch (e) {
		console.log(e);
		res.status(400).send({ msg: "Content를 지우지 못했습니다." })
	}
	if (content)
		res.send({ msg: "Content를 성공적으로 지웠습니다.", contentId: req.params.content_id }).status(204);
	else
		res.status(400).send("해당하는 content_id가 없습니다.")
}

exports.addUser = async (req, res) => {
	if (!req.body.email || !req.body.username)
		return res.status(400).send(errorMsg.notEnoughReq);
	const user = {
		signupdate: new Date(),
		email: req.body.email,
		username: req.body.username
	}
	await dbUpload.uploadUser(user).then((uid) => {
		res.status(201).send({ msg: "User를 성공적으로 업로드했습니다.", userId: uid })
	}).catch((e) => {
		console.log(e);
		res.status(400).send({ msg: "User를 업로드 하지 못했습니다." })
	});
}

exports.deleteUser = async (req, res) => {
	var user;
	try {
		user = await models.User.destroy({
			where: {
				uid: req.params.user_id
			}
		});
	} catch (e) {
		console.log(e);
		res.status(400).send({ msg: "user를 지우지 못했습니다." })
	}
	if (user)
		res.send({ msg: "user를 성공적으로 지웠습니다.", userId: req.params.user_id }).status(204);
	else
		res.status(400).send("해당하는 uid가 없습니다.")

}
exports.makeRelation = async (req, res) => {
	const followerId = req.body.followerId;
	const followingId = req.body.followingId;
	if (!followerId || !followingId)
		return res.status(400).send(errorMsg.notEnoughReq);
	const follower = await models.User.findOne({
		where: {
			uid: followerId
		}
	})
	const following = await models.User.findOne({
		where: {
			uid: followingId
		}
	})
	await follower.addFollowing(following);
	res.status(201).send(completeMsg.complete);
}
