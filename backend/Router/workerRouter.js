const express = require('express');
const {  createWorker, getAllWorkers, getWorkerById, updateWorker, deleteWorker } = require('../Controller/workerController');

const router = express.Router();

router.post('/',createWorker);

router.get('/',getAllWorkers)

router.get('/:id',getWorkerById)

router.patch('/:id',updateWorker)

router.delete('/:id',deleteWorker)




module.exports = router;