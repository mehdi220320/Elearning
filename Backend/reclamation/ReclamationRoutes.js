const ReclamationController=require('./ReclamationController')
const express = require('express');
const router = express.Router();
const { adminAuthorization, checkTokenExists } = require('../middlewares/authMiddleware');
const Reclamation=require('./Reclamation')
router.post('/add', [ checkTokenExists], ReclamationController.add);
router.post('/seen/:id', [ checkTokenExists,adminAuthorization], ReclamationController.makeItAsSeen);
router.get('/all', [ checkTokenExists], ReclamationController.getAll);
router.get('/newest', [ checkTokenExists], ReclamationController.Newest);
router.get('/numberOfReclamations',[adminAuthorization,checkTokenExists],async (req,res)=>{
    try {
        const  reclamations = await Reclamation.find()
        res.send(reclamations.length)
    }catch (e){
        res.send(e)
    }
})
router.get('/:id', [ checkTokenExists], ReclamationController.getById);

module.exports = router;