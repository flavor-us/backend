const { Router } = require('express');
const router = Router();
const ctrl = require('./admin.ctrl');

router.get('/contents', ctrl.getContents );

module.exports = router;