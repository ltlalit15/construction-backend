const mongoose = require('mongoose');

const safetyEquipmentAssignmentSchema = new mongoose.Schema({
  assignmentId: {
    type: String,
    required: true,
    unique: true
  },

  assignmentDate: {
    type: Date,
    required: true
  },

  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  submissionDeadline: {
    type: Date,
    required: true
  },

  expectedReturnDate: {
    type: Date,
    required: true
  },

  equipmentChecklist: [
    {
      equipment: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      condition: {
        type: String,
        required: true
      }
    }
  ],

  additionalDetails: {
    type: String,
    required: false
  },
  specialInstructions: {
    type: String,
    required: false
  },
  equipmentConditionRemarks: {
    type: String,
    required: false
  },
  confirmation: {
    type: Boolean,
    default: false
  },
  employeeSignature: {
    type: String,
    required: false
  },
  supervisorSignature: {
    type: String,
    required: false
  },
  status: {type: String},
}, { timestamps: true });


const SafetyEquipmentAssignment = mongoose.model('SafetyEquipmentAssignment', safetyEquipmentAssignmentSchema);

module.exports = SafetyEquipmentAssignment;
