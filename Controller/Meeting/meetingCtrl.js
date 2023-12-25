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
      // get value of CreatedBy
      //   COMMON.setModelCreatedByFieldValue(req);

      const createdMeeting = await Meeting.create(req.body, {
        fields: inputFieldsMeeting,
      });

      if (createdMeeting) {
        //send mail to related person.
        res.status(200).json({
          message: "Your meeting has been created successfully.",
        });
      } else {
        res.status(400).json({
          message:
            "Sorry, Your meeting has not created, Please try again later.",
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
