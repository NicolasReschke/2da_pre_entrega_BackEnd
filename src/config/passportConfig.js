import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import bcrypt from 'bcryptjs'

import User from '../models/userModel.js'
import Cart from '../models/cartModel.js'

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return done(null, false, { message: 'No user found' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return done(null, false, { message: 'Password incorrect' })
        }
        return done(null, user)
    } catch (err) {
        return done(err)
    }
}))

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value })
        if (!user) {
            user = new User({
                first_name: profile.displayName || profile.username,
                last_name: '',
                email: profile.emails[0].value,
                age: null,
                password: '',
                profile_image: profile.photos[0].value
                })
            console.log(user)

            const newCart = new Cart()
            await newCart.save()
            user.cart = newCart._id

            await user.save()
        }
        return done(null, user)
    } catch (err) {
        return done(err)
    }
}))

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
}, async (token, tokenSecret, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value })
        if (!user) {
            user = new User({
                first_name: profile.displayName || '',
                last_name: '',
                email: profile.emails[0].value,
                password: '',
                age: null,
                role: 'user',
                profile_image: profile.photos[0].value
                })
            console.log(user)

            const newCart = new Cart()
            await newCart.save()
            user.cart = newCart._id

            await user.save()
        }
        return done(null, user)
    } catch (err) {
        return done(err)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).populate('cart')
        done(null, user)
    } catch (err) {
        done(err)
    }
})

export default passport