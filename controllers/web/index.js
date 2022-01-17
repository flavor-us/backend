const { Router } = require("express");
const router = Router();
const ctrl = require("./web.ctrl");
const upload = require("../../middleware/multer");

router.post("/name", upload.single("photo"), ctrl.getNames);
router.post("/upload", ctrl.dbUpload);
router.get("/privacypolicy", async (req, res) => { return (res.render("web/policy.html")); })
module.exports = router;
