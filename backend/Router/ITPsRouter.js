const express = require('express');
const { ITPcCreate, UpdateITPc, SingleITPc, deleteITPc, AllITPc, getITPs } = require('../Controller/ITPsController');

const router = express.Router();

router.post('/',ITPcCreate);

router.get('/',AllITPc)

router.get('/',getITPs)

router.get('/:id',SingleITPc)

router.delete('/:id',deleteITPc)

router.patch('/:id',UpdateITPc)

module.exports = router;
