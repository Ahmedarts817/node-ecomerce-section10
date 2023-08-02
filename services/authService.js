const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const createToken = require("../utils/createToken");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

//@des   signup
//@route post /api/v1/auth/login
//@access  public
exports.sigup = asyncHandler(async (req, res, next) => {
  //create new user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  //create jwt token
  const token = createToken(user._id);
  res.status(200).send({ data: user, token });
});
//@des   login
//@route post /api/v2/auth/login
//@access  public

exports.signin = asyncHandler(async (req, res, next) => {
  //  verify that user with email exists
  const user = await User.findOne({ email: req.body.email });
  // verify password
  if (!user || !await bcrypt.compare(req.body.password,
    user.password)) {
    return next(new ApiError("Email or password is incorrect", 401));
  }
  // delete password from response
  // delete user._doc.password;
  // create token
  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

//@desc make sure user is logged in
exports.protected = asyncHandler(async (req, res, next) => {
  //check token exists ,catch token from req
  let token;
  if (
    req.headers.authentication &&
    req.headers.authentication.startsWith("Bearer")
  ) {
    token = req.headers.authentication.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("you are not logged in", 401));
  }
  //verify token valid and not expired
  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  //check user exists
  const currentUser = await User.findById(decoded.userid);
  if (!currentUser) {
    return next(new ApiError("user with this token is no longer exists", 401));
  }
  // ceck if user change password
  if (currentUser.passwordChangedAt) {
    const changedPasswordTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // password changed error
    if (changedPasswordTimestamp > decoded.iat) {
      return next(new ApiError("please log in, password changed earlier", 401));
    }
  }
  req.user = currentUser;
  next();
});

//@desc Authorization (User Permissions)
//["admin","ma,ager"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("you are not authorized to access this route", 403)
      );
    }
    next();
  });

//@desc forget password
//@route post /api/v1/auth/forgetPassword
//@access public

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  //1) get user by Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`no user with this email ${req.body.email} `, 404)
    );
  }

  //2) if user exists generate hash random 6 digit code and save it to db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto.SHA256(resetCode);
  // save hashed password into db
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerify = false;
  await user.save();
  //3)send the reset code via email
  const message = `Hi ${user.name}, \n We received a request to reset password in your  accoun at E-shop . \n ${resetCode} \n please enter reset code \n thanks E-shop team `;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code(valid for 10 mins)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerify = undefined;
    await user.save();
    return next(new ApiError("there is an error while sending email", 500));
  }

  res.status(200).json({
    status: "Success",
    message: "reset code sent successfuly",
  });
});


// @desc verify reset password reset code 
// @route /api/va/auth/verifyResetCode
// @access public
exports.verifyResetCode = asyncHandler(async(req,res,next)=>{
  //1) get user based on reset code
  const hashedCode = crypto.SHA256(resetCode);
const user = await User.findOne({hashedResetCode:hashedCode,
  passwordResetExpires:{$gt:Date.now()}
})
if(!user){
  return next(new ApiError('invalid or expired reset code'))
}
//2) reset code valid
user.passwordResetVerify = true
await user.save();
res.status(200).json({status:'sucess'})

})

//@ desc reset password
//@route /api/v1/auth/resetPassword
//@access public
exports.resetPassword = asyncHandler(async(req,res,next)=>{
 //1)get user based on email
 const user = await User.findOne({email: req.body.email})
 if(!user){
  return next(new ApiError(`no user with this email ${req.body.email}`,404))
 }
//2) check reset code if verified
 if(!user.passwordResetVerify){
  return next(new ApiError(`rest code not verified`,404))
 }
 user.password = req.body.newPassord
 user.passwordResetCode =undefined
 user.passwordResetExpires =undefined
 user.passwordResetVerify =undefined
 user.passwordChangedAt = Date.now()
 // if everything is ok generate token
 let token = createToken(user._id)
 res.status(200).json({status:'success', token})
})