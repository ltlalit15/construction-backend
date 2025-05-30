const express=require('express');
const { addBuildingCategory, getAllBuildingCategories } = require('../Controller/buildingCategoryController');

const router = express.Router()

router.post('/',addBuildingCategory)

router.get('/',getAllBuildingCategories)

// router.get('/:id',getAnnotationById)

// router.patch('/:id',updateAnnotation)

// router.delete('/:id',deleteAnnotation)


module.exports = router 