const express=require('express');
const { createChat, getAllChats, searchChats, sendMessage, deleteChat, createGroupChat } = require('../Controller/chatController');

const router = express.Router()

router.post('/',createChat)

router.get('/',getAllChats)

router.get('/:searchTerm',searchChats)

router.post('/sendMessage',sendMessage)

router.delete('/:id',deleteChat)

router.post('/',createGroupChat)


module.exports = router 
