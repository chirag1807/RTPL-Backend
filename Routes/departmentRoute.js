const express = require('express');
const departmentController = require('../Controller/Department/department');
const {authenticateToken} = require('../Middleware/auth');
const router = express.Router();

router.post('/add_department', departmentController.addDepartment);
router.get('/get_department_list', departmentController.getDepartments);
router.get('/:departmentID', departmentController.getDepartmentByID);
router.put('/:departmentID', departmentController.updateDepartment);
router.delete('/:departmentID', departmentController.deleteDepartment);

module.exports = router;