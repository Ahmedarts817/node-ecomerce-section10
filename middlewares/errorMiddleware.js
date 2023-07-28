const { JsonWebTokenError, TokenExpiredError } = require("jsonwebtoken");

const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const handleInvalidTokenError = ()=> new ApiError('please log in, nvalid user token',401)
const handleExpiredTokenError = ()=> new ApiError('please log in, expired user token',401)

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorForDev(err, res);
  } else {
    if(err.name == JsonWebTokenError) err = handleInvalidTokenError()
    if(err.name == TokenExpiredError) err = handleExpiredTokenError()
    sendErrorForProd(err, res);
  }
};

module.exports = globalError;
