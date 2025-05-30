const express = require('express');
const { createPpeTemplate, getAllPpeTemplates, getSinglePpeTemplate, updatePpeTemplate, deletePpeTemplate  } = require('../Controller/ppeController');

const router = express.Router();

router.post('/',createPpeTemplate);

router.get('/',getAllPpeTemplates)

router.get('/:id',getSinglePpeTemplate)

router.patch('/:id',updatePpeTemplate)

router.delete('/:id',deletePpeTemplate)


module.exports = router;


