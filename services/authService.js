const asyncHandler = require("express-async-handler");
const ApiError = require('../middlewares/errorMiddleware')
const bcrypt = require('bcryptjs')
const  jwt = require('jsonwebtoken')
const User = require('../models/userModel')

exports.signUp = asyncHadler(async(req,res,next)=>{
    //create new user
    const user = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.passsword,
    })
    //create jwt token
const token = jwt.sign({userid:user._id},process.env.SECRET_KEY,{expiresIn:process.env.JWT_EXPIRE})
res.status(200).send({data:user, token})

})