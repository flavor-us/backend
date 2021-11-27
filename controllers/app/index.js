const { Router } = require("express");
const router = Router();
const ctrl = require("./app.ctrl");
const upload = require("../../middleware/multer");

router.post("/name", upload.single("photo"), ctrl.getNames);

router.delete("/contents/:content_id", ctrl.deleteContents);
router.get("/contents/:user_uuid", ctrl.getMyContents); //added
router.post("/contents", ctrl.uploadContents);

router.delete("/user/:user_id", ctrl.deleteUser);
router.post("/user", ctrl.addUser);

router.post("/s3/:user_id", upload.single("photo"), ctrl.s3Upload);
router.get("/rekog", ctrl.getRekog);

router.delete("/relation/following/:user_uuid/:delete_id", ctrl.deleteFollowing)
router.get("/relation/follower/:user_uuid", ctrl.getFollower);
router.get("/relation/following/:user_uuid", ctrl.getFollowing)
router.post("/relation", ctrl.makeRelation);

router.get("/feeds/:user_uuid", ctrl.getFeedsContents); //added
router.post("/kakao", ctrl.login);

module.exports = router;
