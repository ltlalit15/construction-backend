const express = require('express');
const { createQuestion, getAllQuestions, getSingleQuestion, updateQuestion, deleteQuestion } = require('../Controller/questionController');

const router = express.Router();

router.post('/',createQuestion);

router.get('/',getAllQuestions)

router.get('/:id',getSingleQuestion)

router.patch('/:id',updateQuestion)

router.delete('/:id',deleteQuestion)



module.exports = router;