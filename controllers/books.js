import { Book } from '../models/Book.js'
import sharp from 'sharp'
import * as fs from 'node:fs/promises'
import { prepareBookUpload } from '../services/prepareBookUpload.js'



export const getBooks = (req, res) => {
    try {
        Book.find()
            .then((books) => res.status(200).json(books))
            .catch((error) => res.status(404).json({ error }))
    } catch (error) {
        res.status(400).json({ error })
    }
}

export const getBook = (req, res) => {
    try {
        const bookId = req.params.id

        Book.findById(bookId)
            .then((book) => res.status(200).json(book))
            .catch((error) => res.status(404).json(error))

    } catch (error) {
        res.status(400).json(error)
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

        const createdBook = await prepareBookUpload(req.file.buffer, req, res)


        const uploadedBook = new Book({
            ...createdBook.bookObject
        })

        uploadedBook.save()
            .then(async (book) => {
                await sharp(req.file.buffer).resize(400, 600, { fit: 'outside' }).toFile(`images/${createdBook.fileName}.webp`)
                res.status(201).json({ message: "Livre ajouté avec succès" })
            })
            .catch((error) => {
                res.status(400).json({ error: 'Les données ne sont pas au bon format' })
            })


    } catch (error) {
        res.status(400).json({ error: "Les données ne sont pas au bon format / des champs sont vides" })

    }
}


export const rateOtherUserBook = (req, res) => {
    try {
        Book.findById(req.params.id)
            .then(book => {

                if (req.auth.userId === book.userId)
                    throw new Error("La personne qui a publié l'ouvrage sur le site ne peut pas le noter deux fois")

                if (book.ratings.some(rating => req.auth.userId === rating.userId)) {
                    throw new Error("Un utilisateur ne peut noter le même livre qu'une seule fois")
                }
                if (req.body.rating > 5 || req.body.rating < 1) {
                    throw new Error('La note attribuée doit être comprise entre 1 et 5')
                }

                delete req.body.userId
                const ratingObject = {
                    userId: req.auth.userId,
                    grade: req.body.rating
                }
                book.ratings.push(ratingObject)

                let ratingsSum = 0
                for (let rating of book.ratings) {
                    ratingsSum += rating.grade
                }
                book.averageRating = Math.round(ratingsSum / book.ratings.length)

                book.save()
                    .then(ratedBook => res.status(201).json(ratedBook))
                    .catch(error => res.status(400).json({ error: error.message }))

            }
            )
            .catch(error => res.status(404).json({ error: error.message }))
    } catch (error) {
        res.status(400).json(error)
    }
}


export const modifyBook = (req, res) => {

    try {

        const bookId = req.params.id
        Book.findById(bookId)
            .then(async book => {
                if (book.userId === req.auth.userId) {

                    if (req.file) {

                        const formerFilePath = "images" + book.imageUrl.slice(book.imageUrl.lastIndexOf("/"))
                        const modifiedBook = await prepareBookUpload(req.file.buffer, req, res)

                        Book.updateOne({ _id: bookId }, { ...modifiedBook.bookObject })
                            .then(async () => {
                                await sharp(req.file.buffer).resize(400, 600, { fit: 'outside' }).toFile(`images/${modifiedBook.fileName}.webp`)
                                await fs.rm(formerFilePath)
                                res.status(201).json({ message: "livre modifié avec succès !" })
                            })
                            .catch(error => res.status(400).json(error))

                    } else {
                        const bookObject = { ...req.body }
                        delete bookObject.userId
                        Book.updateOne({ _id: bookId }, { ...bookObject })
                            .then(() => res.status(201).json({ message: "livre modifié avec succès !" }))
                            .catch(error => res.status(400).json(error))
                    }


                } else {
                    res.status(403).json({ message: "403: unauthorized request" })
                }
            })
            .catch(error => res.status(404).json(error))


    } catch (error) {
        res.status(400).json(error)
    }


}

export const deleteBook = (req, res) => {


    try {
        Book.findById(req.params.id)
            .then(async (book) => {
                if (book.userId === req.auth.userId) {
                    const bookCoverPath = "images" + book.imageUrl.slice(book.imageUrl.lastIndexOf("/"))
                    await fs.rm(bookCoverPath)
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: "livre supprimé avec succès" })
                        })
                        .catch(error => res.status(400).json(error))

                } else {
                    res.status(403).json({ message: "403: unauthorized request" })
                }

            })
            .catch(error => res.status(404).json(error))

    } catch (error) {
        res.status(400).json(error)
    }


}