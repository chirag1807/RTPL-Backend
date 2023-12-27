const validator = require("validator");
const SendEmailService = require("../../Middleware/emaiService");
const COMMON = require("../../Common/common");
const { createAccessToken } = require("../../Middleware/auth");
const nodemailer = require("nodemailer");
const CONSTANT = require("../../constant/constant");

module.exports.addInternalTeam = async (req, res) => {
    try {
        const { Meeting, Employee } = req.app.locals.models;
        const { meetingID, empId } = req.body;

        if (!meetingID || !empId) {
            return res.status(400).json({ error: 'MeetingID and EmpID are required.' });
        }

        const existingMeeting = await Meeting.findOne({ where: { meetingID } });
        const existingEmployee = await Employee.findOne({ where: { empID: empId } });

        if (!existingMeeting || !existingEmployee) {
            return res.status(404).json({ error: 'Meeting or Employee not found.' });
        }

        const createdInternalTeamSelect = await InternalTeamSelect.create({
            meetingID,
            empId,
        });

        if (createdInternalTeamSelect) {
            return res.status(201).json({
                message: 'Internal team selection data added successfully.',
                data: createdInternalTeamSelect,
            });
        } else {
            return res.status(400).json({
                message: 'Failed to add internal team selection data. Please try again later.',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports.updateInternalTeam = async (req, res) => {
    try {
        const { InternalTeamSelect } = req.app.locals.models;
        const { internalTeamSelectID, status, DeclineReason } = req.body;

        const existingInternalTeamSelect = await InternalTeamSelect.findByPk(internalTeamSelectID);

        if (!existingInternalTeamSelect) {
            return res.status(404).json({ error: 'Internal team select entry not found.' });
        }

        await existingInternalTeamSelect.update({
            status: status || existingInternalTeamSelect.status,
            DeclineReason: DeclineReason || existingInternalTeamSelect.DeclineReason,
        });

        return res.status(200).json({ message: 'Internal team select entry updated successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports.deleteInternalTeam = async (req, res) => {
    try {
        const { InternalTeamSelect } = req.app.locals.models;
        const { internalTeamSelectID } = req.params;

        const existingInternalTeamSelect = await InternalTeamSelect.findByPk(internalTeamSelectID);

        if (!existingInternalTeamSelect) {
            return res.status(404).json({ error: 'Internal team select entry not found.' });
        }

        await existingInternalTeamSelect.destroy();

        return res.status(200).json({ message: 'Internal team select entry deleted successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports.getInternalTeam = async (req, res) => {
    try {
        const { InternalTeamSelect, Employee } = req.app.locals.models;
        const { internalTeamSelectID } = req.params;

        const internalTeamSelect = await InternalTeamSelect.findByPk(internalTeamSelectID, {
            include: [
                {
                    model: Employee,
                    attributes: ['empID', 'firstName', 'lastName', 'email', 'phone'], // Define the employee attributes you want to retrieve
                    as: 'employeeDetails', // Alias for the joined Employee model
                },
            ],
        });

        if (!internalTeamSelect) {
            return res.status(404).json({ error: 'Internal team select entry not found.' });
        }

        return res.status(200).json({ data: internalTeamSelect });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};