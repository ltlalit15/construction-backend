const mongoose =require("mongoose")


const DrawingRegisterSchema = new mongoose.Schema({
    documentTitle:{
        type:String,
        required:true,
    },
    documentType:{
        type:String,
        required:true,
    },
    folder:{
        type:String,
        required:true,
    },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comments:{
    type:String,
    required:true,
  },
  status:{
    type: String,
   
  },
  image: [], 

},{
    timestamps:true,
})

module.exports = mongoose.model('DrawingRegister',DrawingRegisterSchema)
