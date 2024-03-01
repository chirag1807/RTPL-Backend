const { Op } = require("sequelize");

const inputFieldsOffice = [
  "companyID",
  "Address",
  "createdBy",
  "updatedBy",
  "deletedBy",
];

module.exports.addOffice = async (req, res) => {
  try {
    const { Office } = req.app.locals.models;
    // get value of CreatedBy
    // COMMON.setModelCreatedByFieldValue(req);
    // check createdBy is admin or not (put this condition below)
    const updatedBy = req.decodedEmpCode;
    if (req.body) {
      req.body.createdBy = updatedBy;
      const office = await Office.create(req.body, {
        fields: inputFieldsOffice,
      });
      if (office) {
        res.status(200).json({
          response_type: "SUCCESS",
          data: {},
          message: "Your office has been registered successfully.",
        });
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message:
            "Sorry, Your office has not been registered. Please try again later.",
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

module.exports.updateOffice = async (req, res) => {
  try {
    const { Office } = req.app.locals.models;
    const { officeID } = req.params;
    const updatedBy = req.decodedEmpCode;

    if (!officeID || !req.body.Address) {
      return res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "Invalid parameter or missing Address in the request body.",
      });
    }

    const office = await Office.findByPk(officeID);

    if (!office) {
      return res.status(404).json({
        response_type: "FAILED",
        data: {},
        message: "Office not found for the given ID.",
      });
    }

    const updatedOffice = await office.update({
      updatedBy: updatedBy,
      Address: req.body.Address,
    });

    if (updatedOffice) {
      res.status(200).json({
        response_type: "SUCCESS",
        data: {},
        message: "Office address has been updated successfully.",
      });
    } else {
      res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "Failed to update office address.",
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

module.exports.getOfficesByCompany = async (req, res) => {
  try {
    const { Company, Office } = req.app.locals.models;
    const { companyID } = req.params;

    if (!companyID) {
      return res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "Missing companyID in request parameters.",
      });
    }

    let { sort, sortBy, searchField, isActive } = req.query;

    // Ensure sortOrder is either 'ASC' or 'DESC', default to 'ASC' if undefined
    sort = sort ? sort.toUpperCase() : "ASC";

    const queryOptions = {
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
        [Op.or]: [{ Address: { [Op.like]: `%${searchField}%` } }],
      };
    }

    queryOptions.where = {
      ...queryOptions.where,
      companyID: companyID,
      isActive: isActive ? isActive : true,
    };

    queryOptions.include.push({
      model: Company,
      as: "company",
    });

    const offices = await Office.findAll(queryOptions);

    res.status(200).json({
      response_type: "SUCCESS",
      message: "Offices Fetched Successfully.",
      data: {
        offices: offices,
      },
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

module.exports.getOffices = async (req, res) => {
  try {
    const { Company, Office } = req.app.locals.models;

    let { sort, sortBy, searchField, isActive } = req.query;

    // Ensure sortOrder is either 'ASC' or 'DESC', default to 'ASC' if undefined
    sort = sort ? sort.toUpperCase() : "ASC";

    const queryOptions = {
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
        [Op.or]: [{ Address: { [Op.like]: `%${searchField}%` } }],
      };
    }

    queryOptions.include.push({
      model: Company,
      as: "company",
    });

    queryOptions.where = {
      ...queryOptions.where,
      isActive: isActive ? isActive : true,
    };

    const offices = await Office.findAll(queryOptions);

    if (offices) {
      res.status(200).json({
        response_type: "SUCCESS",
        message: "Offices Fetched Successfully.",
        data: {
          offices: offices,
        },
      });
    } else {
      res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "Offices Can't be Fetched, Please Try Again Later.",
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

module.exports.getOfficeByID = async (req, res) => {
  try {
    const { Company, Office } = req.app.locals.models;
    if (req.params) {
      const { officeID } = req.params;
      const office = await Office.findAll({
        where: {
          officeID,
          // isActive: true
        },
        include: [{ model: Company, as: "company" }],
      });

      if (office) {
        res.status(200).json({
          response_type: "SUCCESS",
          message: "Office Fetched Successfully.",
          data: {
            office: office,
          },
        });
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Office Can't be Fetched, Please Try Again Later.",
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

module.exports.deleteOffice = async (req, res) => {
  try {
    const { Office } = req.app.locals.models;
    const { officeID } = req.params;
    const updatedBy = req.decodedEmpCode;

    if (!officeID) {
      return res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "Missing officeID in request parameters.",
      });
    }

    const office = await Office.findByPk(officeID);

    if (!office) {
      return res.status(404).json({
        response_type: "FAILED",
        data: {},
        message: "Office not found for the given ID.",
      });
    }

    const updatedOffice = await office.update({
      deletedBy: updatedBy,
      isDeleted: true,
      isActive: false,
    });

    if (updatedOffice) {
      const deletedOffice = await office.destroy();

      if (deletedOffice) {
        res.status(200).json({
          response_type: "SUCCESS",
          data: {},
          message: "Office has been deleted successfully.",
        });
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Failed to delete office.",
        });
      }
    } else {
      res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "Failed to update office status.",
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
