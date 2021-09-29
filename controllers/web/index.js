const { Router } = require('express');
const router = Router();
const ctrl = require('./web.ctrl');
const upload = require('../../middleware/multer');

router.post('/name', upload.single('photo'), ctrl.getNames);
router.post('/upload', ctrl.dbUpload)

module.exports = router;