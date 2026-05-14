import { User } from "../models/User.js"
import * as bcrypt from "bcrypt"


export const signUp = async (req, res, next) => {
    try {
        const passwordRegEx = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[!#\$%&\?])/g
        if (passwordRegEx.test(req.body.password) && req.body.password.length >= 8) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)

            const user = new User({
                email: req.body.email,
                password: hashedPassword
            })

            await user.save()
            res.status(201).json({ message: "Utilisateur crée avec succès" })
        } else {
            throw new Error('Le mot de passe doit comporter au moins 8 caractères, dont au moins 1 lettre minuscule, 1 majuscule, 1 chiffre et un caractère spécial')
        }

    } catch (error) {
        console.error(error)
    }

}