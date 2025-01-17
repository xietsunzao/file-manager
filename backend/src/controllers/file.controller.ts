import { Request, Response } from 'express'
import { FileService } from '../services/file.service'

export class FileController {
    private service = new FileService()

    constructor() {
        // Bind methods to instance
        this.getFiles = this.getFiles.bind(this)
        this.getFileById = this.getFileById.bind(this)
        this.createFile = this.createFile.bind(this)
        this.updateFile = this.updateFile.bind(this)
        this.deleteFile = this.deleteFile.bind(this)
        this.renameFile = this.renameFile.bind(this)
    }

    getFiles = async (req: Request, res: Response) => {
        try {
            const folder_id = req.params.folder_id ? parseInt(req.params.folder_id) : undefined
            const files = await this.service.getFiles(folder_id)
            res.json({
                success: true,
                message: folder_id 
                    ? 'Files retrieved successfully for folder' 
                    : 'All files retrieved successfully',
                data: files
            })
        } catch (error) {
            throw error
        }
    }

    getFileById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id)
            const file = await this.service.getFileById(id)
            res.json({
                success: true,
                message: 'File retrieved successfully',
                data: file
            })
        } catch (error) {
            throw error
        }
    }

    createFile = async (req: Request, res: Response) => {
        try {
            const file = await this.service.createFile(req.body)
            res.status(201).json({
                success: true,
                message: 'File created successfully',
                data: file
            })
        } catch (error) {
            throw error
        }
    }

    updateFile = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id)
            const file = await this.service.updateFile(id, req.body)
            res.json({
                success: true,
                message: 'File updated successfully',
                data: file
            })
        } catch (error) {
            throw error
        }
    }

    deleteFile = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id)
            await this.service.deleteFile(id)

            res.json({
                success: true,
                message: 'File deleted successfully'
            })
        } catch (error) {
            throw error
        }
    }

    renameFile = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id)
            const { name } = req.body

            const file = await this.service.renameFile(id, name)

            res.json({
                success: true,
                message: 'File renamed successfully',
                data: file
            })
        } catch (error) {
            throw error
        }
    }
} 

// Create a singleton instance
export const fileController = new FileController() 
