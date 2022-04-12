const express = require('express')


const router = express.Router()
const authContr = require('../controllers/authController');
const { verifyEmailMiddleWare } = require('../middlewares/authMiddleWare');

router.post('/register',authContr.signUp);
router.post('/login',verifyEmailMiddleWare,authContr.login);
router.post('/logout',authContr.logout);
router.post('/verify-email',authContr.verifyEmail);
router.post('/refreshToken',authContr.generatorAccessToken);
router.post('/forgotPass',authContr.forgotPass)
router.post('/resetPass',authContr.resetPassword);
router.post('/resetLink',authContr.resetLink)


module.exports = router