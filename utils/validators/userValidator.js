const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel')

exports.getUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleware,
];

exports.createUserValidator = [
  check('name')
    .notEmpty()
    .withMessage('User required')
    .isLength({ min: 3 })
    .withMessage('Too short User name')
    .isLength({ max: 32 })
    .withMessage('Too long User name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
check('email')
.notEmpty().withMessage('email required')
.isEmail().withMessage('invalid email format')
.custom((val)=>User.findOne(email).then((user)=>{
   if(user){
    return Promise.reject(new Error('email already exists'))
   }
}))
,
check('password').notEmpty().withMessage('password is required')
.isLength({min: 6}).withMessage('password must be at least 6 characters')
.custom((password, { req })=>{
  if(password !== req.passwordConfirm){
    throw new Error('password bust mathch confirmation password');
  }
  return true;
}),
check("profileImg").optional(),
check("role").optional(),

check('passwordConfirm').notEmpty()
.withMessage('confirm passsword is required'),

  validatorMiddleware,
];

exports.changePasswordValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),

  check('currentPassword').notEmpty().withMessage('currentPassword is required')
  
  .custom(async (val,{req})=>{
    const user = await User.findById(req.params.id)
    const isTrue = await bcrypt.compare(val, user.password)
if(!isTrue){
  throw new Error('wrong current password')

}
return true;
  })
  ,
  check('password').notEmpty().withMessage('new password required')
  .custom((val,{req})=>{
    if(val !== req.body.confirmPassword){
      throw new Error('confirm password dont match')
    }
    return true;
  }),
  check('confirmPassword').notEmpty().withMessage('new password required')
  ,validatorMiddleware
]
exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleware,
];
