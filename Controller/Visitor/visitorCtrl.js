const validator = require('validator');
const SendEmailService = require('../../Middleware/emaiService')
const nodemailer = require('nodemailer');
const CONSTANT = require('../../constant/constant');
const inputFieldsRequestmeeting = [
    "vFirstName",
    "vLastName",
    "vDateOfBirth",
    "vAnniversaryDate",
    "vDesignation",
    "vCompanyName",
    "vCompanyAddress",
    "vCompanyContact",
    "vCompanyEmail",
    "purposeOfMeerting",
    "vImage",
    "vIDDoc",
    "empId",
    "TokenNumber",
    "ReqStatus",
    "DeclineReason"
];

module.exports.visitorRequestMeeting = async (req, res) => {
    try {
        const {RequestMeeting} = req.app.locals.models;
        if(req.body){
            console.log(req.body);
            if (!validator.isEmail(req.body.vCompanyEmail)) {
                return res.status(400).json({ error: 'Invalid email.' });
            }
            if (!validator.isMobilePhone((req.body.vCompanyContact).toString(), 'any')) {
                return res.status(400).json({ error: 'Invalid phone number.' });
            }
            //save visitor icard and documents to s3 bucket.
            const visitorRequestMeeting = await RequestMeeting.create(req.body, {
                fields: inputFieldsRequestmeeting
            });
            if(visitorRequestMeeting){
                //send mail to company of visitor.
                res.status(200).json({message: "Your meeting request has been registered successfully."});
            }
            else{
                res.status(400).json({ message: 'Sorry, Your meeting request has not registered. Please try again later' });
            }
        }
        else{
            console.log('Invalid perameter');
            res.status(400).json({ error: 'Invalid perameter' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.getVisitorRequestMeeting = async (req, res) => {
    try {
        const {RequestMeeting, Employee} = req.app.locals.models;
        
        const requestMeetings = await RequestMeeting.findAll({
            include: 
                { model: Employee, as: 'employee' },
        });

        if(requestMeetings){
            res.status(200).json({
                message: "Request Meetings Fetched Successfully.",
                meetings: requestMeetings
            });
        }
        else{
            res.status(400).json({
                message: "Request Meetings Can't be Fetched."
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}