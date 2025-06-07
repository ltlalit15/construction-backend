const express = require('express');
const { DrawingRegisterCreate, AllDrawingRegister, SingleDrawingRegister, deleteDrawingRegister, UpdateDrawingRegister } = require('../Controller/DrawingRegisterController');

const router = express.Router();

router.post('/',DrawingRegisterCreate);

router.get('/',AllDrawingRegister)

router.get('/:id',SingleDrawingRegister)

router.delete('/:id',deleteDrawingRegister)

router.patch('/:id',UpdateDrawingRegister)

module.exports = router;
