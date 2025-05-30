const express=require('express');
const { getDashboardData } = require('../Controller/DashboardController');

const router = express.Router()

router.get('/',getDashboardData)



module.exports = router 