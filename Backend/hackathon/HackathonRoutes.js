const HackathonController=require('./HackathonController')
const express = require('express');
const router = express.Router();
const { adminAuthorization, checkTokenExists } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/add', [adminAuthorization, checkTokenExists,upload.single('coverImage')], HackathonController.addHackathon);
router.get('/all', [adminAuthorization, checkTokenExists], HackathonController.getAll);
router.delete('/delete/:id', [adminAuthorization, checkTokenExists], HackathonController.deleteHackathonById);

module.exports = router;