import { db } from '../core/database'
import { Validator } from '../core/validator'
import { FileValidation } from '../validations/file.validation'
import type { File, Prisma } from '@prisma/client'

export class FileService {
    async getFiles(folderId?: number): Promise<File[]> {
        return await db.file.findMany({
            where: folderId ? {
                folder: {
                    id: folderId
                }
            } : undefined,
            orderBy: { name: 'asc' },
            include: {
                folder: true
            }
        })
    }

    async getFileById(id: number): Promise<File | null> {
        const validatedData = Validator.validate(FileValidation.getFileById, { id })
        return await db.file.findUnique({
            where: { id: validatedData.id }
        })
    }

    async createFile(data: {
        name: string;
        type: string;
        size?: number;
        path: string;
        folder: {
            connect: {
                id: number;
            };
        };
    }): Promise<File> {
        const file = await db.file.create({
            data: {
                name: data.name,
                type: data.type,
                size: data.size || 0,
                path: data.path,
                folder: {
                    connect: {
                        id: data.folder.connect.id
                    }
                }
            }
        })
        return file
    }

    async updateFile(id: number, data: Prisma.FileUpdateInput): Promise<File> {
        const validatedData = Validator.validate(FileValidation.updateFile, data)
        return await db.file.update({
            where: { id },
            data: validatedData
        })
    }

    async deleteFile(id: number): Promise<File> {
        const validatedData = Validator.validate(FileValidation.getFileById, { id })
        return await db.file.delete({
            where: { id: validatedData.id }
        })
    }

    async renameFile(id: number, name: string): Promise<File> {
        return await db.file.update({
            where: { id },
            data: { name }
        })
    }
} 