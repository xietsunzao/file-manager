import { Router } from 'express'
import folderRoutes from './folder.routes'
import fileRoutes from './file.routes'

const api = Router()

// API Version prefix
const API_VERSION = '/api/v1'

// Register routes
api.use(`${API_VERSION}/folders`, folderRoutes)
api.use(`${API_VERSION}/files`, fileRoutes)

export { api } 