const TestController = require('./TestController');
const express = require('express');
const router = express.Router();
const { adminAuthorization, checkTokenExists } = require('../middlewares/authMiddleware');
const upload = require("../middlewares/uploadMiddleware");

router.post('/create', [adminAuthorization, checkTokenExists], TestController.createTest);
router.get('/all', [checkTokenExists], TestController.getAllTests);
router.get('/:id', [checkTokenExists], TestController.getTest);
router.get('/chapter/:id', [checkTokenExists], TestController.getTestsByChapter);
router.put('/update/:id', [adminAuthorization, checkTokenExists], TestController.updateTest);
router.delete('/delete/:id', [adminAuthorization, checkTokenExists], TestController.deleteTest);

router.post('/submit/:id', [checkTokenExists, upload.single('attachment')], TestController.submitTest);
router.get('/results/:id', [checkTokenExists], TestController.getUserResults);

module.exports = router;