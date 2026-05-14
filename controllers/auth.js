import { User } from "../models/User.js"


export const signUp = async (req, res, next) => {
    try {

        const user = new User({
            ...req.body
        })

        await user.save()
        res.status(201).json({ message: "Utilisateur crée avec succès" })

    } catch (error) {
        console.error(error)
    }

}