import mongoose from "mongoose"
import { Book } from '../models/Book.js'

export const getBooks = (req, res, next) => {
    const mockUpBooks = [
        {
            _id: '1',
            userId: '17',
            title: "livre 1",
            author: "user1",
            imageUrl: "google.com",
            year: 1992,
            genre: "policier",
            ratings: [
                {
                    userId: "user2",
                    grade: 5
                },
                {
                    userId: "user3",
                    grade: 3
                }
            ],//notes données à un livre
            averageRating: 4
        },
        {
            _id: '2',
            userId: '19',
            title: "livre 2",
            author: "user2",
            imageUrl: "google.com",
            year: 1995,
            genre: "romance",
            ratings: [
                {
                    userId: "user1",
                    grade: 2
                },
                {
                    userId: "user3",
                    grade: 2
                }
            ],//notes données à un livre
            averageRating: 2
        }
    ]
    res.status(200).json(mockUpBooks)
}


export const createBook = async (req, res) => {
    try {
        const bookCover = req.file
        console.log(bookCover)
        res.status(201).json({ message: "upload reussi" })
    } catch (error) {
        console.error(error)
    }
}