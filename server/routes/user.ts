import User from '../controller/user'
import { isAuth } from '../middleWares/authorization'
const router = require('express').Router()

router.post('/user/signUp', User.uploadImg, User.register)
router.post('/user/signIn', User.logIn)

router.get('/user/profile', isAuth, User.profile)

module.exports = router
