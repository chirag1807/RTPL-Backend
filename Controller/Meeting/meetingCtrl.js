const sendMail = require("../../Middleware/emaiService");
const ErrorHandler = require("../../utils/errorhandler");
const cloudinary = require('../../utils/cloudinary');


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

const inputFieldOuterMeeting = [
  "companyName",
  "clientName",
  "clientDesignation",
  "clientContact",
  "clientVenue",
];

const inputFieldsInternalMembers = ["empId", "meetingID"];

//global method to convert file into uri
const uploadAndCreateDocument = async (file) => {
  try {

    const result = await cloudinary.uploader.upload(file[0].path, {
      resource_type: 'auto',
      folder: 'RTPL_DOCS',
    });

    return result.secure_url;
  } catch (error) {
    console.log(error);
    throw new ErrorHandler("Unable to upload to Cloudinary", 400);
  }
};

module.exports.createRequestMeeting = async (req, res) => {
  try {
    const { Meeting, InternalTeamSelect, Employee } = req.app.locals.models;
    const updatedBy = req.decodedEmpCode;
    // console.log(updatedBy);
    if (req.body) {
      // COMMON.setModelCreatedByFieldValue(req);
      // Set other necessary fields
      req.body.createdBy = updatedBy;
      const createdMeeting = await Meeting.create(req.body, {
        fields: inputFieldsMeeting,
      });

      if (createdMeeting) {
        const updatedList = req.body.internalMembers.map((internalMember) => ({
          ...internalMember,
          meetingID: createdMeeting.meetingID,
        }));

        await Promise.all(
          updatedList.map(async (internalMember) => {
            await InternalTeamSelect.create(internalMember, {
              fields: inputFieldsInternalMembers,
            });
          })
        );

        const internalMembers = req.body.internalMembers;

        const internalMemberIds = internalMembers.map((member) => member.empId);

        const internalTeamEmails = await Employee.findAll({
          attributes: ['email'],
          where: {
            empId: internalMemberIds,
          },
          raw: true,
        });

        const emailPromises = internalTeamEmails.map(async (member) => {
          const mailSubject = 'Meeting Created';
          const mailMessage = 'A new meeting has been created.';

          await sendMail(member.email, "rtpl@rtplgroup.com", mailSubject, mailMessage);
        });

        await Promise.all(emailPromises);

        res.status(200).json({
          message: "Your visitor meeting has been created successfully.",
        });
      } else {
        res.status(400).json({
          message:
            "Sorry, Your visitor meeting has not been created. Please try again later.",
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

module.exports.createOuterMeeting = async (req, res) => {
  try {
    const { Meeting, InternalTeamSelect, OuterMeeting, Employee } = req.app.locals.models;
    const updatedBy = req.decodedEmpCode;
    if (req.body) {
      // COMMON.setModelCreatedByFieldValue(req);
      // Set other necessary fields

      const createOuterMeeting = await OuterMeeting.create(
        req.body.clientDetails,
        {
          fields: inputFieldOuterMeeting,
        }
      );

      if (createOuterMeeting) {
        req.body.createdBy = updatedBy;
        const createdMeeting = await Meeting.create(req.body, {
          fields: inputFieldsMeeting,
        });

        if (createdMeeting) {
          createdMeeting.outerMeetingID = createOuterMeeting.outerMeetingID;
          await createdMeeting.save();

          if (req.body.internalMembers) {
            const updatedList = req.body.internalMembers.map((internalMember) => ({
              ...internalMember,
              meetingID: createdMeeting.meetingID,
            }));

            await Promise.all(
              updatedList.map(async (internalMember) => {
                await InternalTeamSelect.create(internalMember, {
                  fields: inputFieldsInternalMembers,
                });
              })
            );

            const internalMembers = req.body.internalMembers;

            const internalMemberIds = internalMembers.map((member) => member.empId);

            const internalTeamEmails = await Employee.findAll({
              attributes: ['email'],
              where: {
                empId: internalMemberIds,
              },
              raw: true,
            });

            const emailPromises = internalTeamEmails.map(async (member) => {
              const mailSubject = 'Meeting Created';
              const mailMessage = 'A new meeting has been created.';

              await sendMail(member.email, "rtpl@rtplgroup.com", mailSubject, mailMessage);
            });

            await Promise.all(emailPromises);
          }

          res.status(200).json({
            message: "Your outer meeting has been created successfully.",
          });
        } else {
          res.status(400).json({
            message:
              "Sorry, Your outer meeting has not been created. Please try again later.",
          });
        }
      }
      else {
        res.status(400).json({
          message:
            "Sorry, Your outer meeting has not been created. Please try again later.",
        });
      }
    }
    else {
      console.log("Invalid parameter");
      res.status(400).json({ error: "Invalid parameter" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.updateOuterMeetingStatus = async (req, res) => {
  try {
    const { OuterMeeting } = req.app.locals.models;
    if (req.params && req.body) {
      const { outerMeetingID } = req.params;
      const { status, DeclineReason } = req.body;
      // get value of updatedBy
      // COMMON.setModelUpdatedByFieldValue(req);

      const outerMeeting = await OuterMeeting.findOne({
        where: { outerMeetingID },
      });

      if (!outerMeeting) {
        return res.status(404).json({
          error: "Outer Meeting not found for the given Outer Meeting ID.",
        });
      }

      const updatedOuterMeeting = await outerMeeting.update({
        status,
        DeclineReason: status === "Rejected" ? DeclineReason : null,
      });

      if (updatedOuterMeeting) {
        res
          .status(200)
          .json({
            message: "Status Updated successfully",
            updatedOuterMeeting,
          });
      } else {
        res.status(400).json({
          message: "Status Can't be Updated, Please Try Again Later.",
          updatedOuterMeeting,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.createAppointmentMeeting = async (req, res) => {
  try {
    const { Meeting, InternalTeamSelect, AppointmentMeeting, Employee } = req.app.locals.models;
    const updatedBy = req.decodedEmpCode;
    if (req.body) {
      // COMMON.setModelCreatedByFieldValue(req);
      // Set other necessary fields

      const createAppointmentMeeting = await AppointmentMeeting.create(
        req.body.appointeeDetails
      );

      if (createAppointmentMeeting) {
        req.body.createdBy = updatedBy;
        const createdMeeting = await Meeting.create(req.body, {
          fields: inputFieldsMeeting,
        });

        if (createdMeeting) {
          createdMeeting.appointmentMeetingID =
            createAppointmentMeeting.appointmentMeetingID;
          await createdMeeting.save();

          if (req.body.internalMembers) {
            const updatedList = req.body.internalMembers.map((internalMember) => ({
              ...internalMember,
              meetingID: createdMeeting.meetingID,
            }));

            await Promise.all(
              updatedList.map(async (internalMember) => {
                await InternalTeamSelect.create(internalMember, {
                  fields: inputFieldsInternalMembers,
                });
              })
            );

            const internalMembers = req.body.internalMembers;

            const internalMemberIds = internalMembers.map((member) => member.empId);

            const internalTeamEmails = await Employee.findAll({
              attributes: ['email'],
              where: {
                empId: internalMemberIds,
              },
              raw: true,
            });

            const emailPromises = internalTeamEmails.map(async (member) => {
              const mailSubject = 'Meeting Created';
              const mailMessage = 'A new meeting has been created.';

              await sendMail(member.email, "rtpl@rtplgroup.com", mailSubject, mailMessage);
            });

            await Promise.all(emailPromises);
          }

          res.status(200).json({
            message: "Your appointment meeting has been created successfully.",
          });
        } else {
          res.status(400).json({
            message:
              "Sorry, Your appointment meeting has not been created. Please try again later.",
          });
        }
      }
      else {
        res.status(400).json({
          message:
            "Sorry, Your appointment meeting has not been created. Please try again later.",
        });
      }
    }
    else {
      console.log("Invalid parameter");
      res.status(400).json({ error: "Invalid parameter" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.updateAppointmentMeetingStatus = async (req, res) => {
  try {
    const { AppointmentMeeting } = req.app.locals.models;
    if (req.params && req.body) {
      const { appointmentMeetingID } = req.params;
      const { status, DeclineReason } = req.body;
      // get value of updatedBy
      // COMMON.setModelUpdatedByFieldValue(req);

      const appointmentMeeting = await AppointmentMeeting.findOne({
        where: { appointmentMeetingID },
      });

      if (!appointmentMeeting) {
        return res.status(404).json({
          error:
            "Appointment Meeting not found for the given Outer Meeting ID.",
        });
      }

      const updatedAppointmentMeeting = await appointmentMeeting.update({
        status,
        DeclineReason: status === "Rejected" ? DeclineReason : null,
      });

      if (updatedAppointmentMeeting) {
        res
          .status(200)
          .json({
            message: "Status Updated successfully",
            updatedAppointmentMeeting,
          });
      } else {
        res.status(400).json({
          message: "Status Can't be Updated, Please Try Again Later.",
          updatedAppointmentMeeting,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.startMeeting = async (req, res) => {
  try {
    const { Meeting, InternalTeamSelect } = req.app.locals.models;
    const { meetingID, empIds } = req.body;

    if (
      !meetingID ||
      !empIds ||
      !Array.isArray(empIds) ||
      empIds.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "meetingID and non-empty empIds array are required." });
    }

    const existingMeeting = await Meeting.findByPk(meetingID);

    if (!existingMeeting) {
      return res.status(404).json({ error: "Meeting not found." });
    }

    existingMeeting.startedAt = new Date();
    existingMeeting.isActive = true;

    await existingMeeting.save();

    await Promise.all(
      empIds.map(async (empId) => {
        await InternalTeamSelect.update(
          { status: "Accepted" },
          { where: { meetingID, empId } }
        );
      })
    );

    return res.status(200).json({
      message: "Meeting started successfully.",
      meeting: existingMeeting,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports.rescheduleMeeting = async (req, res) => {
  try {
    const { Meeting } = req.app.locals.models;
    const updatedBy = req.decodedEmpCode;
    const {
      meetingID,
      rescConferenceRoomId,
      rescMeetingDate,
      rescMeetingStartTime,
      rescMeetingEndTime,
    } = req.body;

    if (
      !meetingID ||
      !rescMeetingDate ||
      !rescMeetingStartTime ||
      !rescMeetingEndTime
    ) {
      return res.status(400).json({
        error:
          "Meeting ID, rescMeetingDate, and rescMeetingTimes are required in the request body",
      });
    }

    const meeting = await Meeting.findByPk(meetingID);

    if (!meeting) {
      return res
        .status(404)
        .json({ error: "Meeting not found for the given ID" });
    }

    meeting.rescMeetingDate = rescMeetingDate;
    meeting.updatedBy = updatedBy;
    meeting.rescMeetingStartTime = rescMeetingStartTime;
    meeting.rescConferenceRoomID = rescConferenceRoomId;
    meeting.rescMeetingEndTime = rescMeetingEndTime;

    meeting.isReschedule = true;

    await meeting.save();

    res
      .status(200)
      .json({ message: "Meeting has been rescheduled successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.endMeeting = async (req, res) => {
  try {
    const { Meeting } = req.app.locals.models;
    const { meetingID, remark } = req.body;
    const updatedBy = req.decodedEmpCode;

    const meetingDocUrl = await uploadAndCreateDocument(req.file);

    if (!meetingID) {
      return res
        .status(400)
        .json({ error: "Meeting ID is required in the request body" });
    }

    const meeting = await Meeting.findByPk(meetingID);

    if (!meeting) {
      return res
        .status(404)
        .json({ error: "Meeting not found for the given ID" });
    }

    meeting.stoppedAt = new Date();
    meeting.isActive = false;
    meeting.remark = remark;

    meeting.meetingDoc = meetingDocUrl;

    meeting.deletedBy = updatedBy;

    await meeting.save();

    res.status(200).json({ message: "Meeting has ended successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//notification of all created Meetings
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
      InternalTeamSelect
    } = req.app.locals.models;

    let { page, pageSize, sort, sortBy, searchField, isActive } = req.query;

    page = Math.max(1, parseInt(page, 10)) || 1;
    pageSize = Math.max(1, parseInt(pageSize, 10)) || 10;

    const offset = (page - 1) * pageSize;

    sort = sort ? sort.toUpperCase() : "ASC";

    const queryOptions = {
      limit: pageSize,
      offset: offset,
      include: [],
    };

    if (sortBy) {
      queryOptions.order = [[sortBy, sort]];
    }

    if (
      searchField &&
      typeof searchField === "string" &&
      searchField.trim() !== ""
    ) {
      queryOptions.where = {
        [Op.or]: [{ meetingType: { [Op.like]: `%${searchField}%` } }],
      };
    }

    queryOptions.include.push(
      { model: Employee, as: "employee" },
      { model: Office, as: "office" },
      { model: RequestMeeting, as: "requestMeeting" },
      { model: AppointmentMeeting, as: "appointmentMeeting" },
      { model: OuterMeeting, as: "outerMeeting" },
      { model: MeetingType, as: "meetingType" },
      { model: MeetingMode, as: "meetingMode" },
      { model: ConferenceRoom, as: "conferenceRoom" },
      {
        model: InternalTeamSelect, as: 'internalTeamSelect',
        include: [
          {
            model: Employee,
            as: 'employee'
          },
        ],
      }
    );

    queryOptions.where = {
      ...queryOptions.where,
      isActive: isActive ? isActive : false,
    };

    const createdMeetings = await Meeting.findAll(queryOptions);

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
    res.status(500).json({ error: error.message });
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
      InternalTeamSelect,
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
          { model: InternalTeamSelect, as: 'internalTeamSelect' }
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
    res.status(500).json({ error: error.message });
  }
};

module.exports.getMeetingTimesByConferenceRoom = async (req, res) => {
  try {
    const { Meeting } = req.app.locals.models;
    const { conferenceRoomID } = req.params;
    const { meetingDate } = req.query;

    const whereClause = {
      conferenceRoomID,
      meetingDate: meetingDate ? meetingDate : new Date(),
    };

    console.log(whereClause);

    const meetings = await Meeting.findAll({
      where: whereClause,
      attributes: ["meetingStartTime", "meetingEndTime"],
    });

    if (!meetings || meetings.length === 0) {
      return res
        .status(404)
        .json({ message: "No meetings found for the provided details." });
    }

    res.status(200).json({ meetings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
