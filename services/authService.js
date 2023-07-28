const asyncHandler = require("express-async-handler");
const ApiError = require('../middlewares/errorMiddleware')
const bcrypt = require('bcryptjs')
const  jwt = require('jsonwebtoken')
const User = require('../models/userModel')



const tokenMaker = (payload)=>{
 jwt.sign({userid:payload},process.env.SECRET_KEY,{expiresIn:process.env.JWT_EXPIRE})
}

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
const token = tokenMaker(user._id)
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
const token = tokenMaker(user._id)
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