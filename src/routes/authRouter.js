import express from 'express'
import { registerUser, loginUser, logoutUser, githubAuth, githubCallback, googleAuth, googleCallback } from '../controllers/authController.js'

const router = express.Router()

router.post('/login', loginUser)
router.post('/register', registerUser)
router.post('/logout', logoutUser)

router.get('/auth/github', githubAuth)
router.get('/auth/github/callback', githubCallback)

router.get('/auth/google', googleAuth)
router.get('/auth/google/callback', googleCallback)

export default router