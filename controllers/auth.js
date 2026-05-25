import { User } from "../models/User.js"
import * as bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

export const signUp = async (req, res) => {
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
            throw new Error("Le mot de passe doit contenir au moins 8 caractères, dont au moins un signe spécial -$ par exemple-, un chiffre, une lettre minuscule et une lettre majuscule")
        }

    } catch (error) {
        res.status(400).json({ error })
    }

}


export const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            throw new Error("erreur dans la combinaison identifiant / mot de passe")
        }

        const userId = user._id.toString()
        const userPassword = user.password

        const passwordCheck = await bcrypt.compare(req.body.password, userPassword)
        if (!passwordCheck) {
            throw new Error("erreur dans la combinaison identifiant / mot de passe")
        }

        const loggedInUser = {
            userId: userId, token: jwt.sign(
                { userId: userId },
                'NAV_TOKEN',
                { expiresIn: '24h' }
            )
        }

        res.status(200).json(loggedInUser)

    } catch (error) {
        res.status(400).json({ error: "Combinaison identifiants/mot de passe incorrecte" })
    }
}