const express = require('express');
const router = express.Router();

const projectController = require('../app/controllers/projectController');
const authMiddleware = require('../app/middlewares/auth');

router.use(authMiddleware);

router.get('/', projectController.get);
router.get('/:projectId', projectController.getById);
router.post('/', projectController.post); 
router.put('/:projectId', projectController.put);
router.delete('/:projectId', projectController.delete);

module.exports = router;
