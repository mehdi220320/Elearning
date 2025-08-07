const RatingController=require('./RatingController')
const express = require('express');
const router = express.Router();
const { adminAuthorization, checkTokenExists } = require('../middlewares/authMiddleware');
const upload = require("../middlewares/uploadMiddleware");

router.post('/add', [adminAuthorization, checkTokenExists], RatingController.add);
router.get('/all',  [checkTokenExists,upload.single('picture')], RatingController.getAll);
router.get('/formateur/:id',  [checkTokenExists,upload.single('picture')], RatingController.getRatesByFormateur);
router.get('/course/:id',  [checkTokenExists,upload.single('picture')], RatingController.getRatesByCourse);

module.exports = router;