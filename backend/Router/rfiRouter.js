const express=require('express');
const { createRFI, getAllRFIs, getRFIById, updateRFI, deleteRFI } = require('../Controller/rfiController');

const router = express.Router()

router.post('/',createRFI)

router.get('/',getAllRFIs)

router.get('/:id',getRFIById)

router.patch('/:id',updateRFI)

router.delete('/:id',deleteRFI)


 module.exports = router 
