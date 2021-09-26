const { Router } = require('express');
const router = Router();
const ctrl = require('./app.ctrl');
const upload = require('../../middleware/multer');

router.post('/name', upload.single('photo'), ctrl.getNames);

module.exports = router;