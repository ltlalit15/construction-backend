const express=require('express');
const { createIncident, getAllIncidents, getIncidentById, updateIncident, deleteIncident } = require('../Controller/IncidentController');

const router = express.Router()

router.post('/',createIncident)

router.get('/',getAllIncidents)

router.get('/:id',getIncidentById)

router.patch('/:id',updateIncident)

router.delete('/:id',deleteIncident)


module.exports = router 
