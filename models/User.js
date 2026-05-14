import mongoose from "mongoose"
import uniqueValidator from 'mongoose-unique-validator'


const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Merci de rentrer les données au format d'une adresse email"]
    },
    password: { type: String, required: true }
})

userSchema.plugin(uniqueValidator)

export const User = mongoose.model('User', userSchema)