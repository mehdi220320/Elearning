const CommentController=require('./CommentController')
const express = require('express');
const router = express.Router();
const { adminAuthorization, checkTokenExists } = require('../../middlewares/authMiddleware');

router.post('/add', checkTokenExists, CommentController.addComment);
router.get('/chapter/:id', checkTokenExists, CommentController.getByChapter);
router.post('/addLike', checkTokenExists, CommentController.addLike);
router.delete('/removeLike/:userId/:commentId', checkTokenExists, CommentController.removeLike);
router.delete('/delete/:id', checkTokenExists, CommentController.deleteById);

module.exports = router;