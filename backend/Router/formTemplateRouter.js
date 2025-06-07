const express = require('express');
const { createFormTemplate, getFormTemplates, getFormTemplateById, updateFormTemplate, deleteFormTemplate } = require('../Controller/formTemplateController');

const router = express.Router();

router.post('/',createFormTemplate);

router.get('/',getFormTemplates)

router.get('/:id',getFormTemplateById)

router.delete('/:id',deleteFormTemplate)

router.patch('/:id',updateFormTemplate)


module.exports = router;
