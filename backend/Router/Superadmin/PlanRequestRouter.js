// /Router/Superadmin/PlanPackageRouter.js
const express = require('express');
const { PlanRequestCreate, AllPlanRequest, deletePlanRequest, UpdatePlanRequest, SinglePlanRequest } = require('../../Controller/Superadmin/PlanRequestController');

const router = express.Router();

// POST /api/planPackage
router.post('/',PlanRequestCreate);

router.get('/',AllPlanRequest);

router.delete('/:id',deletePlanRequest);

router.patch('/:id',UpdatePlanRequest );

router.get('/:id',SinglePlanRequest);

module.exports = router;
