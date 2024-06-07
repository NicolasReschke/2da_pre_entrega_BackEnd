import User from '../models/userModel.js'
import Cart from '../models/cartModel.js'
import passport from 'passport'

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

