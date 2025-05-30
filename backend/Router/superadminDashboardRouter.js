const express=require('express');
const { getSuperAdminDashboard } = require('../Controller/superAdminDashboardController');

const router = express.Router()

router.get('/',getSuperAdminDashboard)



// <<<<<<< HEAD
 module.exports = router 
// =======
//  module.exports = router 
// >>>>>>> 79808baa02111460ccbfcef4bfc607569a17439f
