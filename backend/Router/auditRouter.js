const express=require('express');
const { createSecurityAuditReport, getAllSecurityAuditReports, getSecurityAuditReportById, updateSecurityAuditReport, deleteSecurityAuditReport} = require('../Controller/auditController');

const router = express.Router()

router.post('/',createSecurityAuditReport)

router.get('/',getAllSecurityAuditReports)

router.get('/:id',getSecurityAuditReportById)

router.patch('/:id',updateSecurityAuditReport)

router.delete('/:id',deleteSecurityAuditReport)



 module.exports = router 
