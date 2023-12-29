const express = require('express');
const employeeController = require('../Controller/Personnel/employeeCtrler');
const { authenticateToken } = require('../Middleware/auth');
const router = express.Router();

router.get('/getEmployeeList', employeeController.getNonAdminEmployees);
router.get('/getEmployeeById/:empID', employeeController.getNonAdminEmployeesById);
router.put('/activateEmployee',employeeController.activateEmployee)
router.put('/:id',
    // authenticateToken,
    employeeController.updateEmployee);
router.delete('/:id',
    // authenticateToken,
    employeeController.deleteEmployee);

module.exports = router;