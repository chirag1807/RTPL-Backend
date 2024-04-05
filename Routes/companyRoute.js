const express = require('express');
const companyController = require('../Controller/Company/Company');
const { isAdmin } = require('../Middleware/auth');
const router = express.Router();

router.post('/addCompany', isAdmin(1), companyController.addCompany);
router.get('/getCompanyList', companyController.getCompanies);
router.put('/:companyID', isAdmin(1), companyController.updatedCompany);
router.get('/:companyID', companyController.getCompanyByID);
router.delete('/:companyID', isAdmin(1), companyController.deleteCompany);

module.exports = router;