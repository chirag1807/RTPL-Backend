const validator = require("validator");
const COMMON = require("../../Common/common");
const CONSTANT = require("../../constant/constant");
const sendMail = require("../../Middleware/emaiService");
const { createAccessToken } = require("../../Middleware/auth");

const inputFieldsEmployee = [
  "empProfileImg",
  "empIdCard",
  "empAadharCard",
  "permissions",
  "aadharNumber",
  "firstName",
  "lastName",
  "emp_code",
  "birthDate",
  "anniversaryDate",
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

module.exports.addAdmin = async (req, res) => {
  try {
    const { Employee } = req.app.locals.models;

    if (req.body) {
      const createdBy = req.decodedEmpCode;

      req.body.isAdmin = true;
      req.body.isActive = true;
      req.body.createdBy = createdBy;
      if (!validator.isEmail(req.body.email)) {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Invalid email id, please provide valid email id",
        });
      }
      if (!validator.isMobilePhone(req.body.phone.toString(), "any")) {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Invalid phone number, please provide valid phone number",
        });
      }
      const hashedPassword = await COMMON.ENCRYPT(req.body.password);
      if (!hashedPassword) {
        return res.status(500).json({
          response_type: "FAILED",
          data: {},
          error: CONSTANT.MESSAGE_CONSTANT.SOMETHING_WENT_WRONG,
        });
      }
      req.body.password = hashedPassword;

      const isExistEmployeeCode = await Employee.findOne({
        where: {
          emp_code: req.body.emp_code,
        },
      });
      if (isExistEmployeeCode) {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Admin with this Employee Code Already Exist.",
        });
      }
      const isExistEmailId = await Employee.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (isExistEmailId) {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Admin with this Email Id Already Exist.",
        });
      }
      const isExistPhoneNo = await Employee.findOne({
        where: {
          phone: req.body.phone,
        },
      });
      if (isExistPhoneNo) {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Admin with this Phone No Already Exist.",
        });
      }
      const isExistAadharNo = await Employee.findOne({
        where: {
          aadharNumber: req.body.aadharNumber,
        },
      });
      if (isExistAadharNo) {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Admin with this Aadhar No Already Exist.",
        });
      }

      req.body.empAadharCard = req.files.empAadharCard[0].path;
      req.body.empIdCard = req.files.empIdCard[0].path;
      req.body.empProfileImg = req.files.empProfileImg[0].path;

      if (Array.isArray(req.body.permissions)) {
        req.body.permissions = req.body.permissions.join(",");
      }

      const employee = await Employee.create(req.body, {
        fields: inputFieldsEmployee,
      });
      if (employee) {
        let sender = "rtpl@rtplgroup.com";
        let subject = "Registeration Successfully Done";
        let message = `UserID:${employee.emp_code}\nUrl:http://www.rptl.com `;

        const result = await sendMail(req.body.email, sender, subject, message);
        if (result.success) {
          const token = createAccessToken(employee.dataValues);
          res.setHeader("Authorization", `Bearer ${token}`);
          res.status(200).json({
            response_type: "SUCCESS",
            data: {},
            message: "Admin registered successfully",
          });
        } else {
          res.status(400).json({
            response_type: "FAILED",
            data: {},
            message: result.message,
          });
        }
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
    console.error("An error occurred:", error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};

// addReceptionist
module.exports.addReceptionist = async (req, res) => {
  try {
    const { Employee } = req.app.locals.models;
    const createdBy = req.decodedEmpCode;

    if (req.body) {
      req.body.isRecept = true;
      req.body.isActive = true;
      req.body.createdBy = createdBy;
      if (!validator.isEmail(req.body.email)) {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Invalid email id, please provide valid email id",
        });
      }
      if (!validator.isMobilePhone(req.body.phone.toString(), "any")) {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Invalid phone number, please provide valid phone number",
        });
      }
      const hashedPassword = await COMMON.ENCRYPT(req.body.password);
      if (!hashedPassword) {
        return res.status(500).json({
          response_type: "FAILED",
          data: {},
          message: CONSTANT.MESSAGE_CONSTANT.SOMETHING_WENT_WRONG,
        });
      }
      req.body.password = hashedPassword;

      const isExistEmployeeCode = await Employee.findOne({
        where: {
          emp_code: req.body.emp_code,
        },
      });
      if (isExistEmployeeCode) {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Admin with this Employee Code Already Exist.",
        });
      }
      const isExistEmailId = await Employee.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (isExistEmailId) {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Admin with this Email Id Already Exist.",
        });
      }
      const isExistPhoneNo = await Employee.findOne({
        where: {
          phone: req.body.phone,
        },
      });
      if (isExistPhoneNo) {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Admin with this Phone No Already Exist.",
        });
      }
      const isExistAadharNo = await Employee.findOne({
        where: {
          aadharNumber: req.body.aadharNumber,
        },
      });
      if (isExistAadharNo) {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Admin with this Aadhar No Already Exist.",
        });
      }

      req.body.empAadharCard = req.files.empAadharCard[0].path;
      req.body.empIdCard = req.files.empIdCard[0].path;
      req.body.empProfileImg = req.files.empProfileImg[0].path;

      const employee = await Employee.create(req.body, {
        fields: inputFieldsEmployee,
      });
      if (employee) {
        let sender = "rtpl@rtplgroup.com";
        let subject = "Registeration Successfully Done";
        let message = `UserID:${employee.emp_code}\nUrl:http://www.rptl.com `;

        const result = await sendMail(req.body.email, sender, subject, message);
        if (result.success) {
          const token = createAccessToken(employee.dataValues);
          res.setHeader("Authorization", `Bearer ${token}`);
          res.status(200).json({
            response_type: "SUCCESS",
            data: {},
            message: "Receptionist registered successfully",
          });
        } else {
          res.status(400).json({
            response_type: "FAILED",
            data: {},
            message: result.message,
          });
        }
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
    console.error("An error occurred:", error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};

//get Data
module.exports.getAllData = async (req, res) => {
  try {
    const { Employee, Company, Office, Department, Designation, EmployeeRole } =
      req.app.locals.models;

    const data = await Employee.findAll({
      include: [
        {
          model: Company,
          as: "companyDetails",
          attributes: ["companyID", "Name", "contact", "email", "isDeleted"],
        },
        {
          model: Office,
          as: "officeDetails",
          attributes: ["officeID", "Address", "companyID", "isDeleted"],
        },
        {
          model: Department,
          as: "employeeDepartment",
          attributes: ["departmentID", "department", "isDeleted"],
        },
        {
          model: Designation,
          as: "employeeDesignation",
          attributes: ["designationID", "designation", "isDeleted"],
        },
        {
          model: EmployeeRole,
          as: "role",
          attributes: ["roleID", "role", "isDeleted"],
        },
      ],
    });

    if (data.length === 0) {
      return res.status(404).json({
        response_type: "FAILED",
        data: {},
        message: "No Admins found",
      });
    }

    res.status(200).json({
      response_type: "SUCCESS",
      message: "data Fetched Successfully.",
      data: data,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};

//get Employee By Id
module.exports.getAdmins = async (req, res) => {
  try {
    const { Employee, Company, Office, Department, Designation, EmployeeRole } =
      req.app.locals.models;

    const data = await Employee.findAll({
      include: [
        {
          model: Company,
          as: "companyDetails",
          attributes: ["companyID", "Name", "contact", "email", "isDeleted"],
        },
        {
          model: Office,
          as: "officeDetails",
          attributes: ["officeID", "Address", "companyID", "isDeleted"],
        },
        {
          model: Department,
          as: "employeeDepartment",
          attributes: ["departmentID", "department", "isDeleted"],
        },
        {
          model: Designation,
          as: "employeeDesignation",
          attributes: ["designationID", "designation", "isDeleted"],
        },
        {
          model: EmployeeRole,
          as: "role",
          attributes: ["roleID", "role", "isDeleted"],
        },
      ],
    });

    if (data.length === 0) {
      return res.status(404).json({
        response_type: "FAILED",
        data: {},
        message: "No Admins found",
      });
    }

    res.status(200).json({
      response_type: "SUCCESS",
      message: "data Fetched Successfully.",
      data: data,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};

//get Admins
module.exports.getAdmins = async (req, res) => {
  try {
    const { Employee, Company, Office, Department, Designation, EmployeeRole } =
      req.app.locals.models;

    let { page, pageSize, sort, sortBy, searchField, isActive } = req.query;

    page = Math.max(1, parseInt(page, 10)) || 1;
    pageSize = Math.max(1, parseInt(pageSize, 10)) || 10;

    const offset = (page - 1) * pageSize;

    sort = sort ? sort.toUpperCase() : "ASC";

    const queryOptions = {
      limit: pageSize,
      offset: offset,
      include: [],
    };

    if (sortBy) {
      queryOptions.order = [[sortBy, sort]];
    }

    if (
      searchField &&
      typeof searchField === "string" &&
      searchField.trim() !== ""
    ) {
      queryOptions.where = {
        [Op.or]: [
          { aadharNumber: { [Op.like]: `%${searchField}%` } },
          { firstName: { [Op.like]: `%${searchField}%` } },
          { lastName: { [Op.like]: `%${searchField}%` } },
          { emp_code: { [Op.like]: `%${searchField}%` } },
          { birthDate: { [Op.like]: `%${searchField}%` } },
          { anniversaryDate: { [Op.like]: `%${searchField}%` } },
          { email: { [Op.like]: `%${searchField}%` } },
          { phone: { [Op.like]: `%${searchField}%` } },
        ],
      };
    }

    queryOptions.include.push(
      {
        model: Company,
        as: "companyDetails",
        attributes: ["companyID", "Name", "contact", "email", "isDeleted"],
      },
      {
        model: Office,
        as: "officeDetails",
        attributes: ["officeID", "Address", "companyID", "isDeleted"],
      },
      {
        model: Department,
        as: "employeeDepartment",
        attributes: ["departmentID", "department", "isDeleted"],
      },
      {
        model: Designation,
        as: "employeeDesignation",
        attributes: ["designationID", "designation", "isDeleted"],
      },
      {
        model: EmployeeRole,
        as: "role",
        attributes: ["roleID", "role", "isDeleted"],
      }
    );

    queryOptions.where = {
      ...queryOptions.where,
      isActive: isActive ? isActive : true,
      isAdmin: true,
    };

    const totalCount = await Employee.count({
      where: queryOptions.where,
    });
    const totalPage = Math.ceil(totalCount / pageSize);

    const nonAdminEmployees = await Employee.findAll(queryOptions);

    if (nonAdminEmployees.length === 0) {
      return res.status(200).json({
        totalPage: 0,
        currentPage: 0,
        response_type: "SUCCESS",
        message: "Admins Fetched Successfully.",
        data: { nonAdminEmployees: [] },
      });
    }

    res.status(200).json({
      totalPage: totalPage,
      currentPage: page,
      response_type: "SUCCESS",
      message: "Admins Fetched Successfully.",
      data: { nonAdminEmployees: nonAdminEmployees },
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
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
      return res.status(404).json({
        response_type: "FAILED",
        data: {},
        message: `Admin with id ${id} not found`,
      });
    }

    COMMON.setModelUpdatedByFieldValue(req);

    const hashedPassword = await COMMON.ENCRYPT(req.body.password);
    if (!hashedPassword) {
      return res.status(500).json({
        response_type: "FAILED",
        data: {},
        message: CONSTANT.MESSAGE_CONSTANT.SOMETHING_WENT_WRONG,
      });
    }
    req.body.password = hashedPassword;

    req.body.updatedBy = updatedBy;

    await Employee.update(req.body, {
      where: { empId: id },
      fields: inputFieldsEmployee,
    });

    res.status(200).json({
      response_type: "SUCCESS",
      data: {},
      message: "Admin updated successfully",
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};

// delete Admin
module.exports.deleteAdmin = async (req, res) => {
  try {
    const { Employee } = req.app.locals.models;
    const updatedBy = req.decodedEmpCode;
    if (req.params.id) {
      const empId = req.params.id;
      const employeeDetails = await Employee.findByPk(empId);
      if (employeeDetails) {
        await employeeDetails.update({
          isDeleted: 1,
          isActive: 0,
          deletedBy: updatedBy,
        });
        await employeeDetails.destroy();
        // Return a success response
        res.status(200).json({
          response_type: "SUCCESS",
          data: {},
          message: "Admin deleted successfully.",
        });
      } else {
        res.status(404).json({
          response_type: "FAILED",
          data: {},
          message: `Admin with id ${empId} not found.`,
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
    console.error("An error occurred:", error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};

module.exports.superAdminPermissions = async (req, res) => {
  try {
    const { Employee } = req.app.locals.models;
    const updatedBy = req.decodedEmpCode;
    if (req.params.id) {
      const empId = req.params.id;
      const employeeDetails = await Employee.findByPk(empId);
      if (employeeDetails) {
        await employeeDetails.update({
          permissions: req.body.permissions,
          updatedBy: updatedBy,
        });
        res.status(200).json({
          response_type: "SUCCESS",
          data: {},
          message: "Admin permission added successfully.",
        });
      } else {
        res.status(404).json({
          response_type: "FAILED",
          data: {},
          message: `Admin with id ${empId} not found.`,
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
    console.error("An error occurred:", error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};
