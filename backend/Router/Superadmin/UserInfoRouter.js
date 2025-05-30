const express=require('express');
const { createSuperadmin, AllSuperadmin, deleteSuperadmin, UpdateSuperadmin, SingleSuperadmin, SuperasdminSettingChang } = require('../../Controller/Superadmin/UserInfoController');


const router = express.Router()

router.post('/',createSuperadmin)

router.get('/',AllSuperadmin)

router.get('/:id',SingleSuperadmin)

router.delete('/:id',deleteSuperadmin)

router.patch('/:id',UpdateSuperadmin)

router.patch('/SingleSuperadmin/:id',SingleSuperadmin)


 // Superasdmin Setting Chang 
 router.patch('/:id',SuperasdminSettingChang)
 module.exports = router 
