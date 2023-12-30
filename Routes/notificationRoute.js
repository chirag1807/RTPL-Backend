const express = require('express');
const notificationController = require('../Controller/Notification/notification');
const { authenticateToken } = require('../Middleware/auth');
const router = express.Router();

router.post('/create_request_meeting', authenticateToken, notificationController.getNotification);

module.exports = router;