const router = require('express').Router();
const employeeRoute = require('../Routes/employeeRoute');

router.use('/employee',employeeRoute);

module.exports = router