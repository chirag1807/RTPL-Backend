const validator = require("validator");
const COMMON = require("../../Common/common");
const { createAccessToken } = require("../../Middleware/auth");
const CONSTANT = require("../../constant/constant");
const sendMail = require("../../Middleware/emaiService");
const inputFieldsEmployee = [
    "empProfileImg",
    "empIDCard",
    "empAadharCard",
    "aadharNumber",
    "firstName",
    "lastName",
    "emp_code",
    "birthDate",
    "joiningDate",
    "email",
    "featureString",
    "phone",
    "password",
    "createdBy",
    "updatedBy",
    "deletedBy",
    "roleID",
    "companyID",
    "officeID",
    "departmentID",
    "designationID",
    "isAdmin",
    "isRecept",
    "isActive",
];

// addAdmin
module.exports.addAdmin = async (req, res) => {
    try {
        const { Employee } = req.app.locals.models;

        if (req.body) {
            const createdBy = req.decodedEmpCode;
            // get value of CreatedBy
            // COMMON.setModelCreatedByFieldValue(req);
            // Validate email
            req.body.isAdmin = true;
            req.body.isActive = true;
            req.body.createdBy = createdBy;
            if (!validator.isEmail(req.body.email)) {
                return res.status(400).json({ error: "Invalid email" });
            }
            // Validate phone number
            if (!validator.isMobilePhone(req.body.phone.toString(), "any")) {
                return res.status(400).json({ error: "Invalid phone number" });
            }
            const hashedPassword = await COMMON.ENCRYPT(req.body.password);
            if (!hashedPassword) {
                return res
                    .status(500)
                    .json({ error: CONSTANT.MESSAGE_CONSTANT.SOMETHING_WENT_WRONG });
            }
            req.body.password = hashedPassword;
            const isExistEmployee = await Employee.findOne({
                where: {
                    email: req.body.email,
                },
            });
            if (!isExistEmployee) {
                const employee = await Employee.create(req.body, {
                    fields: inputFieldsEmployee,
                });
                if (employee) {
                    let sender = "rtpl@rtplgroup.com"
                    let subject = "Registeration Successfully Done";
                    let message = `UserID:${employee.emp_code}\nUrl:http://www.rptl.com `;

                    const result = await sendMail(req.body.email, sender, subject, message);
                    if (result.success) {
                        res.status(201).json({ message: "Admin registered successfully" });
                    } else {
                        res.status(400).json({ error: result.message });
                    }
                }
            } else {
                res
                    .status(400)
                    .json({ message: "Admin with this Email Already Exist" });
            }
        } else {
            console.log("Invalid perameter");
            res.status(400).json({ error: "Invalid perameter" });
        }
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: error.message });
    }
};

// addReceptionist
module.exports.addReceptionist = async (req, res) => {
    try {
        const { Employee } = req.app.locals.models;
        const createdBy = req.decodedEmpCode;

        if (req.body) {
            // get value of CreatedBy
            // COMMON.setModelCreatedByFieldValue(req);
            // Validate email
            req.body.isRecept = true;
            req.body.isActive = true;
            req.body.createdBy = createdBy;
            if (!validator.isEmail(req.body.email)) {
                return res.status(400).json({ error: "Invalid email" });
            }
            // Validate phone number
            if (!validator.isMobilePhone(req.body.phone.toString(), "any")) {
                return res.status(400).json({ error: "Invalid phone number" });
            }
            const hashedPassword = await COMMON.ENCRYPT(req.body.password);
            if (!hashedPassword) {
                return res
                    .status(500)
                    .json({ error: CONSTANT.MESSAGE_CONSTANT.SOMETHING_WENT_WRONG });
            }
            req.body.password = hashedPassword;
            const isExistEmployee = await Employee.findOne({
                where: {
                    email: req.body.email,
                },
            });
            if (!isExistEmployee) {
                const employee = await Employee.create(req.body, {
                    fields: inputFieldsEmployee,
                });
                if (employee) {
                    let sender = "rtpl@rtplgroup.com"
                    let subject = "Registeration Successfully Done";
                    let message = `UserID:${employee.emp_code}\nUrl:http://www.rptl.com `;

                    const result = await sendMail(req.body.email, sender, subject, message);
                    if (result.success) {
                        res.status(201).json({ message: "Receptionist registered successfully" });
                    } else {
                        res.status(400).json({ error: result.message });
                    }
                }
            } else {
                res
                    .status(400)
                    .json({ message: "Receptionist with this Email Already Exist" });
            }
        } else {
            console.log("Invalid perameter");
            res.status(400).json({ error: "Invalid perameter" });
        }
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: error.message });
    }
};

