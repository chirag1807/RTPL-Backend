const validator = require('validator');
const COMMON = require('../../Common/common');
const {createAccessToken} = require('../../Middleware/auth');
const CONSTANT = require('../../constant/constant');

const inputFieldsMeetingType = [
    "meetingType",
    "isActive",
    "isDeleted",
    "createdBy",
    "updatedBy",
    "deletedBy",
];

module.exports.addMeetingType = async (req, res) => {
    try {
        const { MeetingType } = req.app.locals.models;
        // get value of CreatedBy 
        // COMMON.setModelCreatedByFieldValue(req);
        // check createdBy is admin or not (means put this condition in below if condition.)
        if(req.body){
            const meetingType = await MeetingType.create(req.body, {
                fields: inputFieldsMeetingType,
              });
              if (meetingType) {
                res.status(200).json({
                  message: "Your meeting type has been registered successfully.",
                });
              } else {
                res.status(400).json({
                  message:
                    "Sorry, Your meeting type has not registered. Please try again later",
                });
              }
        }
        else{
            console.log("Invalid perameter");
            res.status(400).json({ error: "Invalid perameter" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports.getMeetingTypes = async (req, res) => {
    try {
        const { MeetingType } = req.app.locals.models;

    const meetingTypes = await MeetingType.findAll({});

    if (meetingTypes) {
      res.status(200).json({
        message: "Meeting Types Fetched Successfully.",
        meetings: meetingTypes,
      });
    } else {
      res.status(400).json({
        message: "Meeting Types Can't be Fetched, Please Try Again Later.",
      });
    }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports.getMeetingTypeByID = async (req, res) => {
    try {
        const { MeetingType } = req.app.locals.models;
        if(req.params){
            const { meetingTypeID } = req.params;
            const meetingType = await MeetingType.findOne({
                where: { meetingTypeID },
            });
        
            if (meetingType) {
              res.status(200).json({
                message: "Meeting Type Fetched Successfully.",
                meeting: meetingType,
              });
            } else {
              res.status(400).json({
                message: "Meeting Type Can't be Fetched, Please Try Again Later.",
              });
            }
        }
        else{
            console.log("Invalid perameter");
            res.status(400).json({ error: "Invalid perameter" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports.updateMeetingType = async (req, res) => {
    try {
        const { MeetingType } = req.app.locals.models;
        // get value of updatedBy
        // COMMON.setModelUpdatedByFieldValue(req);
        if(req.params && req.body){
            const { meetingTypeID } = req.params;

            const meetingType = await MeetingType.findByPk(meetingTypeID);

            if (!meetingType) {
                return res.status(404).json({ error: 'MeetingType not found for the given ID' });
            }

            const updatedMeetingType = await meetingType.update(req.body, {
                fields: inputFieldsMeetingType,
            });

            if(updatedMeetingType){
                res.status(200).json({message: "Meeting Type has been Updated Successfully."});
            }
            else{
                res.status(400).json({message: "Meeting Type has not been Updated, Please Try Again Later."});
            }
        }
        else{
            console.log("Invalid perameter");
            res.status(400).json({ error: "Invalid perameter" });
        }   
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports.deleteMeetingType = async (req, res) => {
    try {
        const { MeetingType } = req.app.locals.models;
        // get value of deletedBy
        // COMMON.setModelDeletedByFieldValue(req);
        if(req.params){
            const { meetingTypeID } = req.params;

            const meetingType = await MeetingType.findByPk(meetingTypeID);

            if (!meetingType) {
                return res.status(404).json({ error: 'MeetingType not found for the given ID' });
            }

            const deletedMeetingType = await meetingType.destroy();

            if(deletedMeetingType){
                res.status(200).json({message: "Meeting Type has been Deleted Successfully."});
            }
            else{
                res.status(400).json({message: "Meeting Type has not been Deleted, Please Try Again Later."});
            }
        }
        else{
            console.log("Invalid perameter");
            res.status(400).json({ error: "Invalid perameter" });
        } 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}