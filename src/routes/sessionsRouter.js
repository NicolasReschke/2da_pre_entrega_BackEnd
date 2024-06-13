import express from 'express'
const router = express.Router()

router.get('/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user })
    } else {
        res.status(401).json({ message: 'No estás autenticado' })
    }
})

export default router
