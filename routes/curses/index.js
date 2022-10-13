const { Router } = require('express');
const coursesController = require('./courses.controller');
const authMiddleware = require('../../middleware/auth');
const { body } = require('express-validator');

const router = Router();

router.get('/all', coursesController.getAll);
router.get('/:id', coursesController.getOne);
router.post(
    '/add',
    body('title').isString(),
    body('price').isNumeric(),
    body('img').isString(),
    authMiddleware,
    coursesController.add
);
router.delete(
    '/delete',
    body('id').isString(),
    authMiddleware,
    coursesController.delete
);
router.post(
    '/edit',
    body('title').isString(),
    body('price').isNumeric(),
    body('img').isString(),
    body('id').isString(),
    authMiddleware,
    coursesController.edit
);

module.exports = router;
