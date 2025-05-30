const express=require('express');
const { createAnnotation, getAllAnnotations, getAnnotationById, updateAnnotation, deleteAnnotation } = require('../Controller/annotationController');

const router = express.Router()

router.post('/',createAnnotation)

router.get('/',getAllAnnotations)

router.get('/:id',getAnnotationById)

router.patch('/:id',updateAnnotation)

router.delete('/:id',deleteAnnotation)


module.exports = router 
