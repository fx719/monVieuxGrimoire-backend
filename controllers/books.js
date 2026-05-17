import { Book } from '../models/Book.js'
import * as fs from 'node:fs/promises'
import { fileTypeFromBuffer } from 'file-type'
import * as crypto from 'node:crypto'

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
        const newFileName = Date.now() + bookCover.originalname.trim()
        const type = await fileTypeFromBuffer(bookCover.buffer)

        if (type.mime !== "image/jpg" && type.mime !== "image/jpeg" && type.mime !== "image/png") {
            throw new Error('Erreur dans le format de fichier')
        }

        const loggedInUserId = req.auth.userId
        const bookInfo = JSON.parse(req.body.book)
        delete bookInfo.userId
        delete bookInfo.ratings[0].userId
        bookInfo.userId = loggedInUserId
        bookInfo.ratings[0].userId = loggedInUserId
        const uploadedBook = new Book({
            ...bookInfo,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${newFileName}`
        })

        uploadedBook.save()
            .then(async (book) => {
                await fs.writeFile(`images/${newFileName}`, bookCover.buffer)
                res.status(201).json({ message: "Livre ajouté avec succès" })
            })
            .catch((error) => {
                res.status(400).json({ error: 'Les données ne sont pas au bon format' })
            })

    } catch (error) {
        res.status(400).json({ error })

    }
}