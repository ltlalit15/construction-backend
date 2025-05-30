const express=require('express');
const { addBuilding, getAllBuildings, getBuildingById, updateBuilding, deleteBuilding   } = require('../Controller/buildingController');

const router = express.Router()

router.post('/',addBuilding)

router.get('/',getAllBuildings)

router.get('/:buildingId',getBuildingById)

router.patch('/:buildingId',updateBuilding)

router.delete('/:buildingId',deleteBuilding)



module.exports = router 