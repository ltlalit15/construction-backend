const mongoose =require("mongoose")


const DefectSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
     trade:{
        type:String,
        required:true,
    },
    // project:{
    //     type:String,
    //     required:true,
    // },
    location:{
        type:String,
        required:true,
    },
    // category:{
    //    type: mongoose.Schema.Types.ObjectId,
    //    ref: "Category", // Replace with your actual category model name
    //    required: true,
    // },
    assigned:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    priority:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    date:{  
        type:Date,
        required:true,
    },
    image: [],

    
},{
    timestamps:true,
})

module.exports = mongoose.model('Defect',DefectSchema)
