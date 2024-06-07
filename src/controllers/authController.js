import passport from 'passport'

import User from '../models/userModel.js'
import Cart from '../models/cartModel.js'

export const registerUser = async (req, res) => {
    const { first_name, last_name, email, age, password, password2 } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (password !== password2) {
            return res.redirect('/register?error=Las contraseñas no coinciden.')
        }
        if (existingUser) {
            return res.redirect('/register?error=El email ya está en uso.')
        }

        const newUser = new User({ first_name, last_name, email, age, password })

        const newCart = new Cart()
        await newCart.save()
        newUser.cart = newCart._id
        await newUser.save()

        return res.redirect('/login?success=Usuario registrado correctamente. Por favor, inicie sesión.')
    } catch (error) {
        console.error('Error al registrar el usuario:', error)
        return res.redirect('/register?error=Ocurrió un error al registrar el usuario. Por favor, intenta nuevamente.')
    }
}

export const loginUser = (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.redirect('/login?error=' + encodeURIComponent(info.message))
        }
        req.logIn(user, async (err) => {
            if (err) {
                return next(err)
            }
            return res.redirect('/products')
        })
    })(req, res, next)
}

export const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err)
            return res.redirect('/?error=Error al cerrar sesión.')
        }
        res.redirect('/?success=Cierre de sesión exitoso.')
    })
}

export const githubAuth = passport.authenticate('github', { scope: ['user:email'] })
export const githubCallback = (req, res, next) => {
    passport.authenticate('github', {
        failureRedirect: '/login?error=Autenticación con GitHub fallida.',
        successRedirect: '/products'
    })(req, res, next)
}

export const googleAuth = passport.authenticate('google', { scope: ['email'] })
export const googleCallback = (req, res, next) => {
    passport.authenticate('google', {
        failureRedirect: '/login?error=Autenticación con Google fallida.',
        successRedirect: '/products'
    })(req, res, next)
}

export const updateProfile = async (req, res) => {
    const { first_name, last_name, age } = req.body
    const userId = req.params.uid
    
    try {
        const user = await User.findById(userId)
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }
        
        user.first_name = first_name || user.first_name
        user.last_name = last_name || user.last_name
        user.age = age || user.age
        
        if (req.file) {
            user.profile_image = `/uploads/${req.file.filename}`
        }
        
        await user.save()
        
        res.redirect('/profile?success=Perfil actualizado correctamente.')
    } catch (error) {
        console.error('Error al actualizar el perfil:', error)
        res.redirect('/profile?error=Error al actualizar el perfil.')
    }
}

export const deleteUser = async (req, res) => {
    const userId = req.params.uid

    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }

        await Cart.findByIdAndDelete(user.cart)

        await User.findByIdAndDelete(userId)

        req.logout((err) => {
            if (err) {
                console.error('Error al cerrar sesión:', err)
                return res.status(500).json({ error: 'Error al cerrar sesión después de eliminar el perfil.' })
            }

            res.status(200).json({ message: 'Perfil eliminado correctamente.' })
        })

    } catch (error) {
        console.error('Error al eliminar el perfil:', error)
        res.status(500).json({ error: 'Error al eliminar el perfil.' })
    }
}