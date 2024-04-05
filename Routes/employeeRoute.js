const express = require('express');
const employeeController = require('../Controller/Personnel/employeeCtrler');
const { isAdmin, isActive } = require('../Middleware/auth');
const router = express.Router();

router.get('/getEmployeeList', employeeController.getNonAdminEmployees);
router.get('/getEmployeeById/:empId', employeeController.getNonAdminEmployeesById);
router.put('/activateEmployee', isAdmin(6), employeeController.activateEmployee)
router.put('/:id',
    isActive,
    employeeController.updateEmployee);
router.delete('/:id',
    isActive,
    employeeController.deleteEmployee);
router.get('/getEmployeeByEmpCode/:emp_code', employeeController.getEmployeeByEmpCode);

module.exports = router;