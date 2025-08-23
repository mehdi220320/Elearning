const HackathonController=require('./HackathonController')
const express = require('express');
const router = express.Router();
const { adminAuthorization, checkTokenExists } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/add', [adminAuthorization, checkTokenExists,upload.single('coverImageFile')], HackathonController.addHackathon);
router.get('/all', [adminAuthorization, checkTokenExists], HackathonController.getAll);
router.get('/:id', [adminAuthorization, checkTokenExists], HackathonController.getById);
router.delete('/delete/:id', [adminAuthorization, checkTokenExists], HackathonController.deleteHackathonById);
router.post("/:id/participants/:userId", [adminAuthorization, checkTokenExists], HackathonController.addParticipant);
router.delete('/:id/participants/:userId', [adminAuthorization, checkTokenExists], HackathonController.removeParticipant);

module.exports = router;