module.exports.getNotification = async (req, res) => {
  try {
    const { Employee, RequestMeeting, OuterMeeting, Meeting, AppointmentMeeting, ReqMeetDetailsByRecp } =
      req.app.locals.models;

    console.log(req.user.empId);

    if (req.user.isAdmin == true) {
      const inactiveEmployees = await Employee.findAll({
        attributes: [
          "empId",
          "emp_code",
          "firstName",
          "lastName",
          "empProfileImg",
          "createdAt"
        ],
        where: { isActive: false },
      });

      const adminNotifications = createNotificationsForAdmin(inactiveEmployees);

      if (adminNotifications) {
        res
          .status(200)
          .json({
            message: "Notification Fetched Successfully.",
            notifications: adminNotifications,
          });
      } else {
        res
          .status(400)
          .json({
            message: "Notification Can't be Fetched, Please Try Again Later.",
          });
      }
    } else if (req.user.isRecept == true) {
      const pendingRequestMeetings = await RequestMeeting.findAll({
        attributes: [
          "reqMeetingID",
          "createdAt"
        ],
        where: { ReqStatus: "Pending" },
      });

      const pendingOuterMeetings = await OuterMeeting.findAll({
        attributes: [
          "outerMeetingID",
          "createdAt"
        ],
        where: { status: "Pending" },
      });

      const receptionistNotifications = [
        ...createNotificationsForReceptionist(
          pendingRequestMeetings,
          "Request Meeting",
          "reqMeetingID"
        ),
        ...createNotificationsForReceptionist(
          pendingOuterMeetings,
          "Outer Meeting",
          "outerMeetingID"
        ),
      ];

      if (receptionistNotifications) {
        res
          .status(200)
          .json({
            message: "Notification Fetched Successfully.",
            notifications: receptionistNotifications,
          });
      } else {
        res
          .status(400)
          .json({
            message: "Notification Can't be Fetched, Please Try Again Later.",
          });
      }
    } else {

      // const receptionistAcceptedReqMeetings = await RequestMeeting.findAll({
      //   attributes: [
      //     "reqMeetingID",
      //     "createdAt"
      //   ],
      //   where: { ReqStatus: "ReceptionistAccepted", empId: req.user.empId },
      // });

      const receptionistAcceptedReqMeetings = await RequestMeeting.findAll({
        attributes: ['reqMeetingID', 'createdAt'],
        where: {
          ReqStatus: "ReceptionistAccepted",
        },
        include: [
          {
            model: ReqMeetDetailsByRecp,
            as: 'reqMeetDetailsByRecp',
            where: {
              emp_code: req.user.emp_code,
            },
            attributes: [],
          },
        ],
      })

      const receptionistAcceptedOuterMeetings = await OuterMeeting.findAll({
        where: { status: "Accepted" },
      });
      const outerMeetingIds = receptionistAcceptedOuterMeetings.map(
        (meeting) => meeting.outerMeetingID
      );
      const receptionistAcceptedEmployeeOuterMeetings = await Meeting.findAll({
        attributes: [
          "meetingID",
          "createdAt"
        ],
        where: { outerMeetingID: outerMeetingIds, empId: req.user.empId },
      });

      const pendingOuterMeetings = await AppointmentMeeting.findAll({
        where: { status: "Pending", empId: req.user.empId }
      });
      const appointmentMeetingIds = pendingOuterMeetings.map(
        (meeting) => meeting.appointmentMeetingID
      );
      const createdAppointmentMeetings = await Meeting.findAll({
        attributes: [
          "meetingID",
          "createdAt"
        ],
        where: { appointmentMeetingID: appointmentMeetingIds },
      });

      const employeeNotifications = [
        // ...createNotificationsForEmployee(
        //   receptionistAcceptedReqMeetings,
        //   "Request Meeting",
        //   "reqMeetingID"
        // ),
        ...createNotificationsForEmployee(
          receptionistAcceptedReqMeetings,
          "Request Meeting",
          "reqMeetingID"
        ),
        ...createNotificationsForEmployee(
          receptionistAcceptedEmployeeOuterMeetings,
          "Outer Meeting",
          "meetingID"
        ),
        ...createNotificationsForEmployee(
          createdAppointmentMeetings,
          "Appointment Meeting",
          "meetingID"
        )
      ];

      res.status(200).json({ 
        response_type: "SUCCESS",
        message: "Notifications Fetches Successfully.",
        data: {employeeNotifications: employeeNotifications} });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ 
      response_type: "FAILED",
      data: {},
      message: error.message });
  }
};

function createNotificationsForAdmin(inactiveEmployees) {
  inactiveEmployees.map((employee) => {
    return {
      notificationFor: "admin",
      message: `Employee ${employee.firstName} ${employee.lastName} is inactive. Please verify and activate the employee`,
      respondWith: "ActivateEmployee",
      id: employee.empId,
      img: employee.empProfileImg,
      createdAt: meeting.createdAt
    };
  });
}

function createNotificationsForReceptionist(
  meetings,
  meetingType,
  meetingIdField
) {
  return meetings.map((meeting) => {
    return {
      notificationFor: "receptionist",
      message: `${meetingType} with ID ${meeting[meetingIdField]} is pending. Please Verify and accept/reject It.`,
      respondWith: meetingType,
      id: meeting[meetingIdField],
      img: "",
      createdAt: meeting.createdAt
    };
  });
}

function createNotificationsForEmployee(meetings, meetingType, meetingIdField) {
  return meetings.map((meeting) => {
    const message = meetingType == "Request Meeting" ?
      `${meetingType} with ID ${meeting[meetingIdField]} is accepted by receptionist. Please Verify and accept/reject It.` :
      meetingType == "Outer Meeting" ?
        `${meetingType} with ID ${meeting[meetingIdField]} is accepted by receptionist. Please take a note on it.` :
        `${meetingType} with ID ${meeting[meetingIdField]} is created for you. Please Verify and accept/reject It.`
    return {
      notificationFor: "employee",
      message: message,
      respondWith: meetingType,
      id: meeting[meetingIdField],
      img: "",
      createdAt: meeting.createdAt
    }
  });
}
