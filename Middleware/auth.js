const jwt = require('jsonwebtoken');
const config = require('./../config');
const CONSTANT = require('../constant/constant');
const {LABEL_CONSTANT} = require('../constant/constant');
// Authentication middleware
exports.authenticateToken = (req, res, next) => {
    const {Employee} = req.app.locals.models;
    const token = req.headers[CONSTANT.LABEL_CONSTANT.AUTH.AUTHORIZATION].split(' ')[1];
    if (!token) return res.status(401).json({ error: MESSAGE_CONSTANT.TOKEN_NOT_FOUND });

    jwt.verify(token,CONSTANT.JWT.SECRET, async (err, user) => {
      if (err) return res.status(403).json({ error: MESSAGE_CONSTANT.INVALID_TOKEN});
      const userDetails = await Employee.findByPk(user.empID);
      req.user = userDetails;
      next();
    });
  };

exports.createAccessToken = (user) =>{
    return jwt.sign(user,CONSTANT.JWT.SECRET, {expiresIn: '7d'})
}
exports.createRefreshToken = (req,res,next) =>{
    req.body.auth =  jwt.sign({empID:124,empCode:321,Name:'ROOT JAS'}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
    next();
}
