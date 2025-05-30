 
const mongoose = require('mongoose');
const HazardSchema = require('../Model/HazardModel').schema

const PPESchema = new mongoose.Schema(
 {
   name: {
    type: String,
    required: true
   },
    mandatory: { type: Boolean, }

 }
)

const hazardTemplateSchema = new mongoose.Schema(
    {
    workactivity : {
        type: String,
        required: true
    },
    hazards : [HazardSchema],
    requiredPPE : [PPESchema]
    

}
)


module.exports = mongoose.model('hazardTemplate', hazardTemplateSchema);

