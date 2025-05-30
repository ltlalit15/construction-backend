const express = require('express');
const { createPlantTool, getAllPlantTools, getSinglePlantTool, updatePlantTool, deletePlantTool  } = require('../Controller/plantToolController');

const router = express.Router();


router.post('/',createPlantTool);

router.get('/',getAllPlantTools)

router.get('/:id',getSinglePlantTool)

router.patch('/:id',updatePlantTool)

router.delete('/:id',deletePlantTool)


module.exports = router;