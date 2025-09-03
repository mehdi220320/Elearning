const HackathonController=require('./HackathonController')
const express = require('express');
const router = express.Router();
const { adminAuthorization, checkTokenExists } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const Hackathon = require("./Hackathon");

router.post('/add', [adminAuthorization, checkTokenExists,upload.single('coverImageFile')], HackathonController.addHackathon);
router.get('/all', [adminAuthorization, checkTokenExists], HackathonController.getAll);
router.get('/next', [adminAuthorization, checkTokenExists], HackathonController.getNextHackathons);
router.get('/nextPagination', [adminAuthorization, checkTokenExists], HackathonController.getNextHackathonsPagination);
router.get('/numberOfHackathons',[adminAuthorization,checkTokenExists],async (req,res)=>{
    try {
        const  hacks = await Hackathon.find({status:'ongoing'})
        res.send(hacks.length.toString())
    }catch (e){
        res.send(e)
    }
})

router.get('/:id', [adminAuthorization, checkTokenExists], HackathonController.getById);
router.delete('/delete/:id', [adminAuthorization, checkTokenExists], HackathonController.deleteHackathonById);
router.post("/:id/participants/:userId", [adminAuthorization, checkTokenExists], HackathonController.addParticipant);
router.delete('/:id/participants/:userId', [adminAuthorization, checkTokenExists], HackathonController.removeParticipant);
router.put('/update/:id', [adminAuthorization, checkTokenExists, upload.single('coverImageFile')], HackathonController.updateHackathon);
module.exports = router;