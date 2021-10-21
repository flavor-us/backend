const { Router } = require("express");
const router = Router();
const ctrl = require("./app.ctrl");
const upload = require("../../middleware/multer");

router.get("/name", upload.single("photo"), ctrl.getNames);
router.post("/rekog", upload.single("photo"), ctrl.getRekog);

module.exports = router;
