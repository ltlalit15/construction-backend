const express=require('express');
const { createSafetyEquipmentAssignment, getAllSafetyEquipmentAssignments, getSafetyEquipmentAssignmentById, updateSafetyEquipmentAssignment, deleteSafetyEquipmentAssignment } = require('../Controller/safetyController');

const router = express.Router()

router.post('/',createSafetyEquipmentAssignment)

router.get('/',getAllSafetyEquipmentAssignments)

router.get('/:id',getSafetyEquipmentAssignmentById)

router.patch('/:id',updateSafetyEquipmentAssignment)

router.delete('/:id',deleteSafetyEquipmentAssignment)



module.exports = router 
