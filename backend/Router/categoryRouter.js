const express=require('express');
const { addCategory, getAllCategories } = require('../Controller/categoryController');

const router = express.Router()

router.post('/',addCategory)

router.get('/',getAllCategories)

// router.get('/:id',getAnnotationById)

// router.patch('/:id',updateAnnotation)

// router.delete('/:id',deleteAnnotation)



 module.exports = router 