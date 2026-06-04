import { fileTypeFromBuffer } from 'file-type'
const fileRenamer = await import('node:crypto')


export const prepareBookUpload = async (fileBuffer, req, res) => {


    const newFileName = fileRenamer.randomUUID()
    const type = await fileTypeFromBuffer(fileBuffer)

    if (type.mime !== "image/jpg" && type.mime !== "image/jpeg" && type.mime !== "image/png") {
        throw new Error('Mauvais format de fichier')
    }

    const bookInfo = JSON.parse(req.body.book)

    delete bookInfo.userId
    bookInfo.userId = req.auth.userId

    if (bookInfo.ratings) {
        delete bookInfo.ratings[0].userId
        bookInfo.ratings[0].userId = req.auth.userId
    }

    const bookInfoEntries = Object.entries(bookInfo)
    for (const [key, value] of bookInfoEntries) {
        if (typeof value === 'object' && key !== "ratings") {
            throw new Error("mauvais type de données")
        }
    }

    const bookObject = {
        ...bookInfo,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${newFileName}.webp`
    }

    return { bookObject: bookObject, fileName: newFileName }




}