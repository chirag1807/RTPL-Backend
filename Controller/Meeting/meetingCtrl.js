const sendMail = require("../../Middleware/emaiService");
const ErrorHandler = require("../../utils/errorhandler");
const cloudinary = require("../../utils/cloudinary");
const fs = require("fs");
const { Op, where } = require("sequelize");
const TimeSlot = require("../../models/timeSlot");
const Meeting = require("../../models/meeting");

// Define the initial time slots
const initialTimeSlots = [
  { meetingStartTime: "9:00", meetingEndTime: "9:30" }, { meetingStartTime: "9:30", meetingEndTime: "10:00" },
  { meetingStartTime: "10:00", meetingEndTime: "10:30" }, { meetingStartTime: "10:30", meetingEndTime: "11:00" },
  { meetingStartTime: "11:00", meetingEndTime: "11:30" }, { meetingStartTime: "11:30", meetingEndTime: "12:00" },
  { meetingStartTime: "12:00", meetingEndTime: "12:30" }, { meetingStartTime: "12:30", meetingEndTime: "13:00" },
  { meetingStartTime: "13:00", meetingEndTime: "13:30" }, { meetingStartTime: "13:30", meetingEndTime: "14:00" },
  { meetingStartTime: "14:00", meetingEndTime: "14:30" }, { meetingStartTime: "14:30", meetingEndTime: "15:00" },
  { meetingStartTime: "15:00", meetingEndTime: "15:30" }, { meetingStartTime: "15:30", meetingEndTime: "16:00" },
  { meetingStartTime: "16:00", meetingEndTime: "16:30" }, { meetingStartTime: "16:30", meetingEndTime: "17:00" },
  { meetingStartTime: "17:00", meetingEndTime: "17:30" }, { meetingStartTime: "17:30", meetingEndTime: "18:00" },
  { meetingStartTime: "18:00", meetingEndTime: "18:30" }, { meetingStartTime: "18:30", meetingEndTime: "19:00" },
  { meetingStartTime: "19:00", meetingEndTime: "19:30" }, { meetingStartTime: "19:30", meetingEndTime: "20:00" },
  { meetingStartTime: "20:00", meetingEndTime: "20:30" }, { meetingStartTime: "20:30", meetingEndTime: "21:00" }
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
  "visitior_list"
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
    const { meetingDate ,conroomId } = req.params;
    const arrayData = [];

    // Find available time slots
    const avabletimeslots = await Meeting.findAll({
      where: {
        meetingDate,
        conferenceRoomID : conroomId
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
    // visitior_list
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
              where: {
                empId: {[Op.in]: internalMemberIds},
              },
              attributes: ["email"],
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
// meetingID
module.exports.pushMeeting = async (req, res) => {
  try {
    if (req.params && req.body) {
      const {  Meeting } = req.app.locals.models;
      const { meetingID } = req.body;
      const data = [
        req.files.pdffile ? `'${req.files.pdffile[0].path}'` : 'null',
        req.files.docfile ? `'${req.files.docfile[0].path}'` : 'null',
        req.files.docfile1 ? `'${req.files.docfile1[0].path}'` : 'null'
    ].join(', ');
    

      const isMeeting = await Meeting.findOne({
        where: { meetingID },
      });

      if (!isMeeting) {
        return res.status(404).json({
          response_type: "FAILED",
          data: {},
          message:
            "Meeting not found for the given Meeting ID.",
        });
      }
      await Meeting.update({ pushData: data}, 
      { where: { meetingID } });
      
      res.status(200).json({
        response_type: "SUCCESS",
        message: "Meeting Data Add successfully",
        data: {  },
      });
    }}
    catch (error) {
      console.error(error);
      res.status(500).json({
        response_type: "FAILED",
        data: {},
        message: error.message,
      });
    }
  }
module.exports.followUpMeeting = async (req, res) => {
    try {
      const {  Meeting } = req.app.locals.models;
      if (req.params && req.body) {
        const { meetingID } = req.params;
        const { followUpMeetingId } = req.body;
        const isMeeting = await Meeting.findOne({
          where: { meetingID },
        });
  
        if (!isMeeting) {
          return res.status(404).json({
            response_type: "FAILED",
            data: {},
            message:
              "Meeting not found for the given Meeting ID.",
          });
        }
        await Meeting.update({followUpMeetingId}, 
        { where: { meetingID } });
        
        res.status(200).json({
          response_type: "SUCCESS",
          message: "Data Add successfully",
          data: {  },
        });
      }}
      catch (error) {
        console.error(error);
        res.status(500).json({
          response_type: "FAILED",
          data: {},
          message: error.message,
        });
      }
    }
module.exports.followUpMeetingList = async (req, res) => {
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
        Company
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
        { model: Office, as: "office", include: [{
            model: Company, as: "company", // Use "company" instead of "Companys"
        }] },
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
  
  
      const restData = [...createdMeetings]; // Spread the array if you need a shallow copy
  
  try {
      // Use findAll with include to perform a join operation
      const meetingsWithCompanies = await Office.findAll({
          where: { officeID: restData.map(meeting => meeting.officeID) }, // Find offices with IDs from restData
          include: {
              model: Company,
              attributes: ['Name'] // Specify the attributes you want to include from the Company model
          }
      });
  
      // Map the retrieved companies to an object for easier lookup
      const companyMap = {};
      meetingsWithCompanies.forEach(office => {
          companyMap[office.officeID] = office.Company.Name;
      });
  
      // Assign company names to restData objects based on the officeID
      restData.forEach(meeting => {
          meeting.CompanyName = companyMap[meeting.officeID] || ''; // Assign the company name or an empty string if not found
      });
  } catch (error) {
      console.error("Error:", error);
  }
  
  
      if (createdMeetings) {
        res.status(200).json({
          response_type: "SUCCESS",
          message: cancelledMeeting
            ? "Cancelled Meetings Fetched Successfully."
            : "Created Meetings Fetched Successfully.",
          data: { meetings: restData },
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


    
module.exports.startMeeting = async (req, res) => {
  try {
    const {Meeting, AppointmentMeeting} = req.app.locals.models;
    const {meetingID} = req.body;
    if (!meetingID) {
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
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    existingMeeting.startedAt = formattedTime;

    await Meeting.update(
      {  startedAt: formattedTime },
      {
          where: { meetingID },
          fields: [ "startedAt"]
      }
  );
  // await AppointmentMeeting.update(
  //   {status},
  //   {where: existingMeeting.appointmentMeetingID}
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
    const { meetingID, status, remark } = req.body;
    const data = [
      req.files.pdffile ? `'${req.files.pdffile[0].path}'` : 'null',
      req.files.docfile ? `'${req.files.docfile[0].path}'` : 'null',
      req.files.docfile1 ? `'${req.files.docfile1[0].path}'` : 'null'
  ].join(', ');
    // const updatedBy = req.decodedEmpCode;

    if (!meetingID) {
      return res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "timeSlotID is required in the request body",
      });
    }

    await Meeting.update(
      { status, remark ,pushData: data },
      { 
          where: { meetingID }, 
          fields: ["status", "remark", "pushData"]
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
    const { Meeting, AppointmentMeeting, RequestMeeting } = req.app.locals.models;
    const { meetingID,status } = req.body;
    // const updatedBy = req.decodedEmpCode;

    if (!meetingID) {
      return res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "Meeting ID is required in the request body",
      });
    }
    const meetingData = await Meeting.findOne({
      where: meetingID,
      include:[
        {
          model: AppointmentMeeting,
          as: "appointmentMeeting",
          required: true,
        }
      ]
    })
    const updatedConferenceRoom = await Meeting.update(
      { status }, // New values for meetingStartTime and meetingEndTime
      { 
          where: { meetingID }, // Condition to select the time slot to update
          fields: ["status"] // Specify the fields to be updated
      }
      
    )
    await AppointmentMeeting.update(
      {status},
      {where: meetingData.appointmentMeetingID}
    );

     // ReqStatus
     await RequestMeeting.update(
      { ReqStatus: status},
      { where: { id: meetingData.requestID}}
  )

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
      ReqMeetVisitorDetails,
      AppointmentMeeting,
      OuterMeeting,
      MeetingType,
      MeetingMode,
      ConferenceRoom,
      InternalTeamSelect,
      Company
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
      { model: Office, as: "office", include: [{
          model: Company, as: "company", // Use "company" instead of "Companys"
      }] },
      { model: RequestMeeting, as: "requestMeeting",
        include:[{model: ReqMeetVisitorDetails, required: false, as: "visitorDetails"}]
       },
      { model: MeetingType, as: "meetingType" },
      { model: MeetingMode, as: "meetingMode" },
      { model: TimeSlot, as: "timeSlot" },
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


    const restData = [...createdMeetings]; // Spread the array if you need a shallow copy

try {
    // Use findAll with include to perform a join operation
    const meetingsWithCompanies = await Office.findAll({
        where: { officeID: { $in: (restData.map(meeting => meeting.officeID))} }, // Find offices with IDs from restData
        include:[ {
            model: Company,
            attributes: ['Name'] // Specify the attributes you want to include from the Company model
        }]
    });

    // Map the retrieved companies to an object for easier lookup
    const companyMap = {};
    meetingsWithCompanies.forEach(office => {
        companyMap[office.officeID] = office.Company.Name;
    });

    // Assign company names to restData objects based on the officeID
    restData.forEach(meeting => {
        meeting.CompanyName = companyMap[meeting.officeID] || ''; // Assign the company name or an empty string if not found
    });
} catch (error) {
    console.error("Error:", error);
}


    if (createdMeetings) {
      res.status(200).json({
        response_type: "SUCCESS",
        message: cancelledMeeting
          ? "Cancelled Meetings Fetched Successfully."
          : "Created Meetings Fetched Successfully.",
        data: { meetings: restData },
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
// avableConRoom
module.exports.avableConRoom = async (req, res) => {
  try {
    const { Meeting, ConferenceRoom } = req.app.locals.models;
    const { meetingDate, officeID } = req.params;
    const whereClause = {
      officeID,
      meetingDate: meetingDate ? meetingDate : new Date(),
    };

    const meetings = await Meeting.findAll({
      where: whereClause,
    });

    const data = [];
    for (var i = 0; i < meetings.length; i++) {
      data.push(meetings[i].conferenceRoomID);
    }

    const ConferenceRoomDataId = await ConferenceRoom.findAll({
      where: { officeID }
    });

    const data1 = [];
    for (var j = 0; j < ConferenceRoomDataId.length; j++) {
      data1.push(ConferenceRoomDataId[j].conferenceRoomID);
    }
    const newData = [];
    for (let i = 0; i < data1.length; i++) {
      if (!data.includes(data1[i])) {
        newData.push(data1[i]);
      }
    }
    
    console.log(newData);

    const avableMeets =await ConferenceRoom.findAll({
      where: { conferenceRoomID: newData }
    });

    res.status(200).json({
      response_type: "SUCCESS",
      message: "Avable room data.",
      data: { meetings: avableMeets },
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
