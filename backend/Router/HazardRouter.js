const express = require('express');
const { createHazard, getAllHazards, getSingleHazard, updateHazard, deleteHazard, getAllProjectsWithTasksAndHazards } = require('../Controller/HazardController');

const router = express.Router();

router.post('/',createHazard);

router.get('/',getAllHazards)

router.get('/:id',getSingleHazard)

router.patch('/:id',updateHazard)

router.delete('/:id',deleteHazard)

router.get('/', getAllProjectsWithTasksAndHazards);


module.exports = router;