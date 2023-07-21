const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
name:{
    type:String,
    trim:true,
    required:[true, 'username is required'],
},
slug:{
    type:String,
    lowercase:true
},
email:{
    type:String,
    required:[true, 'email is required'],
    lowercase:true,
    unique:true
},
phone:String,
profileImg:String,
password:{
    type:String,
    required:[true, 'passwored is required'],
    minlength:[6, 'too short password'],
    maxlength:[20, 'too long password']
},
role:{
    type:String,
    enum:['user','admin'],
    default:'user'
},
active:{
    type:Boolean,
    default:true
}
},
{timestamps:true})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){return next()}
    this.password =await bcrypt.hash(this.password, 12)
    next()
})

module.exports = mongoose.model('User', userSchema)