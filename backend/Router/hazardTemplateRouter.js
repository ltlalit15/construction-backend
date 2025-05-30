const express = require('express');
const { createHazardTemplate, getAllHazardTemplates, getHazardTemplateById, updateHazardTemplate, deleteHazardTemplate } = require('../Controller/hazardTemplateController');

const router = express.Router();

router.post('/',createHazardTemplate);

router.get('/',getAllHazardTemplates)

router.get('/:id',getHazardTemplateById)

router.patch('/:id',updateHazardTemplate)   

router.delete('/:id',deleteHazardTemplate)


module.exports = router;