import type { Express, Request, Response, NextFunction } from 'express'
import { api } from '@/routes/api'
import express from 'express'
import cors from 'cors'

export const server = {
    init: (app: Express): void => {
        // Add middleware
        app.use(cors())
        app.use(express.json())
        
        // Use the API routes
        app.use(api)

        // Handle 404
        app.use('*', (req: Request, res: Response) => {
            res.status(404).json({
                success: false,
                message: 'Route not found',
                path: req.originalUrl
            })
        })

        // Global error handler
        app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error(err.stack)
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                message: process.env.NODE_ENV === 'development' ? err.message : undefined
            })
        })
    },
    listen: (port: number): void => {
        console.log(`Server is running on http://localhost:${port}`)
    }
} 