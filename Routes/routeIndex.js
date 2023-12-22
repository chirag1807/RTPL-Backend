const router = require('express').Router();
const employeeRoute = require('../Routes/employeeRoute');
const visitorRoute = require("../Routes/visitorRoute");
const meetingTypeRouter = require('../Routes/meetingType');
const meetingModeRouter = require('../Routes/meetingMode');

router.use('/employee',employeeRoute);
router.use('/visitor', visitorRoute);
router.use('/meetingtype', meetingTypeRouter);
router.use('/meetingmode', meetingModeRouter);

module.exports = router