const express=require('express');
const { createAnnouncement, getAllAnnouncements, getAnnouncementById, updateAnnouncement, deleteAnnouncement } = require('../Controller/annoucementController');

const router = express.Router()

router.post('/',createAnnouncement)

router.get('/',getAllAnnouncements)

router.get('/:id',getAnnouncementById)

router.patch('/:id',updateAnnouncement)

router.delete('/:id',deleteAnnouncement)



 module.exports = router 
