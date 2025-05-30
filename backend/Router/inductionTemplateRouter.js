const express = require('express');
const { createInductionTemplate, getAllInductionTemplates, getInductionTemplateById, updateInductionTemplate, deleteInductionTemplate } = require('../Controller/inductionTemplateController');

const router = express.Router();

router.post('/',createInductionTemplate);

router.get('/',getAllInductionTemplates);

router.get('/:id',getInductionTemplateById)

router.patch('/:id',updateInductionTemplate)

router.delete('/:id',deleteInductionTemplate)





module.exports = router;