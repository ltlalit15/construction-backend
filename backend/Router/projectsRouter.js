const express=require('express');
const { ProjectsCreate, Allprojects, deleteprojects, projectsUpdate, projectsSingle, getProjectsByUser } = require('../Controller/projectsController');

const router = express.Router()

router.post('/',ProjectsCreate)

router.get('/',Allprojects)

router.get('/:id',projectsSingle)

router.delete('/:id',deleteprojects)

router.patch('/:id',projectsUpdate)

router.get("/by-user/:id", getProjectsByUser);


module.exports = router