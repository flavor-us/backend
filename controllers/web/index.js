const { Router } = require("express");
const router = Router();

router.get("/privacypolicy", async (req, res) => { return (res.render("web/policy.html")); })

module.exports = router;
