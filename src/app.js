import express from 'express'
import dotenv from 'dotenv'
import handlebars from 'express-handlebars'
import mongoose from './config/database.js'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import { createServer } from 'http'
import path from 'path'
import { fileURLToPath } from 'url'
import passport from 'passport'
import methodOverride from 'method-override'

import productsRouter from './routes/productsRouter.js'
import cartsRouter from './routes/cartsRouter.js'
import authRouter from './routes/authRouter.js'
import viewsRouter from './routes/viewsRouter.js'
import './config/passportConfig.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = createServer(app)

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 7 * 24 * 60 * 60
    }),
    cookie: { 
        secure: false, //Cambiar a true si en producción usamos https!!!
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(methodOverride('_method'))

app.use((req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user.toJSON()
        res.locals.cart = req.user.cart
    }
    next()
})

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)
app.use('/', authRouter)

const PORT = process.env.PORT
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/login`)
})
