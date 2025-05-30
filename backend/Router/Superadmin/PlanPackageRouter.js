// /Router/Superadmin/PlanPackageRouter.js
const express = require('express');
const { planPackageCreate, AllPlan, deletePlan, UpdatePlan, SinglePlan } = require('../../Controller/Superadmin/PlanPackageController');

const router = express.Router();

// POST /api/planPackage
router.post('/',planPackageCreate );

router.get('/',AllPlan );

router.delete('/:id',deletePlan);

router.patch('/:id',UpdatePlan );

router.get('/:id',SinglePlan);

module.exports = router;
