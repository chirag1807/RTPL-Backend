const validator = require("validator");
const SendEmailService = require("../../Middleware/emaiService");
const COMMON = require("../../Common/common");
const { createAccessToken } = require("../../Middleware/auth");
const nodemailer = require("nodemailer");
const CONSTANT = require("../../constant/constant");
const inputFieldsEmployee = [
  "firstName",
  "lastName",
  "emp_code",
  "department",
  "destination",
  "email",
  "phone",
  "company",
  "Office",
  "password",
  "isActive",
  "isDeleted",
  "createdBy",
  "updatedBy",
  "deletedBy",
  // 'roleID'
];

// update employees details
module.exports.updateEmployee = async (req, res) => {
  try {
    const { Employee } = req.app.locals.models;
    const { id } = req.params;
    const updatedBy = req.decodedEmpCode;

    const employeeExists = await Employee.findByPk(id);
    if (!employeeExists) {
      return res
        .status(404)
        .json({ error: `Employee with id ${id} not found` });
    }

    COMMON.setModelUpdatedByFieldValue(req);

    req.body.updatedBy = updatedBy;

    await Employee.update(req.body, {
      where: { empID: id },
      fields: inputFieldsEmployee,
    });

    res.status(200).json({ message: "Employee updated successfully" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: error.message });
  }
};

// delete employees details
module.exports.deleteEmployee = async (req, res) => {
  try {
    const { Employee } = req.app.locals.models;
    const updatedBy = req.decodedEmpCode;
    if (req.params.id) {
      const empID = req.params.id;
      const employeeDetails = await Employee.findByPk(empID);
      if (employeeDetails) {
        await employeeDetails.update({
          isDeleted: 1,
          deletedBy: updatedBy
        });
        await employeeDetails.destroy();
        // Return a success response
        res.json({ message: "Employee deleted successfully." });
      } else {
        res.status(404).json({ error: `Employee with id ${empID} not found.` });
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

//get All Employees
module.exports.getNonAdminEmployees = async (req, res) => {
  try {
    const { Employee, Company, Office, Department, Designation, EmployeeRole } = req.app.locals.models;

    const nonAdminEmployees = await Employee.findAll({
      where: {
        isAdmin: false,
        isActive: true,
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
      return res.status(404).json({ message: "No employees found" });
    }

    res.status(200).json({
      message: "Employees Fetched Successfully.",
      data: nonAdminEmployees,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: error.message });
  }
};

//get Employee By Id
module.exports.getNonAdminEmployeesById = async (req, res) => {
  try {
    const { Employee, Company, Office, Department, Designation, EmployeeRole } = req.app.locals.models;
    const { empID } = req.params;

    const nonAdminEmployees = await Employee.findAll({
      where: {
        isAdmin: false,
        isActive: true,
        empID: empID,
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
      return res.status(404).json({ message: "No employees found" });
    }

    res.status(200).json({
      message: "Employees Fetched Successfully.",
      data: nonAdminEmployees,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: error.message });
  }
};

// Activate an employee by empID
module.exports.activateEmployee = async (req, res) => {
  try {
    const { Employee } = req.app.locals.models;
    const { empID, isActive } = req.body;
    const updatedBy = req.decodedEmpCode;

    if (!empID) {
      return res.status(400).json({ error: "empID is required" });
    }

    const employee = await Employee.findOne({ where: { empID } });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update isActive to true
    await Employee.update({ isActive: isActive, updatedBy: updatedBy }, { where: { empID } });

    res.status(200).json({ message: "Employee activated successfully." });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: error.message });
  }
};