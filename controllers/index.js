const { Router } = require('express');
const router = Router();

router.use('/web', require('./web'));
router.use('/app', require('./app'));
router.use('/admin', require('./admin'));
router.use('/', require('./home'));

module.exports = router;