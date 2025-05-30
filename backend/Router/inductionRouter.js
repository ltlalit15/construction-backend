const express = require('express');
const { createInduction, getAllInduction, getInductionById, updateInduction, deleteInduction, getInductions } = require('../Controller/InductionController');

const router = express.Router();

router.post('/',createInduction);

router.get('/',getAllInduction);

router.get('/:id',getInductionById)

router.patch('/:id',updateInduction)

router.delete('/:id',deleteInduction)

router.get('/',getInductions)



module.exports = router;