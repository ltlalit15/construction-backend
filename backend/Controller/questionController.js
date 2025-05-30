const asyncHandler = require("express-async-handler");

const Question = require("../Model/questionModel"); // Import Question model

// CREATE Question
const createQuestion = asyncHandler(async (req, res) => {
  const { question, required, triggerPending, inputType } = req.body;

  try {
    const newQuestion = await Question.create({
      question,
      required,
      triggerPending,
      inputType
      
    });

    res.status(201).json({
      status: true,
      message: "Question created successfully",
      data: newQuestion,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error creating question",
      error: error.message,
    });
  }
});

// GET ALL Questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No questions found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Fetched questions successfully",
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// GET SINGLE Question
const getSingleQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        status: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Fetched question successfully",
      data: question,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching question",
      error: error.message,
    });
  }
};

// UPDATE Question
const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { question, required, triggerPending, inputType, actions } = req.body;

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { question, required, triggerPending, inputType, actions },
      { new: true } // Return the updated document
    );

    if (!updatedQuestion) {
      return res.status(404).json({
        status: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Question updated successfully",
      data: updatedQuestion,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// DELETE Question
const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({
        status: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error deleting question",
      error: error.message,
    });
  }
};


module.exports = {
  createQuestion,
  getAllQuestions,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion
 
};
