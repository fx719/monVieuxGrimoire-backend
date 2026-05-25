import { Book } from '../models/Book.js'
import * as fs from 'node:fs/promises'
import { fileTypeFromBuffer } from 'file-type'
import * as crypto from 'node:crypto'

export const getBooks = (req, res, next) => {
    try {
        Book.find()
            .then((books) => res.status(200).json(books))
            .catch((error) => res.status(404).json({ error }))
    } catch (error) {
        console.error(error)
    }
}

export const getBook = (req, res, next) => {
    try {
        const bookId = req.params.id

        Book.findById(bookId)
            .then((book) => res.status(200).json(book))
            .catch((error) => res.status(404).json(error))

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
            res.status(400).json({ error: 'Mauvais format de fichier' })
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
        res.status(400).json({ error: "Les données ne sont pas au bon format / des champs sont vides" })

    }
}