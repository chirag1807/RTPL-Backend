const express = require('express');
const adminController = require('../Controller/Personnel/adminCtrl');
const { isAdmin } = require('../Middleware/auth');
const router = express.Router();

router.post('/addAdmin',
    isAdmin,
    adminController.addAdmin);
router.post('/addReceptionist',
    isAdmin,
    adminController.addReceptionist);
router.get('/getAdminList', isAdmin, adminController.getAdmins);
router.get('/getDataList', isAdmin, adminController.getAllData);
router.put('/:id',
    isAdmin,
    adminController.updateAdmin);
router.delete('/:id',
    isAdmin,
    adminController.deleteAdmin);

module.exports = router;