const { Router } = require('express');
const cardController = require('./card.controller');
const authMiddleware = require('../../middleware/auth');
const { body } = require('express-validator');

const router = Router();

router.get('/', authMiddleware, cardController.getAll);

router.post('/add', body('id').isString(), authMiddleware, cardController.add);

router.delete(
    '/delete',
    body('id').isString(),
    authMiddleware,
    cardController.delete
);

module.exports = router;
