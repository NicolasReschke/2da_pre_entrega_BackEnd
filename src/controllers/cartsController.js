import Cart from '../models/cartModel.js'
import Product from '../models/productModel.js'

//http://localhost:8080/api/carts/:cid
export const getCart = async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await Cart.findById(cid).populate('products.product').lean()
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
        }
        res.json({ status: 'success', message: 'Carrito', data: cart  })
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message })
    }
}

//http://localhost:8080/api/carts/:cid/products/:pid
export const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params
    const { cantidad } = req.body

    try {
        const cart = await Cart.findById(cid)
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
        }

        const product = await Product.findById(pid)
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === pid)
        if (productIndex > -1) {
            cart.products[productIndex].quantity += parseInt(cantidad) || 1
        } else {
            cart.products.push({ product: pid, quantity: parseInt(cantidad) || 1 })
        }

        await cart.save()
        res.json({ status: 'success', message: 'Producto agregado al carrito' })
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message })
    }
}

//http://localhost:8080/api/carts/:cid/products/:pid
export const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body

        const quantityNumber = parseInt(quantity, 10)
        if (isNaN(quantityNumber) || quantityNumber <= 0) {
            return res.status(400).json({ status: 'error', message: 'Cantidad inválida' })
        }

        const cart = await Cart.findById(cid)
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid)

        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantityNumber
        } else {
            cart.products.push({ product: pid, quantity: quantityNumber })
        }

        await cart.save()

        res.json({ status: 'success', message: 'Cantidad actualizada' })
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message })
    }
}

//http://localhost:8080/api/carts/:cid/products/:pid
export const deleteProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params
        await Cart.updateOne({ _id: cid }, { $pull: { products: { product: pid } } })
        res.json({ status: 'success', message: 'Producto eliminado del carrito' })
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message })
    }
}

//http://localhost:8080/api/carts/:cid
export const deleteAllProductsFromCart = async (req, res) => {
    try {
        const { cid } = req.params
        await Cart.updateOne({ _id: cid }, { $set: { products: [] } })
        res.json({ status: 'success', message: 'Todos los productos eliminados del carrito' })
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message })
    }
}
