const express=require('express');

const { EquipmentCreate, AllEquipment, SingleEquipment, UpdateEquipment, deleteEquipment } = require('../Controller/PlantMachineryEquipmentController');

const router = express.Router()

router.post('/',EquipmentCreate)

router.get('/',AllEquipment)

router.get('/:id',SingleEquipment)

router.patch('/:id',UpdateEquipment)

router.delete('/:id',deleteEquipment)


module.exports = router 
