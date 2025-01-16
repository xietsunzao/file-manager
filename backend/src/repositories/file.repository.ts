import { db } from '../core/database'
import type { IFileRepository } from '../types/file.types'
import type { File, Prisma } from '@prisma/client'

export class FileRepository implements IFileRepository {
  async findAll(folder_id?: number): Promise<File[]> {
    return await db.file.findMany({
      where: folder_id ? {
        folder_id: folder_id
      } : undefined,
      orderBy: { name: 'asc' }
    })
  }

  async findById(id: number): Promise<File | null> {
    return await db.file.findUnique({
      where: { id }
    })
  }

  async create(data: Prisma.FileCreateInput): Promise<File> {
    return await db.file.create({ data })
  }

  async update(id: number, data: Prisma.FileUpdateInput): Promise<File> {
    return await db.file.update({
      where: { id },
      data
    })
  }

  async delete(id: number): Promise<File> {
    return await db.file.delete({
      where: { id }
    })
  }
} 