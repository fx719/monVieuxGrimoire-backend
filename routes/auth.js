import express from 'express'

export const router = express.Router()

router.get('/signup', (req, res) => {
    res.status(200).json({ message: "route signup" })
})


