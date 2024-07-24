import { CustomError } from '../utils/errors.js'

function errorHandler(err, req, res, next) {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ status: 'error', message: err.message })
    }
    console.error(err)
    res.status(500).json({ status: 'error', message: 'Internal Server Error' })
}

export default errorHandler