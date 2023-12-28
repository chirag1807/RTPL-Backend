const express = require('express');
const employeeController = require('../Controller/Personnel/employeeCtrl');
const { authenticateToken } = require('../Middleware/auth');
const router = express.Router();

router.post('/createEmployee',
    // authenticateToken,
    employeeController.employeeRegistration);
router.post('/loginEmployee', employeeController.loginEmployee);
router.get('/getAllEmployees',employeeController.getNonAdminEmployees);
router.post('/changePassword', authenticateToken, employeeController.changePassword);
router.put('/:id',
    // authenticateToken,
    employeeController.updateEmployee);
router.delete('/:id',
    // authenticateToken,
    employeeController.deleteEmployee);

router.post('/forgotPassword', employeeController.forgotPassword);

router.post('/sendCode', employeeController.sendCode);

router.post('/verifyCode', employeeController.verifyCode);

module.exports = router;