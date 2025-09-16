const categoryController=require('./CategoryController')
const express = require('express');
const router = express.Router();
const { adminAuthorization, checkTokenExists } = require('../middlewares/authMiddleware');

router.post('/addcategory', [adminAuthorization, checkTokenExists], categoryController.addCategory);
router.get('/all', categoryController.getAll);
router.delete('/delete/:id', [adminAuthorization, checkTokenExists], categoryController.deleteCatgById);

module.exports = router;