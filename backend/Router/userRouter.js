const express = require('express');
const userController = require('../Controller/userController');


const router = express.Router();

// Public routes
// TEMPORARY: Authentication middleware disabled to allow initial user creation
// router.use(authController.protect);

// Admin only routes
router
  .route('/')
  .get(
    // authController.protect,
    // authController.restrictTo('admin'),
    userController.getAllUsers
  )
  .post(
    // authController.protect,
    // authController.restrictTo('admin'),
    userController.createUser // Assumes file upload is handled by express-fileupload
  );

router
  .route('/:id')
  .get(
    // authController.protect,
    // authController.restrictTo('admin'),
    userController.getUser
  )
  .patch(
    // authController.protect,
    // authController.restrictTo('admin'),
    userController.updateUser
  )
  .delete(
    // authController.protect,
    // authController.restrictTo('admin'),
    userController.deleteUser
  );


  
module.exports = router;