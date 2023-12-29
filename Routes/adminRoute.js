const express = require('express');
const adminController = require('../Controller/Personnel/adminCtrl');
const { authenticateToken } = require('../Middleware/auth');
const router = express.Router();

router.post('/addAdmin',
    // authenticateToken,
    adminController.addAdmin);
router.get('/getAdminList', adminController.getAdmins);
router.put('/:id',
    // authenticateToken,
    adminController.updateAdmin);
router.delete('/:id',
    // authenticateToken,
    adminController.deleteAdmin);

module.exports = router;