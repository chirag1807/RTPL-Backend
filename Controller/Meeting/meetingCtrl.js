const validator = require("validator");
const SendEmailService = require("../../Middleware/emaiService");
const COMMON = require("../../Common/common");
const { createAccessToken } = require("../../Middleware/auth");
const nodemailer = require("nodemailer");
const CONSTANT = require("../../constant/constant");

const inputFieldsMeeting = [
  "empId",
  "officeID",
  "requestID",
  "appointmentMeetingID",
  "outerMeetingID",
  "meetingTypeID",
  "meetingModeID",
  "conferenceRoomID",
  "rescConferenceRoomID",
  "MeetingPurpose",
  "meetingDate",
  "meetingStartTime",
  "meetingEndTime",
  "rescMeetingDate",
  "rescMeetingStartTime",
  "rescMeetingEndTime",
  "createdBy",
];

module.exports.createMeeting = async (req, res) => {
  try {
    const { Meeting } = req.app.locals.models;
    if (req.body) {
      // Set value of createdBy, startedAt, stoppedAt, etc.
      // COMMON.setModelCreatedByFieldValue(req);
      // Set other necessary fields

      const createdMeeting = await Meeting.create(req.body, {
        fields: inputFieldsMeeting,
      });

      if (createdMeeting) {
        // Send mail to related person.
        res.status(200).json({
          message: "Your meeting has been created successfully.",
        });
      } else {
        res.status(400).json({
          message: "Sorry, Your meeting has not been created. Please try again later.",
        });
      }
    } else {
      console.log("Invalid parameter");
      res.status(400).json({ error: "Invalid parameter" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.startMeeting = async (req, res) => {
  try {
    const { Meeting, InternalTeamSelect } = req.app.locals.models;
    const { meetingID, requestID, meetingStartTime, meetingEndTime, empIds } = req.body;

    if (!meetingID || !requestID || !meetingStartTime || !meetingEndTime || !empIds || !Array.isArray(empIds) || empIds.length === 0) {
      return res.status(400).json({ error: 'meetingID, requestID, meetingStartTime, meetingEndTime, and non-empty empIds array are required.' });
    }

    const existingMeeting = await Meeting.findByPk(meetingID);

    if (!existingMeeting) {
      return res.status(404).json({ error: 'Meeting not found.' });
    }

    existingMeeting.meetingStartTime = meetingStartTime;
    existingMeeting.meetingEndTime = meetingEndTime;
    existingMeeting.requestID = requestID;

    existingMeeting.isActive = true;

    await existingMeeting.save();

    await Promise.all(empIds.map(async (empId) => {
      await InternalTeamSelect.update(
        { status: 'Accepted' },
        { where: { meetingID, empId } }
      );
    }));

    return res.status(200).json({ message: 'Meeting started successfully.', meeting: existingMeeting });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports.rescheduleMeeting = async (req, res) => {
  try {
    const { Meeting } = req.app.locals.models;
    const { meetingID, rescConferenceRoomId, rescMeetingDate, rescMeetingStartTime, rescMeetingEndTime } = req.body;

    if (!meetingID || !rescMeetingDate || !rescMeetingTime) {
      return res.status(400).json({ error: 'Meeting ID, rescMeetingDate, and rescMeetingTime are required in the request body' });
    }

    const meeting = await Meeting.findByPk(meetingID);

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found for the given ID' });
    }

    meeting.rescMeetingDate = rescMeetingDate;
    meeting.rescMeetingStartTime = rescMeetingStartTime;
    meeting.rescConferenceRoomID = rescConferenceRoomId;
    meeting.rescMeetingEndTime = rescMeetingEndTime

    meeting.isReschedule = true;

    await meeting.save();

    res.status(200).json({ message: 'Meeting has been rescheduled successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports.endMeeting = async (req, res) => {
  try {
    const { Meeting } = req.app.locals.models;
    const { meetingID } = req.body;

    if (!meetingID) {
      return res.status(400).json({ error: 'Meeting ID is required in the request body' });
    }

    const meeting = await Meeting.findByPk(meetingID);

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found for the given ID' });
    }

    meeting.stoppedAt = new Date();
    meeting.isActive = false;

    await meeting.save();

    res.status(200).json({ message: 'Meeting has ended successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports.getListOfCreatedMeeting = async (req, res) => {
  try {
    const {
      Meeting,
      Employee,
      Office,
      RequestMeeting,
      AppointmentMeeting,
      OuterMeeting,
      MeetingType,
      MeetingMode,
      ConferenceRoom,
    } = req.app.locals.models;

    const createdMeetings = await Meeting.findAll({
      include: [
        { model: Employee, as: "employee" },
        { model: Office, as: "office" },
        { model: RequestMeeting, as: "requestMeeting" },
        { model: AppointmentMeeting, as: "appointmentMeeting" },
        { model: OuterMeeting, as: "outerMeeting" },
        { model: MeetingType, as: "meetingType" },
        { model: MeetingMode, as: "meetingMode" },
        { model: ConferenceRoom, as: "conferenceRoom" },
      ],
    });

    if (createdMeetings) {
      res.status(200).json({
        message: "Created Meetings Fetched Successfully.",
        meetings: createdMeetings,
      });
    } else {
      res.status(400).json({
        message: "Created Meetings Can't be Fetched.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getCreatedMeetingByID = async (req, res) => {
  try {
    const {
      Meeting,
      Employee,
      Office,
      RequestMeeting,
      AppointmentMeeting,
      OuterMeeting,
      MeetingType,
      MeetingMode,
      ConferenceRoom,
    } = req.app.locals.models;

    if (req.params) {
      const { meetingID } = req.params;

      const createdMeetingDetails = await Meeting.findOne({
        where: { meetingID },
        include: [
          { model: Employee, as: "employee" },
          { model: Office, as: "office" },
          { model: RequestMeeting, as: "requestMeeting" },
          { model: AppointmentMeeting, as: "appointmentMeeting" },
          { model: OuterMeeting, as: "outerMeeting" },
          { model: MeetingType, as: "meetingType" },
          { model: MeetingMode, as: "meetingMode" },
          { model: ConferenceRoom, as: "conferenceRoom" },
        ],
      });

      if (createdMeetingDetails) {
        res.status(200).json({
          message: "Created Meeting Fetched Successfully.",
          meeting: createdMeetingDetails,
        });
      } else {
        res.status(400).json({
          message: "Created Meeting Can't be Fetched, Please Try Again Later.",
        });
      }
    } else {
      console.log("Invalid perameter");
      res.status(400).json({ error: "Invalid perameter" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
