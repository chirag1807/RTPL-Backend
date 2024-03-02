const { Op } = require("sequelize");

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
          response_type: "SUCCESS",
          message: "Internal Members Fetched Successfully.",
          data: {
            internalMembers: internalMemebers,
          },
        });
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Internal Members Can't be Fetched, Please Try Again Later.",
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
    console.error(error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      error: error.message,
    });
  }
};

// notification for internal team memeber
module.exports.getMeetingsForInternalTeam = async (req, res) => {
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
    const { empId } = req.params;

    let { page, pageSize, sort, sortBy, searchField, type } = req.query;

    page = Math.max(1, parseInt(page, 10)) || 1;
    pageSize = Math.max(1, parseInt(pageSize, 10)) || 10;

    const offset = (page - 1) * pageSize;

    sort = sort ? sort.toUpperCase() : "DESC";

    const queryOptions = {
      limit: pageSize,
      offset: offset,
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
        [Op.or]: [
          { status: { [Op.like]: `%${searchField}%` } },
          { empId: { [Op.like]: `%${searchField}%` } },
          { meetingID: { [Op.like]: `%${searchField}%` } },
        ],
      };
    }

    queryOptions.where = { ...queryOptions.where, empId: empId };

    queryOptions.include.push({
      model: Meeting,
      as: "meeting",
      where: {},
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

    if (type) {
      if (type === "Request") {
        queryOptions.include[0].where.requestID = { [Op.not]: null };
      } else if (type === "Outer") {
        queryOptions.include[0].where.outerMeetingID = { [Op.not]: null };
      } else if (type === "Internal") {
        queryOptions.include[0].where.appointmentMeetingID = { [Op.not]: null };
      }
    }

    const totalCount = await InternalTeamSelect.count({
      where: queryOptions.where,
    });
    const totalPage = Math.ceil(totalCount / pageSize);

    const meetingsForEmployee = await InternalTeamSelect.findAll(queryOptions);

    if (!meetingsForEmployee || meetingsForEmployee.length === 0) {
      return res.status(404).json({
        response_type: "FAILED",
        data: {},
        message: "No meetings found for the provided employee.",
      });
    }

    res.status(200).json({
      response_type: "SUCCESS",
      totalPage: totalPage,
      currentPage: page,
      data: { meetingsForEmployee: meetingsForEmployee },
      message: "Meetings for Employee Fetched.",
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
        return res.status(404).json({
          response_type: "FAILED",
          data: {},
          message: "Internal member not found for the given ID",
        });
      }

      const updatedMember = await updateMember.update(req.body, {
        fields: inputFieldsInternalTeamSelect,
      });

      if (updatedMember) {
        res.status(200).json({
          response_type: "SUCCESS",
          data: {},
          message: "Internal Member has been Updated Successfully.",
        });
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message:
            "Internal Member has not been Updated, Please Try Again Later.",
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
    console.error(error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};

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
        return res.status(404).json({
          response_type: "FAILED",
          data: {},
          message: "Internal member not found for the given ID",
        });
      }

      const deletedInternalMember = await internalMember.destroy();

      if (deletedInternalMember) {
        res.status(200).json({
          response_type: "SUCCESS",
          data: {},
          message: "Internal member has been Deleted Successfully.",
        });
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message:
            "Internal member has not been Deleted, Please Try Again Later.",
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};

module.exports.takeAttendanceOfInternalMembers = async (req, res) => {
  try {
    const { InternalTeamSelect } = req.app.locals.models;

    if (req.body) {
      const meetingID = req.body.meetingID;
      const empIds = req.body.empIds;

      const teamMembers = await InternalTeamSelect.findAll({
        where: { meetingID },
      });

      for (const teamMember of teamMembers) {
        if (empIds.includes(teamMember.empId)) {
          await teamMember.update({ isAttended: 1 });
        }
      }

      res.status(200).json({
        response_type: "SUCCESS",
        data: {},
        message: "Attendance marked successfully.",
      });
    } else {
      console.log("Invalid perameter");
      res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "Invalid perameter",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};

module.exports.takeAttendanceOfVisitors = async (req, res) => {
  const { ReqMeetVisitorDetails } = req.app.locals.models;

  try {
    if (req.body) {
      const reqMeetingID = req.body.reqMeetingID;
      const visitorIds = req.body.visitorIds;

      const visitors = await ReqMeetVisitorDetails.findAll({
        where: { reqMeetingID },
      });

      for (const visitor of visitors) {
        if (visitorIds.includes(visitor.visitorID)) {
          await visitor.update({ isAttended: 1 });
        }
      }

      res.status(200).json({
        response_type: "SUCCESS",
        data: {},
        message: "Attendance marked successfully.",
      });
    } else {
      console.log("Invalid perameter");
      res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "Invalid perameter",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};
