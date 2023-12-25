const express = require('express');
const designationController = require('../Controller/Designation/designation');
const {authenticateToken} = require('../Middleware/auth');
const router = express.Router();

router.post('/add_designation', designationController.addDesignation);
router.get('/get_designation_list', designationController.getDesignations);
router.get('/:designationID', designationController.getDesignationByID);
router.put('/:designationID', designationController.updateDesignation);
router.delete('/:designationID', designationController.deleteDesignation);

module.exports = router;