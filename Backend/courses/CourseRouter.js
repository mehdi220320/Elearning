const courseController=require('./CourseController')
const express = require('express');
const router = express.Router();
const { adminAuthorization, checkTokenExists } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/add', [adminAuthorization, checkTokenExists,upload.single('coverImage')], courseController.add);
router.get('/all',  checkTokenExists, courseController.getAll);
router.get('/instructor/:id',  checkTokenExists, courseController.getCoursesByInstructor);
router.get('/:id',  checkTokenExists, courseController.getById);
router.get('/category/:id',  checkTokenExists, courseController.getCoursesByCategorie);
// router.delete('/delete/:id', [adminAuthorization, checkTokenExists], instructorController.deleteInstructor);
router.put('/isArchive/:id',[adminAuthorization, checkTokenExists], courseController.isArchive);

module.exports = router;