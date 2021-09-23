const { Router } = require('express');
const router = Router();

router.use('/web', require('./web'));
router.use('/app', require('./app'))
router.use('/', require('./home'));

module.exports = router;