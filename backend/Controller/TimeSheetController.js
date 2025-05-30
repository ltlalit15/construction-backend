const asyncHandler = require("express-async-handler");
const TimeSheet = require("../Model/TimeSheetModel");


const TimeSheetCreate=asyncHandler(async(req,res) => {
  
    const { date, worker, project, hoursWorked, Overtime, status } = req.body;

    if (!date || !worker || !project || !hoursWorked || !Overtime || !status) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newDiaries = await TimeSheet.create({
        date,
        worker,
        project,
        hoursWorked,
        Overtime,
        status,
    });

    res.status(201).json( newDiaries );

    res.send('Diaries Router');
  })

  
   
  //GET SINGLE AllProjects
  //METHOD:GET
  const AllTimeSheet = async (req, res) => {
      const AllTimeSheet = await TimeSheet.find()
      if (AllTimeSheet === null) {
        res.status(404)
        throw new Error("Categories Not Found")
      }
      res.json(AllTimeSheet)
    }
    
  
  
      //GET SINGLE DeleteProjects
  //METHOD:DELETE
  const deleteTimeSheet = async (req, res) => {
      let deleteTimeSheetID = req.params.id
      if (deleteTimeSheet) {
        const deleteTimeSheet = await TimeSheet.findByIdAndDelete(deleteTimeSheetID, req.body);
        res.status(200).json("Delete TimeSheet Successfully")
      } else {
        res.status(400).json({ message: "Not Delete TimeSheet" })
      }
    }
    
  
    //GET SINGLE ProjectsUpdate
  //METHOD:PUT
  const UpdateTimeSheet = async (req, res) => {
    try {
      const allowedFields = [
        'date',
        'worker',
        'project',
        'hoursWorked',
        'Overtime',
        'status'
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
  
      const updatedTimeSheet = await TimeSheet.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
  
      if (!updatedTimeSheet) {
        return res.status(404).json({ message: 'Timesheet not found' });
      }
  
      res.status(200).json(updatedTimeSheet);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  
  
  //METHOD:Single
  //TYPE:PUBLIC
  const SingleTimeSheet=async(req,res)=>{
      try {
          const SingleTimeSheet= await TimeSheet.findById(req.params.id);
          res.status(200).json(SingleTimeSheet)
      } catch (error) {
          res.status(404).json({msg:"Can t Find Projects"} )
      }
  }
  


  module.exports = {TimeSheetCreate,AllTimeSheet,deleteTimeSheet,UpdateTimeSheet,SingleTimeSheet};