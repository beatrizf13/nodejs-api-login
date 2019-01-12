const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/userController');
const authMiddleware = require('../app/middlewares/auth');

router.get('/', userController.get);
router.post('/', userController.post);
router.post('/authenticate', userController.authenticate);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

module.exports = router;
