exports.restaurantsCtrl = require("./restaurants/restaurants.ctrl");
exports.userCtrl = require("./user/user.ctrl");
exports.rekognitionCtrl = require("./rekognition/rekognition.ctrl");
exports.relationCtrl = require("./relation/relation.ctrl");
exports.authCtrl = require("./auth/auth.ctrl");
exports.contentsCtrl = require("./contents/contents.ctrl");
exports.appointmentCtrl = require("./appointment/appointment.ctrl");
exports.uuidCtrl = require("./uuid/uuid.ctrl");
exports.tagCtrl = require("./tag/tag.ctrl");
exports.kakaoCtrl = require("./kakao/kakao.ctrl");
// exports.delete = async (req, res) => {
// 	var attr;
// 	try {
// 		attr = await models.attr.destroy({
// 			where: {
// 				id: req.params.id
// 			}
// 		});
// 	} catch (e) {
// 		console.log(e);
// 		res.status(400).send(errorMsg.deleteFail)
// 	}
// 	if (user)
// 		res.status(204).send();
// 	else
// 		res.status(400).send(errorMsg.deleteFail)
// }

// exports.update = async (req, res) => {
// 	var attr;
// 	try {
// 		attr = await models.attr.findOne({
// 			where: {
// 				id: req.params.id
// 			}
// 		});
// 	} catch (e) {
// 		console.log(e);
// 		res.status(400).send(errorMsg.updateFail)
// 	}
// 	//update
// }

// exports.read = async (req, res) => {
// 	var attr;
// 	try {
// 		attr = await models.attr.findAll({
// 			where: {

// 			}
// 		})
// 	} catch (e) {
// 		console.log(e);
// 		res.status(400).send({ msg: "" })
// 	}
// 	//read
// }
