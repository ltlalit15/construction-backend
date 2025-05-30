const express = require('express');
const { DocumentsCreate, AllDocuments, SingleDocuments, deleteDocuments, UpdateDocuments } = require('../Controller/DocumentsController');

const router = express.Router();

router.post('/',DocumentsCreate);

router.get('/',AllDocuments)

router.get('/:id',SingleDocuments)

router.delete('/:id',deleteDocuments)

router.patch('/:id',UpdateDocuments)


module.exports = router;
