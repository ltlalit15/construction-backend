const express=require('express');
const { getSafetyDashboardData } = require('../Controller/safetyDashboard');

const router = express.Router()

router.get('/',getSafetyDashboardData)


module.exports = router 
