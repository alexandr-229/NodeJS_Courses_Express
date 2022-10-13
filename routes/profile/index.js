const { Router } = require('express');
const authMiddleware = require('../../middleware/auth');
const profileController = require('./profile.controller');

const router = Router();

router.get('/', authMiddleware, profileController.getProfile);

router.post('/', authMiddleware, profileController.editProfile);

module.exports = router;
