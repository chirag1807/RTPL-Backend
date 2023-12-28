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
        const { InternalTeamSelect } = req.app.locals.models;
        if (req.params) {
            const { meetingID } = req.params;
            const internalMemebers = await InternalTeamSelect.findOne({
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
        else {
            console.log("Invalid perameter");
            res.status(400).json({ error: "Invalid perameter" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

// notification for internal team memeber
module.exports.getMeetingsForInternalTeam = async (req, res) => {
    try {
        const { Meeting, InternalTeamSelect } = req.app.locals.models;
        const { empId } = req.params;

        const meetingsForEmployee = await InternalTeamSelect.findAll({
            where: { empId },
            include: [
                {
                    model: Meeting,
                    as: 'meeting',
                },
            ],
        });

        if (!meetingsForEmployee || meetingsForEmployee.length === 0) {
            return res.status(404).json({ message: 'No meetings found for the provided employee.' });
        }

        res.status(200).json({ meetingsForEmployee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

//update (accept or reject meeting)
module.exports.updateInternalMember = async (req, res) => {
    try {
        const { InternalTeamSelect } = req.app.locals.models;
        // get value of updatedBy
        // COMMON.setModelUpdatedByFieldValue(req);
        if (req.body) {

            const updateMember = await InternalTeamSelect.findOne({
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

            if (updatedMember) {
                res.status(200).json({ message: "Internal Member has been Updated Successfully." });
            }
            else {
                res.status(400).json({ message: "Internal Member has not been Updated, Please Try Again Later." });
            }
        }
        else {
            console.log("Invalid perameter");
            res.status(400).json({ error: "Invalid perameter" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

module.exports.deleteInternalMember = async (req, res) => {
    try {
        const { InternalTeamSelect } = req.app.locals.models;
        // get value of deletedBy
        // COMMON.setModelDeletedByFieldValue(req);
        if (req.body) {

            const internalMember = await InternalTeamSelect.findOne({
                where: {
                    meetingID: req.body.meetingID,
                    empId: req.body.empId,
                },
            });

            if (!internalMember) {
                return res.status(404).json({ error: 'Internal member not found for the given ID' });
            }

            const deletedInternalMember = await internalMember.destroy();

            if (deletedInternalMember) {
                res.status(200).json({ message: "Internal member has been Deleted Successfully." });
            }
            else {
                res.status(400).json({ message: "Internal member has not been Deleted, Please Try Again Later." });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}