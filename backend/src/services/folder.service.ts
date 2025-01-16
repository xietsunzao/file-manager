import { Prisma } from '@prisma/client'
import { folderRepository } from '../repositories/folder.repository'
import type { Folder } from '../models/folder.model'
import { Validator } from '../core/validator'
import { FolderValidation } from '../validations/folder.validation'
import type { CreateFolderDto } from '../dtos/folder.dto'
import { FolderRepository } from '../repositories/folder.repository'

export class FolderService {
    private repository: FolderRepository

    constructor() {
        this.repository = new FolderRepository()
    }

    async createFolder(data: CreateFolderDto): Promise<Folder> {
        // Validate input data
        const validatedData = await Validator.validateAsync(FolderValidation.createFolder, {
            name: data.name,
            parent_id: data.parent_id ? Number(data.parent_id) : null
        });
        
        // Transform to Prisma input
        const prismaInput: Prisma.FolderCreateInput = {
            name: validatedData.name,
            parent: validatedData.parent_id ? { 
                connect: { id: validatedData.parent_id } 
            } : undefined
        }

        return this.repository.create(prismaInput)
    }

    async getFolderById(id: number): Promise<Folder | null> {
        // Validate ID
        await Validator.validateAsync(FolderValidation.getFolderById, { id })
        
        const folder = await this.repository.findById(id)
        if (!folder) {
            throw new Error(JSON.stringify({
                success: false,
                message: 'Folder not found'
            }))
        }
        return folder
    }

    async getAllFolders(): Promise<Folder[]> {
        return this.repository.findAll()
    }

    async getSubfolders(parentId: number): Promise<Folder[]> {
        // Validate parent ID
        await Validator.validateAsync(FolderValidation.getFolderById, { id: parentId })
        
        const folder = await this.repository.findById(parentId)
        if (!folder) {
            throw new Error(JSON.stringify({
                success: false,
                message: 'Parent folder not found'
            }))
        }

        return this.repository.findChildren(parentId)
    }

    async deleteFolder(id: number): Promise<Folder> {
        const folder = await this.repository.findById(id)
        if (!folder) {
            throw new Error(JSON.stringify({
                success: false,
                message: 'Folder not found',
                errors: [{
                    field: 'id',
                    code: 'not_found',
                    message: 'Folder not found'
                }]
            }))
        }

        // Check if folder has children
        const children = await this.repository.findChildren(id)
        if (children.length > 0) {
            throw new Error(JSON.stringify({
                success: false,
                message: 'Cannot delete folder with subfolders',
                errors: [{
                    field: 'id',
                    code: 'has_children',
                    message: 'Cannot delete folder that contains subfolders'
                }]
            }))
        }

        return await this.repository.delete(id)
    }

    async renameFolder(id: number, name: string): Promise<Folder> {
        // Validate the input
        const validData = await Validator.validateAsync(FolderValidation.updateFolder, { name })

        // Check if folder exists
        const existingFolder = await this.repository.findById(id)
        if (!existingFolder) {
            throw new Error(JSON.stringify({
                success: false,
                message: 'Folder not found',
                errors: [{
                    field: 'id',
                    message: 'Folder not found'
                }]
            }))
        }

        // Check for duplicate name in the same level
        const siblings = await this.repository.findChildren(existingFolder.parent_id || 0)
        const hasDuplicate = siblings.some(
            folder => folder.name === validData.name && folder.id !== id
        )

        if (hasDuplicate) {
            throw new Error(JSON.stringify({
                success: false,
                message: 'Folder name already exists at this level',
                errors: [{
                    field: 'name',
                    message: 'A folder with this name already exists in this location'
                }]
            }))
        }

        // Update the folder
        return await this.repository.update(id, { name: validData.name })
    }
}

// Create a singleton instance
export const folderService = new FolderService() 