const express = require('express');
const ChapitreController=require('./ChapitreController')
const router = express.Router();
const { adminAuthorization, checkTokenExists } = require('../middlewares/authMiddleware');
const uploadMultiple = require('../middlewares/uploadMultiple');

router.post('/add', [adminAuthorization, checkTokenExists, uploadMultiple.array('files')], ChapitreController.addChapitre);
router.get('/all', checkTokenExists, ChapitreController.getAll);
router.get('/course/:id', checkTokenExists, ChapitreController.getByCourseId);
router.get('/course/dureeVideos/:id', checkTokenExists, ChapitreController.getVideoDurationByCourseId);
router.get('/course/nbDocumments/:id', checkTokenExists, ChapitreController.getNumberOfDocumentsByCourseId);
router.get('/ressources', checkTokenExists, ChapitreController.getRessources);
router.get('/medias', checkTokenExists, ChapitreController.getMedia);
router.delete('/delete/:id', [adminAuthorization, checkTokenExists], ChapitreController.deleteChapterById);
// router.put('/isArchive/:id',[adminAuthorization, checkTokenExists], courseController.isArchive);
router.get('/id/:id', checkTokenExists, ChapitreController.getById);
router.put('/update/:id', [adminAuthorization, checkTokenExists, uploadMultiple.array('files')], ChapitreController.updateChapitre);

module.exports = router;