const express = require('express')
const router = express.Router()
const {signUp,signin} = require('../services/authService')
const {signUpValidator,signinValidator} = require('../utils/validators/authValidator')

router.post('/signup',signUpValidator,signUp)
router.post('/signin',signinValidator,signin)