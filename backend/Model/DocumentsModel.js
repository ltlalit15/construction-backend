const mongoose =require("mongoose")

const DocumentsSchema = new mongoose.Schema({
   // folder: { type: String, required: true },
    documentName: { type: String, required: true },
    documentType: { type: String, required: true },
    assignTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dueDate: { type: Date, required: true },
     status: { type: String },
    comments: { type: String, required: true },
    image: [],
  }, {
    timestamps: true,
  });
  


module.exports = mongoose.model('Documents',DocumentsSchema)
