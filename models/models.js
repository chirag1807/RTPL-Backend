const Designation = require('./Designation');
const Company = require('./company');
const Department = require('./department');
const Employee = require('./employee');
const EmployeeRole = require('./employeeRole');
const Meeting = require('./meeting');
const MeetingMode = require('./meetingMode');
const MeetingType = require('./meetingType');
const RequestMeeting = require('./requestMeeting');
const Office = require('./office');
const ReqMeetDetailsByRecp = require('./reqMeetDetailsByRecp');
const AppointmentMeeting = require('./appointmentMeeting');
const ConferenceRoom = require('./conferenceRoom');
const InternalTeamSelect = require('./internalTeamSelect');
const OuterMeeting = require('./outerMeeting');
const ReqMeetVisitorDetails = require('./reqMeetVisitorDetails');

module.exports = {
    Company,
    Designation,
    Department,
    Employee,
    EmployeeRole,
    Meeting,
    MeetingMode,
    MeetingType,
    Office,
    RequestMeeting,
    ReqMeetDetailsByRecp,
    AppointmentMeeting,
    ConferenceRoom,
    InternalTeamSelect,
    OuterMeeting,
    ReqMeetVisitorDetails
}