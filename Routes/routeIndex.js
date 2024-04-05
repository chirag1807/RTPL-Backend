const router = require('express').Router();
const authRoute = require('../Routes/authRoute');
const employeeRoute = require('../Routes/employeeRoute');
const visitorRoute = require("../Routes/visitorRoute");
const meetingTypeRouter = require('../Routes/meetingType');
const meetingModeRouter = require('../Routes/meetingMode');
const comapanyRouter = require('../Routes/companyRoute');
const officeRouter = require('../Routes/officeRoute')
const departmentRouter = require('../Routes/departmentRoute');
const designationRouter = require('../Routes/designationRoute');
const employeeRoleRouter = require('../Routes/employeeRoleRoute');
const meetingRouter = require('../Routes/meetingRoute');
const internalTeamRouter = require('../Routes/internalTeamRoute')
const adminRouter = require('../Routes/adminRoute');
const conferenceRoomRouter = require('../Routes/conferenceRoomRoute');
const notificationRouter = require('../Routes/notificationRoute');

router.use('/admin',adminRouter);
router.use('/auth',authRoute);
router.use('/employee',employeeRoute);
router.use('/visitor', visitorRoute);
router.use('/meetingtype', meetingTypeRouter);
router.use('/meetingmode', meetingModeRouter);
router.use('/company',comapanyRouter);
router.use('/company/office',officeRouter);
router.use('/meeting',meetingRouter);
router.use('/department', departmentRouter);
router.use('/designation', designationRouter);
router.use('/role', employeeRoleRouter);
router.use('/internalTeam',internalTeamRouter);
router.use('/conferenceRoom', conferenceRoomRouter);
router.use('/notification', notificationRouter);

module.exports = router