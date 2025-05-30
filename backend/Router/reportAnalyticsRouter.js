const express=require('express');
const { getReportsAnalytics } = require('../Controller/reportAnalyticsController');

const router = express.Router()

router.get('/:projectId',getReportsAnalytics)



module.exports = router