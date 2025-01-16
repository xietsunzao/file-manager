import express from 'express'
import cors from 'cors'
import { api } from './routes/api'
import { errorHandler } from './middleware/error.middleware'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use(api)

// Error handling
app.use(errorHandler)

export { app } 