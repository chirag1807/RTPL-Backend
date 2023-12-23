const validator = require('validator');
const SendEmailService = require('../../Middleware/emaiService')
const COMMON = require('../../Common/common');
const {createAccessToken} = require('../../Middleware/auth')
const nodemailer = require('nodemailer');
const CONSTANT = require('../../constant/constant');
const inputFieldsEmployee = [
    'firstName',
    'lastName',
    'emp_code',
    'department',
    'destination',
    'email',
    'phone',
    'company',
    'Office',
    'password',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createdAt',
    'updatedAt',
    'deletedAt',
    // 'roleID'
];
// login employee
module.exports.loginEmployee = async (req,res) =>{
    try {
        const {Employee} = req.app.locals.models;
        if(req.body.emp_code && req.body.password){
            const employeeDetails = await Employee.findOne({
                where: {
                    emp_code:req.body.emp_code
                }
            });
             if (employeeDetails) {
                // Compare the password
                const passwordMatch = await COMMON.DECRYPT(req.body.password, employeeDetails.password);
                if (!passwordMatch) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                  } 
                  const token = createAccessToken(employeeDetails.dataValues);
                  // Send the token in the response header
                  res.setHeader('Authorization', `Bearer ${token}`);
                  res.status(200).json({ message: 'Login successfully'});  
            }
            else{
                console.log('Invalid credentials');
                // Return an error response indicating missing data
                res.status(400).json({ error: 'Invalid credentials' });
            }
        }else{
            console.log('Invalid perameter');
            // Return an error response indicating missing data
            res.status(400).json({ error: 'Invalid perameter' });
        }
    } catch (error) {
        
    }
};
// create employee 
module.exports.employeeRegistration = async (req, res) => {
    try {
        const {Employee} = req.app.locals.models;
      if (req.body) {
        // get value of CreatedBy 
        //   COMMON.setModelCreatedByFieldValue(req);
        // Validate email
        if (!validator.isEmail(req.body.email)) {
            return res.status(400).json({ error: 'Invalid email' });
        }
        // Validate phone number
        if (!validator.isMobilePhone((req.body.phone).toString(), 'any')) {
            return res.status(400).json({ error: 'Invalid phone number' });
        }
        const hashedPassword = await COMMON.ENCRYPT(req.body.password);
        if(!hashedPassword){
            return res.status(500).json({ error: CONSTANT.MESSAGE_CONSTANT.SOMETHING_WENT_WRONG});
        }
        req.body.password = hashedPassword;
        const isExistEmployee = await Employee.findOne({
            where: {
                email:req.body.email
            }
          });
        if(!isExistEmployee){
        const employee = await Employee.create(req.body,{
            fields: inputFieldsEmployee,
        });
        if(employee){
           let SendEmailService = nodemailer.createTransport({
                host: "smtp.forwardemail.net",
                port: 465,
                secure: true,
              //service:development.NODEMAILER.SERVICE,
              auth: {
                user:'dummy703666@gmail.com',
                pass: 'Ravi@786',
              },
            });
            const mailOptions = {
                from: 'dummy703666@gmail.com',
                to: req.body.email,
                subject: 'Registration Details',
                text: `UserID:${employee.emp_code}\n Password:${employee.password}\n Url:http://www.rptl.com `,
              };
            let subject = 'Registeration Successfully Done'
            let message = `UserID:${employee.emp_code}\n Password:${employee.password}\n Url:http://www.rptl.com `
            await SendEmailService.sendMail(mailOptions)
            res.status(201).json({ message: 'Employee registered successfully' });
        }else{
            res.status(400).json({ message: 'Employee registered unsuccessfully' });
        }
        // Return a success response
    }else{
        res.status(400).json({ message: 'Employee with this Email Already Exist' });
    }
      } else {
        console.log('Invalid perameter');
        // Return an error response indicating missing data
        res.status(400).json({ error: 'Invalid perameter' });
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Return an error response
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // update employees details
module.exports.updateEmployee = async (req,res) => {
    try {
        const {Employee} = req.app.locals.models;
        if (req.params.id) {
            const empID = req.params.id;
            // get value of CreatedBy 
          COMMON.setModelUpdatedByFieldValue(req);
            return await Employee.update(req.body,{
                where: {
                    empID: empID
                },
                fields: inputFieldsEmployee
            }).then(()=>{
                // Return a success response
                res.status(200).json({ message: 'Employee registered successfully' });
            }).catch((error)=>{
                console.error('An error occurred:', error);
                // Return an error response
                res.status(500).json({ error: 'Internal server error' });
            });
            } else {
          console.log('Invalid perameter');
          // Return an error response indicating missing data
          res.status(400).json({ error: 'Invalid perameter' });
        }
      } catch (error) {
        console.error('An error occurred:', error);
        // Return an error response
        res.status(500).json({ error: 'Internal server error' });
      }
}

// delete employees details
module.exports.deleteEmployee = async (req,res) => {
    try {
        const {Employee} = req.app.locals.models;
        if (req.params.id) {
            const empID = req.params.id;
            const employeeDetails = await Employee.findByPk(empID);
            if (employeeDetails) {
                await employeeDetails.update({isDeleted:1,deletedBy:req.user.empID})
                await employeeDetails.destroy();
                 // Return a success response
                res.json({ message: 'Employee deleted successfully.' });
              } else {
                res.status(404).json({ error: 'Employee not found.' });
              }
         
        } else {
          console.log('Invalid perameter');
          // Return an error response indicating missing data
          res.status(400).json({ error: 'Invalid perameter' });
        }
      } catch (error) {
        console.error('An error occurred:', error);
        // Return an error response
        res.status(500).json({ error: 'Internal server error' });
      }
};

// Change Password
module.exports.changePassword = async (req,res) =>{
    try {
        const {sequelize,Employee} = req.app.locals.models;
        if(req && req.body && req.body.empID && req.body.currentPassword && req.body.newPassword){
            if(req.body.empID === req.user.empID || req.user.roleID === -1){
                const employeeDetails = await Employee.findByPk(req.body.empID);
                if (employeeDetails) { 
                    // Compare the password
                    const passwordMatch = await COMMON.DECRYPT(req.body.currentPassword, employeeDetails.password);
                    if (!passwordMatch) {
                        return res.status(401).json({ error: 'Invalid Password' });
                    } 
                    const hashedPassword = await COMMON.ENCRYPT(req.body.newPassword);
                    if(!hashedPassword){
                        return res.status(500).json({ error: CONSTANT.MESSAGE_CONSTANT.SOMETHING_WENT_WRONG});
                    }
                    return await Employee.update({
                        password:hashedPassword
                    },{
                        where: {
                            empID: req.body.empID
                        }
                    }).then(()=>{
                        
                        // Return a success response
                        res.status(200).json({ message: 'Employee password change successfully' });
                    }).catch((error)=>{
                        console.error('An error occurred:', error);
                        // Return an error response
                        res.status(500).json({ error: 'Internal server error' });
                    });

                }else{
                    res.status(404).json({ error: CONSTANT.MESSAGE_CONSTANT.SOMETHING_WENT_WRONG});
                }
            }
        }else{
            console.log('Invalid perameter');
            // Return an error response indicating missing data
            res.status(400).json({ error: 'Invalid perameter' });
        }
    } 
    catch (error) {
        console.error('An error occurred:', error);
        // Return an error response
        res.status(500).json({ error: 'Internal server error' });
      
    }
};