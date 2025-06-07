const mongoose =require("mongoose")

const PlantMachineryEquipmentSchema = new mongoose.Schema({
    equipmentID:{
        type:String,
        required:true,
    },  
    name:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    purchaseDate:{
        type:Date,
        required:true,
    },  
    purchaseCost:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
     status: {type: String},
    image: [String],
  }, {
    timestamps: true,
  });
  

  
module.exports = mongoose.model('PlantMachineryEquipment',PlantMachineryEquipmentSchema)
