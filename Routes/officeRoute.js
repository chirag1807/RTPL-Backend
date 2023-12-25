const express = require('express');
const officeController = require('../Controller/Company/Office');
const {authenticateToken} = require('../Middleware/auth');
const router = express.Router();

router.post('/addOffice', officeController.addOffice );
router.get('/getOfficelistByCompany/:companyID', officeController.getOfficesByCompany);
router.put('/:officeID', officeController.updateOffice);
router.delete('/:officeID', officeController.deleteOffice);

module.exports = router;