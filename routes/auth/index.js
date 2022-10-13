const { Router } = require('express');
const userController = require('./auth.controller');
const authMiddleware = require('../../middleware/auth');
const router = Router();
const { body } = require('express-validator');

router.post(
    '/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 2, max: 32 }),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.post('/sendMessageRestore', userController.sendMessageRestore);
router.post('/restore', userController.restorePassword);
router.get('/user', authMiddleware, userController.getUserData);

module.exports = router;
