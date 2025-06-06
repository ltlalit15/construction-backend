const express=require('express');
const { getRecentAlerts } = require('../Controller/alertsNotificationController');

const router = express.Router()

router.get('/',getRecentAlerts)


module.exports = router 
