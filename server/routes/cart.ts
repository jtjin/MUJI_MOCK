import Cart from '../controller/cart'
import { Router } from 'express'
import { isAuth } from '../middleWares/authorization'
const router = Router()

router.get('/user/cart/', isAuth, Cart.getItemsByUserId)
router.post('/user/cart', isAuth, Cart.createItemByUserId)
router.delete('/user/cart', isAuth, Cart.deleteItemById)
router.put('/user/cart', isAuth, Cart.updateItemQuantity)

module.exports = router
