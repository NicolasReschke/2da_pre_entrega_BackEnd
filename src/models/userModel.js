import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    role: { type: String, default: 'user' },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    profile_image: { type: String, default: '/uploads/default.jpg' }
})

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password') && user.password) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
