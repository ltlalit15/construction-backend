const express = require('express');
const { DiariesCreate, AllDiaries, SingleDiaries, deleteDiaries, UpdateDiaries } = require('../Controller/DiariesController');

const router = express.Router();

router.post('/',DiariesCreate);

router.get('/',AllDiaries)

router.get('/:id',SingleDiaries)

router.delete('/:id',deleteDiaries)

router.patch('/:id',UpdateDiaries)

module.exports = router;