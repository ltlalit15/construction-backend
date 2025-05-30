const express=require('express');
const { createToolboxTalk, getAllToolboxTalks, getToolboxTalkById, updateToolboxTalk, deleteToolboxTalk  } = require('../Controller/toolboxController');

const router = express.Router()

router.post('/',createToolboxTalk)

router.get('/',getAllToolboxTalks)

router.get('/:id',getToolboxTalkById)

router.patch('/:id',updateToolboxTalk)  

router.delete('/:id',deleteToolboxTalk )

 module.exports = router 