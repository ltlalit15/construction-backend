// models/Worker.js

const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    whiteCardNumber: {
      type: String,
      required: true,
    },
    whiteCardExpiry: {
      type: String,
    },
    inductionDate: {
      type: String,
      required: true,
    },
    complianceStatus: {
      type: String,
      required: true,
    },
    accessHours: {
      type: Number,
      default: 0,
    },
    supervisorAssignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workArea: {
      type: String,
    },
    accessLevel: {
      type: String,
    },

    workeractive: {type: String},
    workerinactive: {type: String},
    image: []
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("worker", workerSchema);
