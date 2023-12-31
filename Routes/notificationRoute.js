const express = require('express');
const notificationController = require('../Controller/Notification/notification');
const { authenticateToken } = require('../Middleware/auth');
const router = express.Router();

router.get('/get_notification', authenticateToken, notificationController.getNotification);

module.exports = router;