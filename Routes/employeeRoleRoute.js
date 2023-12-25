const express = require('express');
const employeeRoleController = require('../Controller/Personnel/employeeRoleCtrl');
const {authenticateToken} = require('../Middleware/auth');
const router = express.Router();

router.post('/addRole', employeeRoleController.addEmployeeRole);
router.get('/getRoleList', employeeRoleController.getEmployeeRoles);
router.get('/:roleID', employeeRoleController.getEmployeeRoleByID);
router.put('/:roleID', employeeRoleController.updateEmployeeRole);
router.delete('/:roleID', employeeRoleController.deleteEmployeeRole);

module.exports = router;