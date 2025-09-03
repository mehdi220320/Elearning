const courseController=require('./CourseController')
const express = require('express');
const router = express.Router();
const { adminAuthorization, checkTokenExists } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/add', [adminAuthorization, checkTokenExists,upload.single('coverImage')], courseController.add);
router.get('/all',  checkTokenExists, courseController.getAll);
router.get('/newest',  checkTokenExists, courseController.newestCourses);
router.get('/dashboard/numberCoursesActive',  checkTokenExists, courseController.numberCourseActive);
router.get('/instructor/:id',  checkTokenExists, courseController.getCoursesByInstructor);
router.get('/:id',  checkTokenExists, courseController.getById);
router.get('/category/:id',  checkTokenExists, courseController.getCoursesByCategorie);
router.delete('/delete/:id', [adminAuthorization, checkTokenExists], courseController.deleteById);
router.put('/isArchive/:id',[adminAuthorization, checkTokenExists], courseController.isArchive);
router.put('/update/:id', [adminAuthorization, checkTokenExists, upload.single('coverImage')], courseController.update);
module.exports = router;