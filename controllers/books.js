import { Book } from '../models/Book.js'
import { fileTypeFromBuffer } from 'file-type'
import sharp from 'sharp'

const fileRenamer = await import('node:crypto')

export const getBooks = (req, res) => {
    try {
        Book.find()
            .then((books) => res.status(200).json(books))
            .catch((error) => res.status(404).json({ error }))
    } catch (error) {
        console.error(error)
    }
}

export const getBook = (req, res) => {
    try {
        const bookId = req.params.id

        Book.findById(bookId)
            .then((book) => res.status(200).json(book))
            .catch((error) => res.status(404).json(error))

    } catch (error) {
        console.error(error)
    }
}


export const getBestRatedBooks = async (req, res) => {

    try {
        const bestRated = await Book.find().sort({ averageRating: -1 }).limit(3)
        res.status(200).json(bestRated)
    } catch (error) {
        res.status(400).json(error)
    }

}


export const createBook = async (req, res) => {
    try {

        const bookCover = req.file
        const newFileName = fileRenamer.randomUUID()
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
            imageUrl: `${req.protocol}://${req.get('host')}/images/${newFileName}.webp`
        })

        uploadedBook.save()
            .then(async (book) => {
                await sharp(bookCover.buffer).resize(400, 600, { fit: 'outside' }).toFile(`images/${newFileName}.webp`)
                res.status(201).json({ message: "Livre ajouté avec succès" })
            })
            .catch((error) => {
                res.status(400).json({ error: 'Les données ne sont pas au bon format' })
            })


    } catch (error) {
        res.status(400).json({ error: "Les données ne sont pas au bon format / des champs sont vides" })

    }
}