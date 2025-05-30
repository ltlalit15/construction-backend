const mongoose = require('mongoose');

const rfiSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  priority: { type: String, required: true },
  due_date: { type: Date, required: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
  description: { type: String, required: true },
  status: {type: String},
  image: [], // store Cloudinary URL
}, { timestamps: true });


const RFI = mongoose.model('RFI', rfiSchema);


module.exports = RFI;