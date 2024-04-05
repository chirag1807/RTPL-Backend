const sendMail = require("../../Middleware/emaiService");
const ErrorHandler = require("../../utils/errorhandler");
const cloudinary = require("../../utils/cloudinary");
const fs = require("fs");
const { Op } = require("sequelize");
const TimeSlot = require("../../models/timeSlot");
const Meeting = require("../../models/meeting");

// Define the initial time slots
const initialTimeSlots = [
  { meetingStartTime: "9:00", meetingEndTime: "9:30" }, { meetingStartTime: "9:30", meetingEndTime: "10:00" },
  { meetingStartTime: "10:00", meetingEndTime: "10:30" }, { meetingStartTime: "10:30", meetingEndTime: "11:00" },
  { meetingStartTime: "11:00", meetingEndTime: "11:30" }, { meetingStartTime: "11:30", meetingEndTime: "12:00" },
  { meetingStartTime: "12:00", meetingEndTime: "12:30" }, { meetingStartTime: "12:30", meetingEndTime: "1:00" },
  { meetingStartTime: "1:00", meetingEndTime: "1:30" }, { meetingStartTime: "1:30", meetingEndTime: "2:00" },
  { meetingStartTime: "2:00", meetingEndTime: "2:30" }, { meetingStartTime: "2:30", meetingEndTime: "3:00" },
  { meetingStartTime: "3:00", meetingEndTime: "3:30" }, { meetingStartTime: "3:30", meetingEndTime: "4:00" },
  { meetingStartTime: "4:00", meetingEndTime: "4:30" }, { meetingStartTime: "4:30", meetingEndTime: "5:00" },
  { meetingStartTime: "5:00", meetingEndTime: "5:30" }, { meetingStartTime: "5:30", meetingEndTime: "6:00" },
  { meetingStartTime: "6:00", meetingEndTime: "6:30" }, { meetingStartTime: "6:30", meetingEndTime: "7:00" },
  { meetingStartTime: "7:00", meetingEndTime: "7:30" }, { meetingStartTime: "7:30", meetingEndTime: "8:00" },
  { meetingStartTime: "8:00", meetingEndTime: "8:30" }, { meetingStartTime: "8:30", meetingEndTime: "9:00" }
];

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
  "time",
  "meetingEndTime",
  "meetingLink",
  "rescMeetingDate",
  "rescMeetingStartTime",
  "rescMeetingEndTime",
  "createdBy",
  "status",
  "meetingTime",
];

const inputFieldOuterMeeting = [
  "companyName",
  "clientName",
  "clientDesignation",
  "clientContact",
  "clientVenue",
];

const inputFieldsInternalMembers = ["empId", "meetingID"];

const inputFieldTimeSlot = ["meetingID", "meetingStartTime", "meetingEndTime"];
module.exports.avabletimeslot = async (req, res) => {
  try {
    const { meetingDate } = req.params;
    const arrayData = [];

    // Find available time slots
    const avabletimeslots = await Meeting.findAll({
      where: {
        meetingDate
      }
    });
    if (avabletimeslots.length !== 0) {
      // Extract the time slots from the avabletimeslots array
      avabletimeslots.forEach(avabletimeslot => {
        if (Array.isArray(avabletimeslot.meetingTime)) {
          avabletimeslot.meetingTime.forEach(meetingTime => {
            arrayData.push({
              meetingStartTime: meetingTime ? meetingTime.meetingStartTime : null,
              meetingEndTime: meetingTime ? meetingTime.meetingEndTime : null
            });
          });
        } else {
          arrayData.push({
            meetingStartTime: avabletimeslot.meetingTime ? avabletimeslot.meetingTime.meetingStartTime : null,
            meetingEndTime: avabletimeslot.meetingTime ? avabletimeslot.meetingTime.meetingEndTime : null
          });
        }
      });

      // Custom function to check if a time slot overlaps with any slot in arrayData
const overlapsWithArrayData = (slot) => {
  return arrayData.some(dataSlot => {
    return slot.meetingStartTime === dataSlot.meetingStartTime &&
           slot.meetingEndTime === dataSlot.meetingEndTime;
  });
};

// Filter initialTimeSlots to exclude slots overlapping with arrayData
    const updatedTimeSlots = initialTimeSlots.filter(slot => !overlapsWithArrayData(slot));
      // Send response
      res.status(200).json({
        response_type: "SUCCESS",
        data: {"finalTimeSlots" :  updatedTimeSlots},
        message: "Available Time Slots."
      });
    } else {
      res.status(200).json({
        response_type: "SUCCESS",
        data: {"finalTimeSlots" :  initialTimeSlots},
        message: "No available time slots found."
      });
    }
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    res.status(500).json({
      response_type: "ERROR",
      message: "An error occurred while processing your request."
    });
  }
};

