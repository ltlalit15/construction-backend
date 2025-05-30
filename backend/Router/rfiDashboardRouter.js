const express=require('express');
const { getRfiDashboard } = require('../Controller/rfiDashboard');

const router = express.Router()

// router.post('/',createRFI)

router.get('/',getRfiDashboard)

// router.get('/:id',getRFIById)

// router.patch('/:id',updateRFI)

// router.delete('/:id',deleteRFI)


module.exports = router 
