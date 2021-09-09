const { Router } = require('express');
const router = Router();
const ctrl = require('./admin.ctrl');
const upload = require('../../middleware/multer');

// router.post('/name', upload.single('photo'), ctrl.get_name);
router.post('/name', ctrl.get_name);
module.exports = router;