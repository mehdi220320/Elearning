const courseController=require('./CourseController')
const express = require('express');
const router = express.Router();
const { adminAuthorization, checkTokenExists } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/add', [adminAuthorization, checkTokenExists,upload.single('coverImage')], courseController.add);
router.get('/all', [adminAuthorization, checkTokenExists], courseController.getAll);
// router.delete('/delete/:id', [adminAuthorization, checkTokenExists], instructorController.deleteInstructor);
router.put('/isArchive/:id',[adminAuthorization, checkTokenExists], courseController.isArchive);

module.exports = router;