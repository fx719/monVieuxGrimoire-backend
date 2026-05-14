import mongoose from "mongoose"

export const getBooks = (req, res, next) => {
    res.status(200).json({ message: "route books" })
}