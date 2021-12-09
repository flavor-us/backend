const { Router } = require("express");
const router = Router();
const app = require("./app.ctrl");
const upload = require("../../middleware/multer");

router.post("/name", upload.single("photo"), app.restaurantsCtrl.getNames);

router.delete("/contents/:content_id", app.contentsCtrl.deleteContents);
router.put("/contents/:content_id", app.contentsCtrl.updateContents);
router.get("/contents/:user_uuid", app.contentsCtrl.getMyContents);
router.post("/contents", app.contentsCtrl.uploadContents);
router.get("/contents/relevant/:user_uuid", app.contentsCtrl.getRelevantContents);

router.delete("/user/:user_id", app.userCtrl.deleteUser);
router.post("/user", app.userCtrl.addUser);
router.patch("/user", app.userCtrl.editProfile);

router.post("/s3/:user_id", upload.single("photo"), app.rekognitionCtrl.s3Upload);
router.delete("/s3/:user_uuid/:filename", app.rekognitionCtrl.s3Delete)
router.get("/rekog", app.rekognitionCtrl.getRekog);

router.delete("/relation/follower/:user_uuid/:delete_id", app.relationCtrl.deleteFollower)
router.get("/relation/follower/:user_uuid", app.relationCtrl.getFollower);
router.get("/relation/follower/:user_uuid", app.relationCtrl.getFollower)
router.post("/relation", app.relationCtrl.makeRelation);

router.post("/kakao", app.authCtrl.login);

router.post("/appointment", app.appointmentCtrl.requestAppointment);
router.get("/appointment", app.appointmentCtrl.checkRequested);
router.delete("/appointment", app.appointmentCtrl.removeAppointment);

router.get("/uuid", app.uuidCtrl.getUuidById);

router.get("/tag/adj1", app.tagCtrl.getadj1);
router.get("/tag/adj2", app.tagCtrl.getadj2);
router.get("/tag/locationtag", app.tagCtrl.getlocationtag);

// router.get("/kakao", app.kakaoCtrl.testApi);
router.patch("/kakao/token/:user_uuid", app.kakaoCtrl.updateToken);

module.exports = router;