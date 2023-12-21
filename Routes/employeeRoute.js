const express = require('express');
const employeeController = require('../Controller/Personnel/employeeCtrl');
const {authenticateToken} = require('../Middleware/auth');
const router = express.Router();

router.post('/createEmployee',authenticateToken,employeeController.employeeRegistration);
router.post('/loginEmployee',employeeController.loginEmployee);
router.post('/changePassword',authenticateToken,employeeController.changePassword);
router.put('/:id', authenticateToken,employeeController.updateEmployee);
router.delete('/:id',authenticateToken, employeeController.deleteEmployee);

module.exports = router;