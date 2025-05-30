const mongoose =require("mongoose")


const TimeSheetSchema = new mongoose.Schema({
    date:{
        type:Date,
        required:true,
    },
    worker:{
        type:String,
        required:true,
    },
    project:{
        type:String,
        required:true,
    },
    hoursWorked:{
        type:String,
        required:true,
    },
    Overtime:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
},{
    timestamps:true,
})

module.exports = mongoose.model('TimeSheet',TimeSheetSchema)