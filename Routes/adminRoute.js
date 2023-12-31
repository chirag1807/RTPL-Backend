const express = require('express');
const adminController = require('../Controller/Personnel/adminCtrl');
const { isAdmin } = require('../Middleware/auth');
const { upload } = require('../utils/multer');
const router = express.Router();

router.post('/addAdmin',
    isAdmin,
    upload.fields([
        { name: 'empAadharCard', maxCount: 1 },
        { name: 'empIdCard', maxCount: 1 },
        { name: 'empProfileImg', maxCount: 1 },
    ]),
    adminController.addAdmin);
router.post('/addReceptionist',
    isAdmin,
    upload.fields([
        { name: 'empAadharCard', maxCount: 1 },
        { name: 'empIdCard', maxCount: 1 },
        { name: 'empProfileImg', maxCount: 1 },
    ]),
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