const express = require('express')
const { authVerify, isRole } = require('../middlewares/authMiddleWare')
const postController = require('../controllers/postController');
const upload = require('../utils/multerStorage');
const router = express.Router()

router.post('/post',authVerify,isRole.admin,upload.array('img'),postController.createPost);
router.post('/comment',authVerify,postController.postComment);
router.delete('/comment/:id',authVerify,postController.deleteComment);
router.put('/post/:id/update',authVerify,postController.updatePost);
router.get('/posts',authVerify,isRole.admin,postController.getAllPost);
router.patch('/post/:id/like',authVerify,postController.likeAction);
router.patch('/post/:id/unlike',authVerify,postController.unlike);

module.exports = router