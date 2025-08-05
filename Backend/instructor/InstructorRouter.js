const instructorController=require('./InstructorController')
const express = require('express');
const router = express.Router();
const { adminAuthorization, checkTokenExists } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/add', [adminAuthorization, checkTokenExists,upload.single('picture')], instructorController.addInstructor);
router.get('/all',  checkTokenExists, instructorController.getAll);
router.get('/:id',  checkTokenExists, instructorController.getInstructorByid);
router.delete('/delete/:id', [adminAuthorization, checkTokenExists], instructorController.deleteInstructor);

module.exports = router;