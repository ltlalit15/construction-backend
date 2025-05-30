const express = require('express');
const { TasksManagementCreate, AllTasksManagement, SingleTasksManagement, deleteTasksManagement, UpdateTasksManagement } = require('../Controller/TasksManagementController');

const router = express.Router();

router.post('/',TasksManagementCreate);

router.get('/',AllTasksManagement)

router.get('/:id',SingleTasksManagement)

router.delete('/:id',deleteTasksManagement)

router.patch('/:id',UpdateTasksManagement)


module.exports = router;