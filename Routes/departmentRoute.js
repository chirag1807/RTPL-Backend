const express = require('express');
const departmentController = require('../Controller/Department/department');
const { isAdmin } = require('../Middleware/auth');
const router = express.Router();

router.post('/add_department',isAdmin(3), departmentController.addDepartment);
router.get('/get_department_list', departmentController.getDepartments);
router.get('/:departmentID', departmentController.getDepartmentByID);
router.put('/:departmentID',isAdmin(3), departmentController.updateDepartment);
router.delete('/:departmentID',isAdmin(3), departmentController.deleteDepartment);

module.exports = router;