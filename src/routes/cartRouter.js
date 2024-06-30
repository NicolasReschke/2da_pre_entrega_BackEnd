import { Router } from 'express'
import {
    getCart,
    addProductToCart,
    updateProductQuantity,
    deleteProductFromCart,
    deleteAllProductsFromCart
} from '../controllers/cartController.js'

const router = Router()

router.get('/:cid', getCart)
router.post('/:cid/products/:pid', addProductToCart)
router.put('/:cid/products/:pid', updateProductQuantity)
router.delete('/:cid/products/:pid', deleteProductFromCart)
router.delete('/:cid', deleteAllProductsFromCart)

export default router
