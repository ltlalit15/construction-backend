const asyncHandler = require("express-async-handler");
const PlanPackage = require("../../Model/Superadmin/PlanPackageModel");


const planPackageCreate = asyncHandler(async (req, res) => {
  const {
    name,
    pricePerYear,
    activeProjects,
    siteEngineers,
    materialReports,
    siteVisitLogs,
    support,
    dedicatedAccountManager
  } = req.body;

  try {
    if (
      !name ||
      !pricePerYear ||
      activeProjects === undefined ||
      siteEngineers === undefined ||
      !materialReports ||
      siteVisitLogs === undefined ||
      !support
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    const newPlan = new PlanPackage({
      name,
      pricePerYear,
      features: {
        activeProjects,
        siteEngineers,
        materialReports,
        siteVisitLogs,
        support,
        dedicatedAccountManager: dedicatedAccountManager || false
      }
    });

    await newPlan.save();

    res.status(201).json({
      success: true,
      message: "Plan created successfully",
      plan: newPlan
    });
  } catch (error) {
    console.error("Error creating Plan:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the Plan",
      error: error.message
    });
  }
});


  //GET SINGLE AllProjects
  //METHOD:GET
  const AllPlan = async (req, res) => {
      const AllPlan = await PlanPackage.find()
      if (AllPlan === null) {
        res.status(404)
        throw new Error("Categories Not Found")
      }
      res.json(AllPlan)
    }
  
   //GET SINGLE DeleteProjects
    //METHOD:DELETE
   const deletePlan = async (req, res) => {
      let deletePlanID = req.params.id
      if (deletePlan) {
        const deletePlan = await PlanPackage.findByIdAndDelete(deletePlanID, req.body);
        res.status(200).json("Delete Plan Successfully")
      } else {
        res.status(400).json({ message: "Not Delete project" })
      }
    }
    
  
  const UpdatePlan = async (req, res) => {
    try {
      const allowedFields = [
        'name',
        'pricePerYear',
        'activeProjects',
        'siteEngineers',
        'materialReports',
        'siteVisitLogs',
        'support',
        'dedicatedAccountManager'
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
  
      const updatedSwms = await PlanPackage.findByIdAndUpdate(
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
  const SinglePlan=async(req,res)=>{
      try {
          const SinglePlan= await PlanPackage.findById(req.params.id);
          res.status(200).json(SinglePlan)
      } catch (error) {
          res.status(404).json({msg:"Can t Find Diaries"} )
      }
  }
module.exports = {planPackageCreate,AllPlan,deletePlan,UpdatePlan,SinglePlan};