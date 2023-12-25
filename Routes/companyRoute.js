const express = require('express');
const companyController = require('../Controller/Company/Company');
const {authenticateToken} = require('../Middleware/auth');
const router = express.Router();

router.post('/addCompany', companyController.addCompany);
router.get('/getCompanyList', companyController.getCompanies);
router.put('/:companyID', companyController.updatedCompany);
router.get('/:companyID', companyController.getCompanyByID);
router.delete('/:companyID', companyController.deleteCompany);

module.exports = router;