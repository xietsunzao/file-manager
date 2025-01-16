import type { File, Prisma } from '@prisma/client'

export interface IFileRepository {
  findAll(folder_id: number): Promise<File[]>
  findById(id: number): Promise<File | null>
  create(data: Prisma.FileCreateInput): Promise<File>
  update(id: number, data: Prisma.FileUpdateInput): Promise<File>
  delete(id: number): Promise<File>
} 