const express = require('express')
const router = express.Router()
const {signUp} = require('../services/authService')
const {signUpValidator} = require('../utils/validators/authValidator')

router.post('/signup',signUpValidator,signUp)