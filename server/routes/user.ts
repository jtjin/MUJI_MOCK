import User from '../controller/user'

const router = require('express').Router()

router.post('/user/register', User.uploadImg, User.register)
router.post('/user/logIn', User.logIn)

// router.use(authorization)

router.get('/user/profile', User.profile)

module.exports = router
