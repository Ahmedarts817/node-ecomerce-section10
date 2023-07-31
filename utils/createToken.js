const  jwt = require('jsonwebtoken')


const createToken = (payload)=>{
    jwt.sign({userid:payload},process.env.SECRET_KEY,{expiresIn:process.env.JWT_EXPIRE})
   }

   module.exports = createToken