import express from 'express'
import Stripe from 'stripe'
import dotenv from 'dotenv'
import Cart from '../../models/cartModel.js'

dotenv.config()

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

router.post('/stripe', async (req, res) => {
    const { cartId } = req.body

    try {
        const cart = await Cart.findById(cartId).populate('products.product')

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
        }

        const lineItems = cart.products.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.product.name,
                },
                unit_amount: item.product.price * 100,
            },
            quantity: item.quantity,
        }))

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `http://localhost:8080/carts/${cartId}/purchase?status=success`,
            cancel_url: `http://localhost:8080/carts/${cartId}/purchase?status=error`,
        })

        res.json({ status: 'success', url: session.url })
    } catch (error) {
        console.error('Error al crear la sesión de pago con Stripe', error)
        res.status(500).json({ status: 'error', message: 'Error al procesar el pago' })
    }
})

export default router
