const CommentController=require('./CommentController')
const express = require('express');
const router = express.Router();
const { adminAuthorization, checkTokenExists } = require('../../middlewares/authMiddleware');

router.post('/add', [adminAuthorization, checkTokenExists], CommentController.addComment);
router.get('/chapter/:id', [adminAuthorization, checkTokenExists], CommentController.getByChapter);
router.post('/addLike', [adminAuthorization, checkTokenExists], CommentController.addLike);
router.delete('/removeLike/:userId/:commentId', [adminAuthorization, checkTokenExists], CommentController.removeLike);
router.delete('/delete/:id', [adminAuthorization, checkTokenExists], CommentController.deleteById);

module.exports = router;