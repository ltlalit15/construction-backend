const express = require('express');
const { CalendarCreate, SingleCalendar, deleteCalendar, AllCalendar, UpdateCalendar } = require('../Controller/CalendarController');

const router = express.Router();

router.post('/',CalendarCreate);

router.get('/',AllCalendar);

router.get('/:id',SingleCalendar)

router.delete('/:id',deleteCalendar)

router.patch('/:id',UpdateCalendar)

module.exports = router;