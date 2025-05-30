const express = require('express');
const { createPlantAuditReport, getAllPlantAuditReports, getSinglePlantAuditReport, updatePlantAuditReport, deletePlantAuditReport  } = require('../Controller/plantAuditReportController');

const router = express.Router();

router.post('/',createPlantAuditReport);

router.get('/',getAllPlantAuditReports)

router.get('/:id',getSinglePlantAuditReport)

router.patch('/:id',updatePlantAuditReport)

router.delete('/:id',deletePlantAuditReport)


module.exports = router;