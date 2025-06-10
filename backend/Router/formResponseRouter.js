const express = require('express');
const { createFormResponse, getAllFormResponses, getFormResponseById, updateFormResponse, deleteFormResponse } = require('../Controller/formResponseController');

const router = express.Router();

router.post('/',createFormResponse);

router.get('/',getAllFormResponses)

router.get('/:id',getFormResponseById)

router.delete('/:id',deleteFormResponse)

router.patch('/:id',updateFormResponse)


module.exports = router;
