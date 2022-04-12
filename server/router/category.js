const express = require('express')
const categoryController = require('../controllers/categoryController');
const { authVerify, isRole } = require('../middlewares/authMiddleWare');

const router = express.Router()


router.post('/post',authVerify,categoryController.createCategory);
router.get('/getAll',authVerify,categoryController.getAllCategory);
router.delete('/delete/:id',authVerify,isRole.manager,categoryController.deleteOneCategory);
router.put('/update/:id',authVerify,categoryController.updateCategory);



module.exports = router