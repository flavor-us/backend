const { Router } = require("express");
const router = Router();
const app = require("./app.ctrl");
const jwtAuth = require("../../middleware/jwtAuth");
const multerTransform = require('../../middleware/multerTransform');

router.get("/near", app.restaurantsCtrl.getRestaurantList);
router.delete("/contents/:content_id", app.contentsCtrl.deleteContents);
router.patch("/contents/:content_id", app.contentsCtrl.updateContents);
router.get("/contents/:kakao_id", jwtAuth.checkToken, app.contentsCtrl.getMyContents);
router.post("/contents", app.contentsCtrl.uploadContents);
router.get("/contents/relevant/:kakao_id", app.contentsCtrl.getRelevantContents);

router.delete("/user/:kakao_id", app.userCtrl.deleteUser);
router.post("/user", app.userCtrl.addUser);
router.patch("/user/:kakao_id", app.userCtrl.editProfile);
router.get("/user/:kakao_id", app.userCtrl.getProfile);

router.post("/s3/:kakao_id", multerTransform.uploadImageMulterMiddleware, app.s3Ctrl.s3MulterUpload);

router.delete("/s3/:kakao_id/:filename", app.s3Ctrl.s3Delete)
router.get("/rekog", app.s3Ctrl.getRekog);

router.delete("/relation/follower/:kakao_id/:delete_id", app.relationCtrl.deleteFollower)
router.get("/relation/following/:kakao_id", app.relationCtrl.getFollowing);
router.get("/relation/follower/:kakao_id", app.relationCtrl.getFollower);
router.post("/relation", app.relationCtrl.makeRelation);

router.get("/auth/login/:kakaotoken", app.authCtrl.getAllToken);
router.get("/auth/refresh/:kakao_id/:refreshtoken", app.authCtrl.getAccessToken);
router.get("/jwt", jwtAuth.checkToken, (req, res) => {
	console.log(JSON.stringify(req.body));
	console.log(req.kakao_id);
	res.send("complete");
})

router.post("/appointments", app.appointmentsCtrl.requestAppointment);
router.get("/appointments/:kakao_id", app.appointmentsCtrl.checkRequested);
router.delete("/appointments/:kakao_id", app.appointmentsCtrl.removeAllAppointments);
router.delete("/appointment/:appointment_id", app.appointmentsCtrl.removeAppointment);

router.get("/uuid/:user_id", app.uuidCtrl.getUuidById);
router.get("/userid/:kakao_id", app.useridCtrl.getUserIdByKakaoId);

router.get("/tag/adj1", app.tagCtrl.getadj1);
router.get("/tag/adj2", app.tagCtrl.getadj2);
router.get("/tag/locationtag", app.tagCtrl.getlocationtag);

router.get("/kakao/friend/:kakao_id", app.kakaoCtrl.getFriendList);
router.patch("/kakao/token/:kakao_id", app.kakaoCtrl.updateToken);
router.get("/kakao/profile/:kakao_id", app.kakaoCtrl.getProfile);

router.post("/comments/:content_id", app.commentCtrl.uploadComments);
router.delete("/comments/:comment_id", app.commentCtrl.deleteComments);

module.exports = router;