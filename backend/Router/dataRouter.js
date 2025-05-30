const express=require('express');
const { getLastThreeData  } = require('../Controller/dataController');

const router = express.Router()


router.get('/', getLastThreeData);


module.exports = router 
