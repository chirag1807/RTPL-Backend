const express = require('express');
const employeeRoleController = require('../Controller/Personnel/employeeRoleCtrl');
const { isAdmin } = require('../Middleware/auth');
const router = express.Router();

router.post('/addRole', isAdmin(5), employeeRoleController.addEmployeeRole);
router.get('/getRoleList', employeeRoleController.getEmployeeRoles);
router.get('/:roleID', employeeRoleController.getEmployeeRoleByID);
router.put('/:roleID', isAdmin(5), employeeRoleController.updateEmployeeRole);
router.delete('/:roleID', isAdmin(5), employeeRoleController.deleteEmployeeRole);

module.exports = router;