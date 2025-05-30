const express = require('express');
const { TimeSheetCreate, AllTimeSheet, SingleTimeSheet, deleteTimeSheet, UpdateTimeSheet } = require('../Controller/TimeSheetController');

const router = express.Router();

router.post('/',TimeSheetCreate);

router.get('/',AllTimeSheet)

router.get('/:id',SingleTimeSheet)

router.delete('/:id',deleteTimeSheet)

router.put('/:id',UpdateTimeSheet)

module.exports = router;