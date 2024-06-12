import { Router } from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import User from '../models/userModel.js'
import Cart from '../models/cartModel.js'
import Product from '../models/productModel.js'

const router = Router()

const getPopulatedCart = async (cartId) => {
    try {
        const cart = await Cart.findById(cartId).populate('products.product').lean()
        return cart
    } catch (error) {
        throw new Error('Error al obtener el carrito')
    }
}

router.get('/', async (req, res) => {
    res.render('home', {
        style: 'style.css',
        user: res.locals.user,
        cart: res.locals.cart
    })
})

router.get('/products', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId).populate('cart').lean()

        if (!user) {
            return res.status(404).render('products', { error: 'Usuario no encontrado' })
        }

        if (!user.cart) {
            return res.status(404).render('products', { error: 'No se encontró el carrito del usuario' })
        }

        const cartId = user.cart._id
        const cart = await getPopulatedCart(cartId)

        res.render('products', {
            cartId: cartId,
            user: res.locals.user,
            style: 'style.css',
        })
    } catch (error) {
        console.error('Error al obtener el carrito:', error)
        res.status(500).render('products', { error: error.message })
    }
})

router.get('/products/:pid', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId).populate('cart').lean()

        const cartId = user.cart._id

        const productId = req.params.pid
        const product = await Product.findById(productId).lean()

        res.render('viewDetailProduct', {
            product,
            cartId: cartId,
            style: 'style.css',
            user: res.locals.user
        })
    } catch (error) {
        console.error('Error al obtener el producto:', error)
        res.status(500).render('viewDetailProduct', { error: error.message })
    }
})

router.get('/products/category/:category', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('cart').lean();
        
        const cartId = user.cart._id;

        const category = req.params.category;

        const products = await Product.find({ category }).lean();

        res.render('productsByCategory', {
            category,
            products,
            cartId,
            user: res.locals.user,
            style: 'style.css',
        });
    } catch (error) {
        console.error('Error al obtener productos por categoría:', error);
        res.status(500).send('Error al obtener productos por categoría');
    }
})

router.get('/carts/:cid', isAuthenticated, async (req, res) => {
    const cartId = req.params.cid || res.locals.cartId
    try {
        const cart = await getPopulatedCart(cartId)

        res.render('cart', {
            cart: cart,
            style: 'style.css',
            user: res.locals.user
        })
    } catch (error) {
        console.error('Error al obtener el carrito:', error)
        res.status(500).render('cart', { error: error.message })
    }
})

router.get('/login', async (req, res) => {
    res.render('login', {
        style: 'style.css'
    })
})

router.get('/register', async (req, res) => {
    res.render('register', {
        style: 'style.css'
    })
})

router.get('/profile', async (req, res) => {
    res.render('profile', {
        style: 'style.css',
        user: res.locals.user
    })
})

router.get('/profile/:uid', async (req, res) => {
    res.render('uploadProfile', {
        style: 'style.css',
        user: res.locals.user
    })
})

export default router
