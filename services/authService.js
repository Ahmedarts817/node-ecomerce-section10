const asyncHandler = require("express-async-handler");
const ApiError = require('../middlewares/errorMiddleware')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const createToken  = require('../utils/createToken')
const crypto = require('crypto')



//@des   signup 
//@route /api/v2/auth/login
//@access  public
exports.sigup = asyncHandler(async(req,res,next)=>{
    //create new user
    const user = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.passsword,
    })
    //create jwt token
const token = createToken(user._id)
res.status(200).send({data:user, token})

})
//@des   login 
//@route /api/v2/auth/login
//@access  public

exports.signin = asyncHandler(async(req,res,next)=>{
//  verify that user with email exists
const user = await User.findOne({email:req.body.email})
// verify password
const truePassword = await bcrypt.compare(req.body.password,user.password)
if(!user || !truePassword){
    return next(new ApiError('Email orr password is incorrect',401))
}
// create token
const token = createToken(user._id)
res.status(200).json({data:user},token)
})

exports.protected = asyncHandler(async(req,res,next)=>{
    //check token exists ,catch token from req
    let token;
    if(req.headers.authentication && req.headers.authentication.startsWith('bearer')){
        token = req.headers.authentication.split(' ')[1]
    }
    if(!token){
        return next(new ApiError('you are not logged in',401))
    }
    //verify token valid and not expired
    const decoded = jwt.verify(token, process.env.SECRET_KEY)

    //check user exists
    const currentUser = await User.findById(decoded.userid)
    if(!currentUser){
        return next(new ApiError('user with this token is no longer exists'))
    }
    // ceck if user change password
    if(currentUser.passwordChangedAt){
     const changedPasswordTimestamp = parseInt(currentUser.passwordChangedAt.getTime() /1000, 10)
    
    if(changedPasswordTimestamp > decoded.iat){
       return next(new ApiError('please log in, password changed earlier'))
    }
    }
    req.user = currentUser
    next()
  
})

//@ des forget password 
//@ route api/v1/auth/forgetPassword
//@ access public

exports.forgetPassword = asyncHandler(async(req,res, next)=>{
//1) get user by Email
const user = await User.findOne({email:req.body.email})
if(!user){
    return next(new ApiError(`no user with this email ${req.bbody.email} `,404))
}

//2) if user exists generate hash random 6 digit code and save it to db
const resetCode = Math.floor(100000 + Math.random( * 900000)).toString();
const hashedResetCode = crypto
.createHash(sha256)
.update(resetCode)
.digest(hex)
// save hashed password into db 
user.passwordResetCode = hashedResetCode;
user.passwordResetExpires = Date.now() + 10*60*1000;
user.passwordResetVerify = false;
await user.save();
//3)send the reset code via email
const message = `Hi ${user.name}, \n We received a request to reset password in your  accoun at E-shop . \n ${resetCode} \n please enter reset code \n thanks E-shop team `
try{
await sendEmail({
    email: user.email,
    subject:'Your password reset code(valid for 10 mins)',
    message,
});
} catch(err){
user.passwordResetCode = undefined;
user.passwordResetExpires = undefined;
user.passwordResetVerify = undefined;
await user.save();
return next(new Apierror('there is an error while sending emial',500))
}

res.status(200).json({
    status:'Success', message:'reset code sent successfuly'
})

})