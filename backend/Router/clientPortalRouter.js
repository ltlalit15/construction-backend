const express=require('express');
const { getClientPortalData } = require('../Controller/clientPortalController');

const router = express.Router()

//router.get('/:projectId',getClientDashboard)

router.get('/:projectId',getClientPortalData)


module.exports = router 