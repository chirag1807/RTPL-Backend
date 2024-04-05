const jwt = require('jsonwebtoken');
const CONSTANT = require('../constant/constant');
const catchAsyncErrors = require('./catchAsyncErrors');

// Authentication middleware
exports.authenticateToken = (req, res, next) => {
  const { Employee } = req.app.locals.models;
  const token = req.headers[CONSTANT.LABEL_CONSTANT.AUTH.AUTHORIZATION].split(' ')[1];
  if (!token) return res.status(401).json({ error: CONSTANT.MESSAGE_CONSTANT.TOKEN_NOT_FOUND });

  jwt.verify(token, CONSTANT.JWT.SECRET, async (err, user) => {
    if (err) return res.status(401).json({ error: CONSTANT.MESSAGE_CONSTANT.INVALID_TOKEN });
    const userDetails = await Employee.findByPk(user.empId);
    if (userDetails && userDetails.dataValues.isActive){
      req.decodedEmpCode = userDetails.dataValues.emp_code;
      req.decodedEmpId = userDetails.dataValues.empId
      req.user = userDetails;
      next();
    }
    else {
      return res.status(401).json({ error: CONSTANT.MESSAGE_CONSTANT.INVALID_TOKEN });
    }
  });
};

exports.createAccessToken = (user) => {
  let permissionsArray;
  if(user.permissions && user.permissions.length > 0){
    permissionsArray = user.permissions.split(',').map(Number);
  }

  const tokenPayload = {
    ...user,
    permissions: permissionsArray,
  };

  return jwt.sign(tokenPayload, CONSTANT.JWT.SECRET, { expiresIn: '7d' });
};

exports.createRefreshToken = (req, res, next) => {
  req.body.auth = jwt.sign({ empId: 124, empCode: 321, Name: 'ROOT JAS' }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
  next();
}

exports.isSuper = catchAsyncErrors(async (req, res, next) => {
  const tokenjwt = req.headers.authorization.split(' ')[1];

  if (!tokenjwt) {
    return res.status(401).send({ error: "Please login to access the resources" });
  }

  const decodedData = jwt.verify(tokenjwt, CONSTANT.JWT.SECRET);

  if (decodedData.isAdmin) {
    req.decodedEmpCode = decodedData.emp_code;

    if (decodedData.emp_code === process.env.superadmin) {
      next();
    } else {
      return res.status(403).send({ error: "Access Denied!" });
    }
  } else {
    return res.status(403).send({ error: "Access Denied!" });
  }
});

exports.isAdmin = (id) => catchAsyncErrors(async (req, res, next) => {

  const tokenjwt = req.headers.authorization.split(' ')[1];

  if (!tokenjwt) {
    return res.status(401).send({ error: "Please login to access the resources" });
  }

  const decodedData = jwt.verify(tokenjwt, CONSTANT.JWT.SECRET);

  if (decodedData.emp_code === process.env.superadmin || (decodedData.isAdmin && decodedData?.permissions?.includes(id))) {
    req.decodedEmpCode = decodedData.emp_code;
    next();
  }
  else {
    return res.status(403).send({ error: "Access Denied!" });
  }

});

exports.isRecept = catchAsyncErrors(async (req, res, next) => {

  const tokenjwt = req.headers.authorization.split(' ')[1];

  if (!tokenjwt) {
    return res.status(401).send({ error: "Please login to access the resources" });
  }

  const decodedData = jwt.verify(tokenjwt, CONSTANT.JWT.SECRET);

  if (decodedData.isRecept) {
    req.decodedEmpCode = decodedData.emp_code;
    next();
  } else {
    return res.status(403).send({ error: "Only Receptionist can access this resource" });
  }

});

exports.isActive = catchAsyncErrors(async (req, res, next) => {

  const tokenjwt = req.headers.authorization.split(' ')[1];

  if (!tokenjwt) {
    return res.status(401).send({ error: "Please login to access the resources" });
  }

  const decodedData = jwt.verify(tokenjwt, CONSTANT.JWT.SECRET);
  if (decodedData.isActive) {
    req.decodedEmpCode = decodedData.emp_code;
    req.decodedEmpId = decodedData.empId
    console.log(decodedData.emp_code);
    next();
  } else {
    return res.status(403).send({ error: "Wait While Admin Grant Access" });
  }

});