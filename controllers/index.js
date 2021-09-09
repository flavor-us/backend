const { Router } = require('express');
const router = Router();

router.use('/admin', require('./admin'));
router.use('/', require('./home'));

module.exports = router;