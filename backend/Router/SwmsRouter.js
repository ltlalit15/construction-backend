const express = require('express');
const { SwmsCreate, AllSwms, SingleSwms, deleteSwms, UpdateSwms } = require('../Controller/SwmsController');

const router = express.Router();

router.post('/',SwmsCreate);

router.get('/',AllSwms)

router.get('/:id',SingleSwms)

router.delete('/:id',deleteSwms)

router.patch('/:id',UpdateSwms)

module.exports = router;