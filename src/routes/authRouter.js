import express from 'express'
import { registerUser, loginUser, logoutUser, githubAuth, githubCallback, googleAuth, googleCallback, updateProfile, deleteUser } from '../controllers/authController.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.post('/login', loginUser)
router.post('/register', registerUser)
router.post('/logout', logoutUser)
router.post('/profile/:uid', upload.single('profileImage'), updateProfile)
router.delete('/profile/:uid', deleteUser)

router.get('/auth/github', githubAuth)
router.get('/auth/github/callback', githubCallback)

router.get('/auth/google', googleAuth)
router.get('/auth/google/callback', googleCallback)

export default router