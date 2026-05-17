import { Book } from '../models/Book.js'
import * as fs from 'node:fs/promises'

export const getBooks = (req, res, next) => {
    try {
        res.status(200).json({ message: "livres affichés" })
    } catch (error) {
        console.error(error)
    }
}


export const createBook = async (req, res) => {
    try {

        const bookCover = req.file
        const loggedInUserId = req.auth.userId
        const bookInfo = JSON.parse(req.body.book)
        delete bookInfo.userId
        delete bookInfo.ratings[0].userId
        bookInfo.userId = loggedInUserId
        bookInfo.ratings[0].userId = loggedInUserId
        const uploadedBook = new Book({
            ...bookInfo,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${bookCover.filename}`
        })

        uploadedBook.save()
            .then(() => res.status(201).json({ message: "Livre ajouté avec succès" }))
            .catch(async (error) => {
                await fs.unlink(`./images/${bookCover.filename}`)
                res.status(400).json({ error })
            })

    } catch (error) {
        res.status(400).json({ error })

    }
}