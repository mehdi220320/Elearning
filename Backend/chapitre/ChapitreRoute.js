const express = require('express');
const ChapitreController=require('./ChapitreController')
const router = express.Router();
const { adminAuthorization, checkTokenExists } = require('../middlewares/authMiddleware');
const uploadMultiple = require('../middlewares/uploadMultiple');

router.post('/add', [adminAuthorization, checkTokenExists, uploadMultiple.array('files')], ChapitreController.addChapitre);
router.get('/all', [adminAuthorization, checkTokenExists], ChapitreController.getAll);
router.get('/course/:id', [adminAuthorization, checkTokenExists], ChapitreController.getByCourseId);
router.get('/course/dureeVideos/:id', [adminAuthorization, checkTokenExists], ChapitreController.getVideoDurationByCourseId);
router.get('/course/nbDocumments/:id', [adminAuthorization, checkTokenExists], ChapitreController.getNumberOfDocumentsByCourseId);
router.get('/ressources', [adminAuthorization, checkTokenExists], ChapitreController.getRessources);
router.get('/medias', [adminAuthorization, checkTokenExists], ChapitreController.getMedia);
// router.delete('/delete/:id', [adminAuthorization, checkTokenExists], instructorController.deleteInstructor);
// router.put('/isArchive/:id',[adminAuthorization, checkTokenExists], courseController.isArchive);
router.get('/:id', [adminAuthorization, checkTokenExists], ChapitreController.getById);

module.exports = router;