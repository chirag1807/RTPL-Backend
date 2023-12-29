const express = require('express');
const officeController = require('../Controller/Company/Office');
const { isAdmin } = require('../Middleware/auth');
const router = express.Router();

router.post('/addOffice', isAdmin, officeController.addOffice);
router.get('/getOfficelistByCompany/:companyID', officeController.getOfficesByCompany);
router.get('/getOfficelistByOffice/:officeID', officeController.getOfficeByID);
router.get('/getOfficelist', officeController.getOffices);
router.put('/:officeID', isAdmin, officeController.updateOffice);
router.delete('/:officeID', isAdmin, officeController.deleteOffice);

module.exports = router;