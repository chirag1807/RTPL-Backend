const { Op } = require("sequelize");

const inputFieldsCompany = [
  "Name",
  "contact",
  "email",
  "createdBy",
  "updatedBy",
  "deletedBy",
];

module.exports.addCompany = async (req, res) => {
  try {
    const { Company } = req.app.locals.models;
    const createdBy = req.decodedEmpCode;
    // get value of CreatedBy
    // COMMON.setModelCreatedByFieldValue(req);
    // check createdBy is admin or not (means put this condition in below if condition.)
    if (req.body) {
      req.body.createdBy = createdBy;
      const comapany = await Company.create(req.body, {
        fields: inputFieldsCompany,
      });
      if (comapany) {
        res.status(200).json({
          response_type: "SUCCESS",
          data: {},
          message: "Your company has been registered successfully.",
        });
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message:
            "Sorry, Your company has not registered. Please try again later",
        });
      }
    } else {
      console.log("Invalid perameter");
      res.status(400).json({
        message: "Invalid perameter",
        response_type: "FAILED",
        data: {},
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      response_type: "FAILED",
      data: {},
    });
  }
};

module.exports.getCompanies = async (req, res) => {
  try {
    const { Company } = req.app.locals.models;
    let { page, pageSize, sort, sortBy, searchField, isActive } = req.query;

    page = Math.max(1, parseInt(page, 10)) || 1;
    pageSize = Math.max(1, parseInt(pageSize, 10)) || 10;

    const offset = (page - 1) * pageSize;

    // Ensure sortOrder is either 'ASC' or 'DESC', default to 'ASC' if undefined
    sort = sort ? sort.toUpperCase() : "ASC";

    const queryOptions = {
      limit: pageSize,
      offset: offset,
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
          { Name: { [Op.like]: `%${searchField}%` } },
          { contact: { [Op.like]: `%${searchField}%` } },
          { email: { [Op.like]: `%${searchField}%` } },
        ],
      };
    }

    queryOptions.where = {
      ...queryOptions.where,
      isActive: isActive ? isActive : true,
    };

    const totalCount = await Company.count({
      where: queryOptions.where,
    });
    const totalPage = Math.ceil(totalCount / pageSize);
    
    const company = await Company.findAll(queryOptions);

    if (company) {
      res.status(200).json({
        response_type: "SUCCESS",
        message: "Companies Fetched Successfully.",
        totalPage: totalPage,
        currentPage: page,
        data: {
          company: company,
        },
      });
    } else {
      res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "Companies Can't be Fetched, Please Try Again Later.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: {},
      response_type: "FAILED",
      message: error.message,
    });
  }
};

module.exports.getCompanyByID = async (req, res) => {
  try {
    const { Company } = req.app.locals.models;
    if (req.params) {
      const { companyID } = req.params;
      const company = await Company.findOne({
        where: {
          companyID,
          //  isActive: true
        },
      });

      if (company) {
        res.status(200).json({
          response_type: "SUCCESS",
          message: "Company Fetched Successfully.",
          data: {
            company: company,
          },
        });
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Company Can't be Fetched, Please Try Again Later.",
        });
      }
    } else {
      console.log("Invalid perameter");
      res.status(400).json({
        response_type: "FAILED",
        data: {},
        error: "Invalid perameter",
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

module.exports.updatedCompany = async (req, res) => {
  try {
    const { Company } = req.app.locals.models;
    // get value of updatedBy
    // COMMON.setModelUpdatedByFieldValue(req);
    const updatedBy = req.decodedEmpCode;
    if (req.params && req.body) {
      const { companyID } = req.params;
      req.body.updatedBy = updatedBy;

      const company = await Company.findByPk(companyID);

      if (!company) {
        return res
          .status(404)
          .json({ error: "Company not found for the given ID" });
      }

      const updatedCompany = await Company.update(req.body, {
        where: { companyID: companyID },
        fields: inputFieldsCompany,
      });

      if (updatedCompany) {
        res.status(200).json({
          response_type: "SUCCESS",
          data: {},
          message: "Company has been Updated Successfully.",
        });
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Company has not been Updated, Please Try Again Later.",
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

module.exports.deleteCompany = async (req, res) => {
  try {
    const { Company } = req.app.locals.models;
    const updatedBy = req.decodedEmpCode;

    if (req.params) {
      const { companyID } = req.params;

      const updatedCompany = await Company.update(
        { deletedBy: updatedBy, isDeleted: true, isActive: false },
        { where: { companyID: companyID } }
      );

      if (updatedCompany) {
        const deletedCompany = await Company.destroy({
          where: { companyID: companyID },
        });

        if (deletedCompany) {
          res.status(200).json({
            response_type: "SUCCESS",
            data: {},
            message: "Company has been Deleted Successfully.",
          });
        } else {
          res.status(400).json({
            response_type: "FAILED",
            data: {},
            message: "Company deletion failed.",
          });
        }
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Company update failed.",
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
    console.error(error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};