//get Data 
module.exports.getAllData = async (req, res) => {
    try {
        const { Employee, Company, Office, Department, Designation, EmployeeRole } = req.app.locals.models;

        const data = await Employee.findAll({
            include: [
                {
                    model: Company,
                    as: 'companyDetails',
                    attributes: ['companyID', 'Name', 'contact', 'email', 'isDeleted'],
                },
                {
                    model: Office,
                    as: 'officeDetails',
                    attributes: ['officeID', 'Address', 'companyID', 'isDeleted'],
                },
                {
                    model: Department,
                    as: 'employeeDepartment',
                    attributes: ['departmentID', 'department', 'isDeleted'],
                },
                {
                    model: Designation,
                    as: 'employeeDesignation',
                    attributes: ['designationID', 'designation', 'isDeleted'],
                },
                {
                    model: EmployeeRole,
                    as: 'role',
                    attributes: ['roleID', 'role', 'isDeleted'],
                },
            ],
        });

        if (data.length === 0) {
            return res.status(404).json({ message: "No Admins found" });
        }

        res.status(200).json({
            message: "data Fetched Successfully.",
            data: data,
        });
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: error.message });
    }
};

//get Admins
module.exports.getAdmins = async (req, res) => {
    try {
        const { Employee, Company, Office, Department, Designation, EmployeeRole } = req.app.locals.models;

        const nonAdminEmployees = await Employee.findAll({
            where: {
                isAdmin: true,
            },
            include: [
                {
                    model: Company,
                    as: 'companyDetails',
                    attributes: ['companyID', 'Name', 'contact', 'email', 'isDeleted'],
                },
                {
                    model: Office,
                    as: 'officeDetails',
                    attributes: ['officeID', 'Address', 'companyID', 'isDeleted'],
                },
                {
                    model: Department,
                    as: 'employeeDepartment',
                    attributes: ['departmentID', 'department', 'isDeleted'],
                },
                {
                    model: Designation,
                    as: 'employeeDesignation',
                    attributes: ['designationID', 'designation', 'isDeleted'],
                },
                {
                    model: EmployeeRole,
                    as: 'role',
                    attributes: ['roleID', 'role', 'isDeleted'],
                },
            ],
        });

        if (nonAdminEmployees.length === 0) {
            return res.status(404).json({ message: "No Admins found" });
        }

        res.status(200).json({
            message: "Admins Fetched Successfully.",
            data: nonAdminEmployees,
        });
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: error.message });
    }
};

// update employees details
module.exports.updateAdmin = async (req, res) => {
    try {
        const { Employee } = req.app.locals.models;
        const { id } = req.params;
        const updatedBy = req.decodedEmpCode;

        const employeeExists = await Employee.findByPk(id);
        if (!employeeExists) {
            return res
                .status(404)
                .json({ error: `Admin with id ${id} not found` });
        }

        COMMON.setModelUpdatedByFieldValue(req);

        req.body.updatedBy = updatedBy;

        await Employee.update(req.body, {
            where: { empID: id },
            fields: inputFieldsEmployee,
        });

        res.status(200).json({ message: "Admin updated successfully" });
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: error.message });
    }
};

// delete Admin
module.exports.deleteAdmin = async (req, res) => {
    try {
        const { Employee } = req.app.locals.models;
        if (req.params.id) {
            const empID = req.params.id;
            const employeeDetails = await Employee.findByPk(empID);
            if (employeeDetails) {
                await employeeDetails.update({
                    isDeleted: 1,
                    // deletedBy: req.user.empID  //pending to set deletion id of person
                });
                await employeeDetails.destroy();
                // Return a success response
                res.json({ message: "Admin deleted successfully." });
            } else {
                res.status(404).json({ error: `Admin with id ${empID} not found.` });
            }
        } else {
            console.log("Invalid perameter");
            // Return an error response indicating missing data
            res.status(400).json({ error: "Invalid perameter" });
        }
    } catch (error) {
        console.error("An error occurred:", error);
        // Return an error response
        res.status(500).json({ error: error.message });
    }
};
