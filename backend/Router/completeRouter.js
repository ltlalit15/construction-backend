const express=require('express');
const { getAllData } = require('../Controller/completeController');

const router = express.Router()

router.get('/:userId',getAllData)



module.exports = router    