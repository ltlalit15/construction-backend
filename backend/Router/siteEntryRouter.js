const express=require('express');
const { createSiteEntry, getAllSiteEntries, getSiteEntryById, updateSiteEntry, deleteSiteEntry } = require('../Controller/siteEntryController');

const router = express.Router()

router.post('/',createSiteEntry)

router.get('/',getAllSiteEntries)

router.get('/:id',getSiteEntryById)

router.patch('/:id',updateSiteEntry)

router.delete('/:id',deleteSiteEntry)



 module.exports = router 
