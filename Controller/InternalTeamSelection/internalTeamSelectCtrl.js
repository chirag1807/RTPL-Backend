const validator = require("validator");
const SendEmailService = require("../../Middleware/emaiService");
const COMMON = require("../../Common/common");
const { createAccessToken } = require("../../Middleware/auth");
const nodemailer = require("nodemailer");
const CONSTANT = require("../../constant/constant");

const inputFieldsInternalTeamSelect = [
    "meetingID",
    "empId",
    "status",
    "DeclineReason",
];

module.exports.getInternalMembersByMeetingID = async (req, res) => {
    try {
        const { InternalTeamSelection } = req.app.locals.models;
        if(req.params){
            const { meetingID } = req.params;
            const internalMemebers = await InternalTeamSelection.findOne({
                where: { meetingID },
            });
        
            if (internalMemebers) {
              res.status(200).json({
                message: "Internal Members Fetched Successfully.",
                internalMembers: internalMemebers,
              });
            } else {
              res.status(400).json({
                message: "Internal Members Can't be Fetched, Please Try Again Later.",
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

module.exports.updateInternalMember = async (req, res) => {
    try {
        const { InternalTeamSelection } = req.app.locals.models;
        // get value of updatedBy
        // COMMON.setModelUpdatedByFieldValue(req);
        if(req.body){

            const updateMember = await InternalTeamSelection.findOne({
                where: {
                    meetingID: req.body.meetingID,
                    empId: req.body.empId,
                },
            });

            if (!updateMember) {
                return res.status(404).json({ error: 'Internal member not found for the given ID' });
            }

            const updatedMember = await updateMember.update(req.body, {
                fields: inputFieldsInternalTeamSelect,
            });

            if(updatedMember){
                res.status(200).json({message: "Internal Member has been Updated Successfully."});
            }
            else{
                res.status(400).json({message: "Internal Member has not been Updated, Please Try Again Later."});
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

module.exports.deleteInternalMember = async (req, res) => {
    try {
        const { InternalTeamSelection } = req.app.locals.models;
        // get value of deletedBy
        // COMMON.setModelDeletedByFieldValue(req);
        if(req.body){

            const internalMember = await InternalTeamSelection.findOne({
                where: {
                    meetingID: req.body.meetingID,
                    empId: req.body.empId,
                },
            });

            if (!internalMember) {
                return res.status(404).json({ error: 'Internal member not found for the given ID' });
            }

            const deletedInternalMember = await internalMember.destroy();

            if(deletedInternalMember){
                res.status(200).json({message: "Internal member has been Deleted Successfully."});
            }
            else{
                res.status(400).json({message: "Internal member has not been Deleted, Please Try Again Later."});
            }
        }   
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}