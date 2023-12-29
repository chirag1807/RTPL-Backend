const express = require('express');
const departmentController = require('../Controller/Department/department');
const { isAdmin } = require('../Middleware/auth');
const router = express.Router();

router.post('/add_department',isAdmin, departmentController.addDepartment);
router.get('/get_department_list', departmentController.getDepartments);
router.get('/:departmentID', departmentController.getDepartmentByID);
router.put('/:departmentID',isAdmin, departmentController.updateDepartment);
router.delete('/:departmentID',isAdmin, departmentController.deleteDepartment);

module.exports = router;