module.exports.createRequestMeeting = async (req, res) => {
  try {
    const { Meeting, InternalTeamSelect, Employee} = req.app.locals.models;
    const updatedBy = req.decodedEmpCode;
    if (req.body) {
      req.body.createdBy = updatedBy;
      req.body.empId = req.decodedEmpId;
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
          attributes: ["email"],
          where: {
            empId: internalMemberIds,
          },
          raw: true,
        });

        const emailPromises = internalTeamEmails.map(async (member) => {
          const mailSubject = "Meeting Created";
          const mailMessage = "A new meeting has been created.";

          await sendMail(
            member.email,
            "rtpl@rtplgroup.com",
            mailSubject,
            mailMessage
          );
        });

        await Promise.all(emailPromises);

        res.status(200).json({
          response_type: "SUCCESS",
          data: {},
          message: "Your visitor meeting has been created successfully.",
        });
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message:
            "Sorry, Your visitor meeting has not been created. Please try again later.",
        });
      }
    } else {
      console.log("Invalid parameter");
      res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "Invalid parameter",
      });
    }
  } catch (error) {
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};

module.exports.createOuterMeeting = async (req, res) => {
  try {
    const { Meeting, InternalTeamSelect, OuterMeeting, Employee } =
      req.app.locals.models;
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
        req.body.empId = req.decodedEmpId;
        const createdMeeting = await Meeting.create(req.body, {
          fields: inputFieldsMeeting,
        });

        if (createdMeeting) {
          createdMeeting.outerMeetingID = createOuterMeeting.outerMeetingID;
          await createdMeeting.save();

          if (req.body.internalMembers) {
            const updatedList = req.body.internalMembers.map(
              (internalMember) => ({
                ...internalMember,
                meetingID: createdMeeting.meetingID,
              })
            );

            await Promise.all(
              updatedList.map(async (internalMember) => {
                await InternalTeamSelect.create(internalMember, {
                  fields: inputFieldsInternalMembers,
                });
              })
            );

            const internalMembers = req.body.internalMembers;

            const internalMemberIds = internalMembers.map(
              (member) => member.empId
            );

            const internalTeamEmails = await Employee.findAll({
              attributes: ["email"],
              where: {
                empId: internalMemberIds,
              },
              raw: true,
            });

            const emailPromises = internalTeamEmails.map(async (member) => {
              const mailSubject = "Meeting Created";
              const mailMessage = "A new meeting has been created.";

              await sendMail(
                member.email,
                "rtpl@rtplgroup.com",
                mailSubject,
                mailMessage
              );
            });

            await Promise.all(emailPromises);
          }

          res.status(200).json({
            response_type: "SUCCESS",
            data: {},
            message: "Your outer meeting has been created successfully.",
          });
        } else {
          res.status(400).json({
            response_type: "FAILED",
            data: {},
            message:
              "Sorry, Your outer meeting has not been created. Please try again later.",
          });
        }
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message:
            "Sorry, Your outer meeting has not been created. Please try again later.",
        });
      }
    } else {
      console.log("Invalid parameter");
      res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "Invalid parameter",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
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
          response_type: "FAILED",
          data: {},
          message: "Outer Meeting not found for the given Outer Meeting ID.",
        });
      }

      const updatedOuterMeeting = await outerMeeting.update({
        status,
        DeclineReason: status === "Rejected" ? DeclineReason : null,
      });

      if (updatedOuterMeeting) {
        res.status(200).json({
          response_type: "SUCCESS",
          message: "Status Updated successfully",
          data: {
            updatedOuterMeeting: updatedOuterMeeting,
          },
        });
      } else {
        res.status(400).json({
          response_type: "FAILED",
          message: "Status Can't be Updated, Please Try Again Later.",
          data: {},
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};

module.exports.createAppointmentMeeting = async (req, res) => {
  try {
    const {
      Meeting,
      InternalTeamSelect,
      AppointmentMeeting,
      Employee,
      TimeSlot,
    } = req.app.locals.models;
    const updatedBy = req.decodedEmpCode;
    if (req.body) {
      // COMMON.setModelCreatedByFieldValue(req);
      // Set other necessary fields

      const createAppointmentMeeting = await AppointmentMeeting.create(
        req.body.appointeeDetails
      );

      if (createAppointmentMeeting) {
        req.body.createdBy = updatedBy;
        req.body.empId = req.decodedEmpId;
        const createdMeeting = await Meeting.create(req.body, {
          fields: inputFieldsMeeting,
        });

        if (createdMeeting) {
          createdMeeting.appointmentMeetingID =
            createAppointmentMeeting.appointmentMeetingID;
          await createdMeeting.save();

          const updatedTimeSlots = req.body.timeSlots.map((timeSlot) => ({
            ...timeSlot,
            meetingID: createdMeeting.meetingID,
          }));

          await Promise.all(
            updatedTimeSlots.map(async (timeSlot) => {
              await TimeSlot.create(timeSlot, {
                fields: inputFieldTimeSlot,
              });
            })
          );

          if (req.body.internalMembers) {
            const updatedList = req.body.internalMembers.map(
              (internalMember) => ({
                ...internalMember,
                meetingID: createdMeeting.meetingID,
              })
            );

            await Promise.all(
              updatedList.map(async (internalMember) => {
                await InternalTeamSelect.create(internalMember, {
                  fields: inputFieldsInternalMembers,
                });
              })
            );

            const internalMembers = req.body.internalMembers;

            const internalMemberIds = internalMembers.map(
              (member) => member.empId
            );

            const internalTeamEmails = await Employee.findAll({
              attributes: ["email"],
              where: {
                empId: internalMemberIds,
              },
              raw: true,
            });

            const emailPromises = internalTeamEmails.map(async (member) => {
              const mailSubject = "Meeting Created";
              const mailMessage = "A new meeting has been created.";

              await sendMail(
                member.email,
                "rtpl@rtplgroup.com",
                mailSubject,
                mailMessage
              );
            });

            await Promise.all(emailPromises);
          }

          res.status(200).json({
            response_type: "SUCCESS",
            data: {},
            message: "Your appointment meeting has been created successfully.",
          });
        } else {
          res.status(400).json({
            response_type: "FAILED",
            data: {},
            message:
              "Sorry, Your appointment meeting has not been created. Please try again later.",
          });
        }
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message:
            "Sorry, Your appointment meeting has not been created. Please try again later.",
        });
      }
    } else {
      console.log("Invalid parameter");
      res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "Invalid parameter",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};

module.exports.updateAppointmentMeetingStatus = async (req, res) => {
  try {
    const { AppointmentMeeting, Meeting } = req.app.locals.models;
    if (req.params && req.body) {
      const { appointmentMeetingID } = req.params;
      const { status, DeclineReason, meetingStartTime, meetingEndTime } =
        req.body;
      // get value of updatedBy
      // COMMON.setModelUpdatedByFieldValue(req);

      const appointmentMeeting = await AppointmentMeeting.findOne({
        where: { appointmentMeetingID },
      });

      if (!appointmentMeeting) {
        return res.status(404).json({
          response_type: "FAILED",
          data: {},
          message:
            "Appointment Meeting not found for the given Outer Meeting ID.",
        });
      }

      const updatedAppointmentMeeting = await appointmentMeeting.update({
        status,
        DeclineReason: status === "Rejected" ? DeclineReason : null,
      });

      if (updatedAppointmentMeeting) {
        const meeting = await Meeting.findOne({
          where: { appointmentMeetingID },
        });

        const updateTimeOfMeeting = await meeting.update({
          meetingStartTime,
          meetingEndTime,
        });

        if (updateTimeOfMeeting) {
          res.status(200).json({
            response_type: "SUCCESS",
            message: "Time of Meeting Updated successfully",
            data: { updatedAppointmentMeeting: updatedAppointmentMeeting },
          });
        } else {
          res.status(400).json({
            response_type: "FAILED",
            data: {},
            message:
              "Time of Meeting Can't be Updated, Please Try Again Later.",
          });
        }
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Status Can't be Updated, Please Try Again Later.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};

module.exports.startMeeting = async (req, res) => {
  try {
    const {
      Meeting,
      // InternalTeamSelect
    } = req.app.locals.models;
    const {
      meetingID,
      // empIds
    } = req.body;

    if (
      !meetingID
      // || !empIds ||
      // !Array.isArray(empIds) ||
      // empIds.length === 0
    ) {
      return res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "meetingID is required.",
      });
    }

    const existingMeeting = await Meeting.findByPk(meetingID);

    if (!existingMeeting) {
      return res.status(404).json({
        response_type: "FAILED",
        data: {},
        message: "Meeting not found.",
      });
    }

    existingMeeting.startedAt = new Date();
    existingMeeting.isActive = true;

    await existingMeeting.save();

    // await Promise.all(
    //   empIds.map(async (empId) => {
    //     await InternalTeamSelect.update(
    //       { status: "Accepted" },
    //       { where: { meetingID, empId } }
    //     );
    //   })
    // );

    return res.status(200).json({
      response_type: "SUCCESS",
      message: "Meeting started successfully.",
      data: { meeting: existingMeeting },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};

module.exports.rescheduleMeeting = async (req, res) => {
  try {
    const { Meeting } = req.app.locals.models;
    const {meetingTime,meetingID,isReschedule ,officeID,meetingModeID,conferenceRoomID,meetingDate,meetingLink} = req.body
    if (!meetingID) {
      return res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "meetingID is required in the request body",
      });
  }
  
  // const meetings = await Meeting.findAll({
  //   where: {
  //     meetingTime
  //   }
  // });
  // if (meetings.length !== 0){
  //   return res.status(400).json({
  //     response_type: "FAILED",
  //     data: {},
  //     message: "already assign this time.",


  // });
  // } 
  const updatedConferenceRoom = await Meeting.update(
    { meetingTime,isReschedule ,officeID,meetingModeID,conferenceRoomID,meetingDate,meetingLink }, // New values for meetingStartTime and meetingEndTime
    { 
        where: { meetingID }, // Condition to select the time slot to update
        fields: ["meetingTime","isReschedule" ,"officeID","meetingModeID","conferenceRoomID","meetingDate","meetingLink"] // Specify the fields to be updated
    }
);
    

    res.status(200).json({
      response_type: "SUCCESS",
      data: {},
      message: "Meeting has been rescheduled successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};




module.exports.endMeeting = async (req, res) => {
  try {
    const {  Meeting } = req.app.locals.models;
    const { meetingID, status } = req.body;
    // const updatedBy = req.decodedEmpCode;

    if (!meetingID) {
      return res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "timeSlotID is required in the request body",
      });
    }

    const cancelConferenceRoom = await Meeting.update(
      { status },
      { 
          where: { meetingID }, 
          fields: ["status"]
      }
  );
    

    res.status(200).json({
      response_type: "SUCCESS",
      data: {},
      message: "Meeting has ended successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};

module.exports.cancelMeeting = async (req, res) => {
  try {
    const { Meeting } = req.app.locals.models;
    const { meetingID,status } = req.body;
    // const updatedBy = req.decodedEmpCode;

    if (!meetingID) {
      return res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "Meeting ID is required in the request body",
      });
    }

    const updatedConferenceRoom = await Meeting.update(
      { status }, // New values for meetingStartTime and meetingEndTime
      { 
          where: { meetingID }, // Condition to select the time slot to update
          fields: ["status"] // Specify the fields to be updated
      }
  );

    res.status(200).json({
      response_type: "SUCCESS",
      data: {},
      message: "Meeting has cancle successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      error: error.message,
    });
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
      InternalTeamSelect,
      TimeSlot
    } = req.app.locals.models;

    let {
      sort,
      sortBy,
      searchField,
      isActive,
      empId,
      cancelledMeeting,
      type,
      status,
      meetingStatus,
    } = req.query;


    sort = sort ? sort.toUpperCase() : "DESC";

    const queryOptions = {
      include: [],
    };

    // if (sortBy) {
    queryOptions.order = [["createdAt", sort]];
    // }

    if (
      searchField &&
      typeof searchField === "string" &&
      searchField.trim() !== ""
    ) {
      queryOptions.where = {
        [Op.or]: [{ MeetingPurpose: { [Op.like]: `%${searchField}%` } }],
      };
    }

    queryOptions.include.push(
      { model: Employee, as: "employee" },
      { model: Office, as: "office" },
      { model: RequestMeeting, as: "requestMeeting" },
      { model: MeetingType, as: "meetingType" },
      { model: MeetingMode, as: "meetingMode" },
      // { model: TimeSlot, as: "TimeSlot" },
      { model: ConferenceRoom, as: "conferenceRoom" },
      {
        model: InternalTeamSelect,
        as: "internalTeamSelect",
        include: [
          {
            model: Employee,
            as: "employee",
          },
        ],
      }
    );

    if (empId) {
      queryOptions.where = {
        ...queryOptions.where,
        isActive: isActive ? isActive : false,
        isDeleted: cancelledMeeting ? true : false,
        empId: req.user.empId,
      };
    } else {
      queryOptions.where = {
        ...queryOptions.where,
        isActive: isActive ? isActive : false,
        isDeleted: cancelledMeeting ? true : false,
      };
    }

    if (type) {
      if (type == "Request") {
        queryOptions.where = {
          ...queryOptions.where,
          requestID: { [Op.not]: null },
        };
      } else if (type == "Outer") {
        if (status) {
          queryOptions.include.push({
            model: OuterMeeting,
            as: "outerMeeting",
            where: { status: status },
            required: true,
          });
        } else {
          queryOptions.include.push({
            model: OuterMeeting,
            as: "outerMeeting",
            required: true,
          });
        }
        queryOptions.where = {
          ...queryOptions.where,
          outerMeetingID: { [Op.not]: null },
        };
      } else {
        if (status) {
          queryOptions.include.push({
            model: AppointmentMeeting,
            as: "appointmentMeeting",
            where: { status: status },
            required: true,
          });
        } else {
          queryOptions.include.push({
            model: AppointmentMeeting,
            as: "appointmentMeeting",
            required: true,
          });
        }
        queryOptions.where = {
          ...queryOptions.where,
          appointmentMeetingID: { [Op.not]: null },
        };
      }
    } 
    else {
      queryOptions.include.push({
        model: OuterMeeting,
        as: "outerMeeting",
      });
      queryOptions.include.push({
        model: AppointmentMeeting,
        as: "appointmentMeeting",
      });
    }

    if (meetingStatus) {
      if (meetingStatus === "today") {
        queryOptions.where.meetingDate = {
          [Op.eq]: new Date().toISOString().split("T")[0],
        };
      } else if (meetingStatus === "upcoming") {
        queryOptions.where.meetingDate = {
          [Op.gt]: new Date().toISOString().split("T")[0],
        };
      } else if (meetingStatus === "cancelled") {
        queryOptions.where = {
          isDeleted: true,
        };
      } else if (meetingStatus === "completed") {
        queryOptions.where = {
          isActive: false,
          stoppedAt: { [Op.not]: null },
        };
      }
    }


    const { rows: createdMeetings, count: totalCount } = await Meeting.findAndCountAll(queryOptions);


    // const createdMeetings = await Meeting.findAll(queryOptions);
    // Loop through the createdMeetings array
    for (let i = 0; i < createdMeetings.length; i++) {
      const meeting = createdMeetings[i];
      // Join over TimeSlot using meetingID
      const timeSlots = await TimeSlot.findAll({
          where: { meetingID: meeting.meetingID }, // Filter by meetingID
      });
      // Add the timeSlots to the meeting object
      meeting.dataValues.timeSlots = timeSlots;
    }

    if (createdMeetings) {
      res.status(200).json({
        response_type: "SUCCESS",
        message: cancelledMeeting
          ? "Cancelled Meetings Fetched Successfully."
          : "Created Meetings Fetched Successfully.",
        data: { meetings: createdMeetings },
      });
    } else {
      res.status(400).json({
        response_type: "FAILED",
        message: cancelledMeeting
          ? "Cancelled Meetings Can't be Fetched."
          : "Created Meetings Can't be Fetched.",
        data: {},
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};

module.exports.getAppointmentMeetings = async (req, res) => {
  try {
    const {
      Meeting,
      Employee,
      Office,
      AppointmentMeeting,
      MeetingType,
      MeetingMode,
      ConferenceRoom,
      TimeSlot,
    } = req.app.locals.models;

    let { page, pageSize, sort, sortBy, searchField, status } = req.query;

    page = Math.max(1, parseInt(page, 10)) || 1;
    pageSize = Math.max(1, parseInt(pageSize, 10)) || 10;
    const offset = (page - 1) * pageSize;

    sort = sort ? sort.toUpperCase() : "DESC";

    const queryOptions = {
      limit: pageSize,
      offset: offset,
      include: [],
    };

    queryOptions.order = [["createdAt", sort]];

    if (
      searchField &&
      typeof searchField === "string" &&
      searchField.trim() !== ""
    ) {
      queryOptions.where = {
        [Op.or]: [
          { status: { [Op.like]: `%${searchField}%` } },
          { DeclineReason: { [Op.like]: `%${searchField}%` } },
        ],
      };
    }

    if (status) {
      queryOptions.include = [
        {
          model: AppointmentMeeting,
          as: "appointmentMeeting",
          where: {
            empId: req.user.empId,
            status: status,
          },
        },
      ];
    } else {
      queryOptions.include = [
        {
          model: AppointmentMeeting,
          as: "appointmentMeeting",
          where: {
            empId: req.user.empId,
          },
        },
      ];
    }

    queryOptions.include.push(
      { model: Employee, as: "employee" },
      { model: Office, as: "office" },
      { model: MeetingType, as: "meetingType" },
      { model: MeetingMode, as: "meetingMode" },
      { model: ConferenceRoom, as: "conferenceRoom" },
      { model: TimeSlot, as: "timeSlot" }
      // {
      //   model: InternalTeamSelect,
      //   as: "internalTeamSelect",
      //   include: [
      //     {
      //       model: Employee,
      //       as: "employee",
      //     },
      //   ],
      // }
    );

    const totalCount = await Meeting.count({
      where: queryOptions.where,
    });

    const totalPage = Math.ceil(totalCount / pageSize);

    const appointmentMeetings = await Meeting.findAll(queryOptions);

    if (appointmentMeetings) {
      res.status(200).json({
        totalPage: totalPage,
        currentPage: page,
        response_type: "SUCCESS",
        message: "Appointment Meetings Created For You Fetched Successfully.",
        data: { meetings: appointmentMeetings },
      });
    } else {
      res.status(400).json({
        response_type: "FAILED",
        message: "Appointment Meetings Created For You Can't be Fetched.",
        data: {},
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
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
          { model: InternalTeamSelect, as: "internalTeamSelect" },
        ],
      });

      if (createdMeetingDetails) {
        res.status(200).json({
          response_type: "SUCCESS",
          message: "Created Meeting Fetched Successfully.",
          data: { meeting: createdMeetingDetails },
        });
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Created Meeting Can't be Fetched, Please Try Again Later.",
        });
      }
    } else {
      console.log("Invalid perameter");
      res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "Invalid perameter",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
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

    const meetings = await Meeting.findAll({
      where: whereClause,
      attributes: ["meetingStartTime", "meetingEndTime"],
    });

    if (!meetings || meetings.length === 0) {
      return res.status(404).json({
        response_type: "FAILED",
        data: {},
        message: "No meetings found for the provided details.",
      });
    }

    res.status(200).json({
      response_type: "SUCCESS",
      message: "Meetings Times By Conference Room Fetched Successfully.",
      data: { meetings: meetings },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};
