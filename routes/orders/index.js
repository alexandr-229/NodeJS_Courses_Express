const { Router } = require('express');
const orderController = require('./order.controller');
const authMiddleware = require('../../middleware/auth');
const router = Router();

router.get('/', authMiddleware, orderController.get);

router.post('/add', authMiddleware, orderController.create);

module.exports = router;
