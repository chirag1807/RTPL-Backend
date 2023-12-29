const express = require('express');
const companyController = require('../Controller/Company/Company');
const { isAdmin } = require('../Middleware/auth');
const router = express.Router();

router.post('/addCompany', isAdmin, companyController.addCompany);
router.get('/getCompanyList', companyController.getCompanies);
router.put('/:companyID', isAdmin, companyController.updatedCompany);
router.get('/:companyID', companyController.getCompanyByID);
router.delete('/:companyID', isAdmin, companyController.deleteCompany);

module.exports = router;