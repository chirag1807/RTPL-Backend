const express = require('express');
const designationController = require('../Controller/Designation/designation');
const { isAdmin } = require('../Middleware/auth');
const router = express.Router();

router.post('/add_designation', isAdmin ,designationController.addDesignation);
router.get('/get_designation_list', designationController.getDesignations);
router.get('/:designationID', designationController.getDesignationByID);
router.put('/:designationID',isAdmin, designationController.updateDesignation);
router.delete('/:designationID',isAdmin, designationController.deleteDesignation);

module.exports = router;