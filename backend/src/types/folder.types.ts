import type { Folder, Prisma } from '@prisma/client'

export interface IFolderRepository {
  findAll(): Promise<Folder[]>
  findById(id: number): Promise<Folder | null>
  findChildren(parent_id: number): Promise<Folder[]>
  create(data: Prisma.FolderCreateInput): Promise<Folder>
  update(id: number, data: Prisma.FolderUpdateInput): Promise<Folder>
  delete(id: number): Promise<Folder>
} 