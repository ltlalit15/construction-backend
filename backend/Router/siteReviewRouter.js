const express=require('express');
const { createSiteReview, getAllSiteReviews, getSiteReviewById, updateSiteReview, deleteSiteReview } = require('../Controller/siteReviewController');

const router = express.Router()

router.post('/',createSiteReview)

router.get('/',getAllSiteReviews)

router.get('/:id',getSiteReviewById)

router.patch('/:id',updateSiteReview)

router.delete('/:id',deleteSiteReview)



module.exports = router 
