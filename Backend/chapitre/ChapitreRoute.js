const express = require('express');
const ChapitreController=require('./ChapitreController')
const router = express.Router();
const { adminAuthorization, checkTokenExists } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadFileMiddleware');

router.post('/add', [adminAuthorization, checkTokenExists,upload.single('file')], ChapitreController.addChapitre);
router.get('/all', [adminAuthorization, checkTokenExists], ChapitreController.getAll);
router.get('/ressources', [adminAuthorization, checkTokenExists], ChapitreController.getRessources);
router.get('/medias', [adminAuthorization, checkTokenExists], ChapitreController.getMedia);
// router.delete('/delete/:id', [adminAuthorization, checkTokenExists], instructorController.deleteInstructor);
// router.put('/isArchive/:id',[adminAuthorization, checkTokenExists], courseController.isArchive);

module.exports = router;