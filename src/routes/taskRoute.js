const express = require('express');
const router = express.Router();

const taskController = require('../app/controllers/taskController');
const authMiddleware = require('../app/middlewares/auth');

router.use(authMiddleware);

router.get('/', taskController.get);
router.get('/done', taskController.getDones);
router.get('/not-done', taskController.getNotDones);
router.get('/:projectId', taskController.getById);
router.post('/', taskController.post);
router.put('/done/:taskId', taskController.markDone);
router.put('/not-done/:taskId', taskController.markNotDone);
router.put('/:taskId', taskController.put);
router.delete('/:taskId', taskController.delete);

module.exports = router;