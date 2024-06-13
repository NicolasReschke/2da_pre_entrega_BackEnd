import User from '../models/userModel.js'
import Cart from '../models/cartModel.js'

export const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err)
            return res.redirect('/?error=Error al cerrar sesión.')
        }
        res.redirect('/?success=Cierre de sesión exitoso.')
    })
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