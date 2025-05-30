const mongoose =require("mongoose")

const DiariesSchema = new mongoose.Schema({
    date:{
        type:Date,
        required:true,
    },
    projectName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Projects",
        required: true
      },
    supervisorName:{
        type:String,
        required:true,
    },
    weather:{
        type:String,
        required:true,
    },
    workPerformed:{
        type:String,
        required:true,
    },
    issuesDelays:{
        type:String,
        required:true,
    },
},{
    timestamps:true,
})


module.exports = mongoose.model('Diaries',DiariesSchema)

