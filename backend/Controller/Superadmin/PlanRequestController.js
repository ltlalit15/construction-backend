const asyncHandler = require("express-async-handler");
const PlanRequest = require("../../Model/Superadmin/PlanRequestModel");

const PlanRequestCreate = asyncHandler(async (req, res) => {
    const {
      company,
      planName,
      activeProjects,
      siteEngineers,
      dailySiteVisits,
      reports,
      duration,
    } = req.body;
  
    try {
      if (
        !company ||
        !planName ||
        activeProjects === undefined ||
        siteEngineers === undefined ||
        dailySiteVisits === undefined ||
        !reports ||
        !duration
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide all required fields"
        });
      }
  
      const newPlanRequest = new PlanRequest({
        company,
        planName,
        activeProjects,
        siteEngineers,
        dailySiteVisits,
        reports,
        duration
      });
  
      await newPlanRequest.save();
  
      res.status(201).json({
        success: true,
        message: "Plan request created successfully",
        planRequest: newPlanRequest
      });
    } catch (error) {
      console.error("Error creating Plan Request:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while creating the Plan Request",
        error: error.message
      });
    }
  });
  


  //GET SINGLE AllProjects
  //METHOD:GET
  const AllPlanRequest = async (req, res) => {
      const AllPlanRequest = await PlanRequest.find()
      if (AllPlanRequest === null) {
        res.status(404)
        throw new Error("Categories Not Found")
      }
      res.json(AllPlanRequest)
    }
  
   //GET SINGLE DeleteProjects
    //METHOD:DELETE
   const deletePlanRequest = async (req, res) => {
      let deletePlanRequestID = req.params.id
      if (deletePlanRequest) {
        const deletePlanRequest = await PlanRequest.findByIdAndDelete(deletePlanRequestID, req.body);
        res.status(200).json("Delete Plan Successfully")
      } else {
        res.status(400).json({ message: "Not Delete project" })
      }
    }
    
  
  const UpdatePlanRequest = async (req, res) => {
    try {
      const allowedFields = [
        'company',
        'planName',
        'activeProjects',
        'siteEngineers',
        'dailySiteVisits',
        'reports',
        'duration',
      ];
  
      const updateData = {};
  
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });
  
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'At least one field must be provided for update' });
      }
  
      const updatedSwms = await PlanRequest.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
      if (!updatedSwms) {
        return res.status(404).json({ message: 'SWMS not found' });
      }
      res.status(200).json(updatedSwms);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  
  //METHOD:Single
  //TYPE:PUBLIC
  const SinglePlanRequest=async(req,res)=>{
      try {
          const SinglePlanRequest= await PlanRequest.findById(req.params.id);
          res.status(200).json(SinglePlanRequest)
      } catch (error) {
          res.status(404).json({msg:"Can t Find Diaries"} )
      }
  }
module.exports = {PlanRequestCreate,AllPlanRequest,deletePlanRequest,UpdatePlanRequest,SinglePlanRequest};