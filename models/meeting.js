const { DataTypes } = require('sequelize');
const sequelize = require('../utils/config');
const Employee = require('./employee');
const Office = require('./office');
const RequestMeeting = require('./requestMeeting');
const MeetingType = require('./meetingType');
const MeetingMode = require('./meetingMode');
const ConferenceRoom = require('./conferenceRoom');
const AppointmentMeeting = require('./appointmentMeeting');
const OuterMeeting = require('./outerMeeting');
const VisitorDetails = require('./reqMeetVisitorDetails');

const Meeting = sequelize.define('Meetings', {
    meetingID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    empId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Employee,
            key: 'empId',
        },
    },
    officeID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Office,
            key: 'officeID',
        },
    },
    requestID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: RequestMeeting,
          key: 'reqMeetingID',
        },
    },
    appointmentMeetingID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: AppointmentMeeting,
            key: 'appointmentMeetingID',
        },
    },
    outerMeetingID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: OuterMeeting,
            key: 'outerMeetingID',
        },
    },
    meetingTypeID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: MeetingType,
            key: 'meetingTypeID',
        },
    },
    meetingModeID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: MeetingMode,
            key: 'meetingModeID',
        },
    },
    conferenceRoomID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: ConferenceRoom,
            key: 'conferenceRoomID',
        },
    },
    rescConferenceRoomID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: ConferenceRoom,
            key: 'conferenceRoomID',
        },
    },
    MeetingPurpose: {
        type: DataTypes.STRING,
        allowNull: true,
        //here i write it as allowNull true, so frontend team needs to check this validation at frontend level.
    },
    meetingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    meetingStartTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    meetingEndTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    meetingLink: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isReschedule: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    rescMeetingDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    rescMeetingStartTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    startedAt: {
       type: DataTypes.TIME,
       allowNull: true,
    },
    stoppedAt: {
       type: DataTypes.TIME,
       allowNull: true,
    },
    visitior_list: {
        type: DataTypes.JSON,
        allowNull: true,
     },
    meetingDoc: {
        type: DataTypes.STRING,
        allowNull: true,
        // get() {
        //     const meetingDocString = this.getDataValue('meetingDoc');
        //     return meetingDocString ? meetingDocString.split(',').map(id => parseInt(id, 10)) : [];
        //   },
        //   set(value) {
        //     console.log(value)
        //     if (Array.isArray(value)) {
        //       this.setDataValue('meetingDoc', value.join(','));
        //     } else if (typeof value === 'string') {
        //       this.setDataValue('meetingDoc', value);
        //     }
        //   },
    },
    remark: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    rescMeetingEndTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    updatedBy: {
        type: DataTypes.STRING,
        allowNull: true
    },
    deletedBy: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.CHAR,
        allowNull : true
    },
    meetingTime: {
        type: DataTypes.JSON,
        allowNull : true
    },
    pdf:{
        type: DataTypes.STRING,
        allowNull : true
    },
    image :{
        type: DataTypes.STRING,
        allowNull : true
    },
    video  :{
        type: DataTypes.STRING,
        allowNull : true
    },
    followUpMeetingId : {
        type: DataTypes.STRING,
        allowNull : true
    },
}, {
    timestamps: true,
    paranoid: true
});

Meeting.belongsTo(Employee, { foreignKey: 'empId', as: 'employee' });
Meeting.belongsTo(Office, { foreignKey: 'officeID', as: 'office' });
Meeting.belongsTo(RequestMeeting, { foreignKey: 'reqMeetingID', as: 'requestMeeting' });
Meeting.belongsTo(AppointmentMeeting, { foreignKey: 'appointmentMeetingID', as: 'appointmentMeeting'});
Meeting.belongsTo(OuterMeeting, { foreignKey: 'outerMeetingID', as: 'outerMeeting' });
Meeting.belongsTo(MeetingType, { foreignKey: 'meetingTypeID', as: 'meetingType' });
Meeting.belongsTo(MeetingMode, { foreignKey: 'meetingModeID', as: 'meetingMode' });
Meeting.belongsTo(ConferenceRoom, { foreignKey: 'conferenceRoomID', as: 'conferenceRoom' });
RequestMeeting.hasMany(VisitorDetails, { foreignKey: 'reqMeetingID', as: 'visitorDetails' });

module.exports = Meeting;