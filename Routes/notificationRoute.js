const express = require('express');
const notificationController = require('../Controller/Notification/notification');
const { authenticateToken } = require('../Middleware/auth');
const router = express.Router();

router.post('/get_notifications', authenticateToken, notificationController.getNotification);

module.exports = router;