const ReclamationController=require('./ReclamationController')
const express = require('express');
const router = express.Router();
const { adminAuthorization, checkTokenExists } = require('../middlewares/authMiddleware');

router.post('/add', [ checkTokenExists], ReclamationController.add);
router.post('/seen/:id', [ checkTokenExists,adminAuthorization], ReclamationController.makeItAsSeen);
router.get('/all', [ checkTokenExists], ReclamationController.getAll);
router.get('/:id', [ checkTokenExists], ReclamationController.getById);

module.exports = router;