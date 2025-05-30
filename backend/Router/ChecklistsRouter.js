const express = require('express');
const { ChecklistsCreate, AllChecklists, SingleChecklists, deleteChecklists, UpdateChecklists } = require('../Controller/ChecklistsController');

const router = express.Router();

router.post('/',ChecklistsCreate);

router.get('/',AllChecklists)

router.get('/:id',SingleChecklists)

router.delete('/:id',deleteChecklists)

router.patch('/:id',UpdateChecklists)


module.exports = router;