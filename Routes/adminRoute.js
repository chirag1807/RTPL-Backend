const express = require('express');
const adminController = require('../Controller/Personnel/adminCtrl');
const { isSuper } = require('../Middleware/auth');
const { upload } = require('../utils/multer');
const router = express.Router();

router.post('/addAdmin',
    upload.fields([
        { name: 'empAadharCard', maxCount: 1 },
        { name: 'empIdCard', maxCount: 1 },
        { name: 'empProfileImg', maxCount: 1 },
    ]),
    isSuper,
    adminController.addAdmin);
router.post('/addReceptionist',
    upload.fields([
        { name: 'empAadharCard', maxCount: 1 },
        { name: 'empIdCard', maxCount: 1 },
        { name: 'empProfileImg', maxCount: 1 },
    ]),
    isSuper,
    adminController.addReceptionist);
router.get('/getAdminList', isSuper, adminController.getAdmins);
router.get('/getDataList', isSuper, adminController.getAllData);
router.put('/:id',
    isSuper,
    adminController.updateAdmin);
router.delete('/:id',
    isSuper,
    adminController.deleteAdmin);

module.exports = router;