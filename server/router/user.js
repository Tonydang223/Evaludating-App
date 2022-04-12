const express = require('express')
const userController = require('../controllers/userController');
const { authVerify, isRole } = require('../middlewares/authMiddleWare');

const router = express.Router();

router.get('/getAll',authVerify,isRole.admin,userController.getAllUser);
router.get('/download',userController.downloadfileCSV);

module.exports = router