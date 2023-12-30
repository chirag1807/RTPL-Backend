const express = require('express');
const employeeRoleController = require('../Controller/Personnel/employeeRoleCtrl');
const { isAdmin } = require('../Middleware/auth');
const router = express.Router();

router.post('/addRole', isAdmin, employeeRoleController.addEmployeeRole);
router.get('/getRoleList', employeeRoleController.getEmployeeRoles);
router.get('/:roleID', employeeRoleController.getEmployeeRoleByID);
router.put('/:roleID', isAdmin, employeeRoleController.updateEmployeeRole);
router.delete('/:roleID', isAdmin, employeeRoleController.deleteEmployeeRole);

module.exports = router;