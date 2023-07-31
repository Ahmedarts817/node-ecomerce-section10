const express = require('express')
const router = express.Router()
const {sigup,signin} = require('../services/authService')
const {signupValidator,signinValidator} = require('../utils/validators/authValidator')

router.post('/signup',signupValidator,sigup)
router.post('/signin',signinValidator,signin)

module.exports = router