const express = require('express');
const employeeController = require('../Controller/Personnel/employeeCtrler');
const { isAdmin } = require('../Middleware/auth');
const router = express.Router();

router.get('/getEmployeeList', employeeController.getNonAdminEmployees);
router.get('/getEmployeeById/:empID', employeeController.getNonAdminEmployeesById);
router.put('/activateEmployee', isAdmin, employeeController.activateEmployee)
router.put('/:id',
    isAdmin,
    employeeController.updateEmployee);
router.delete('/:id',
    isAdmin,
    employeeController.deleteEmployee);

module.exports = router;