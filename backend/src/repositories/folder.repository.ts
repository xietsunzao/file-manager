import { db } from '@/core/database'
import { Folder, Prisma } from '@prisma/client'
import { IFolderRepository } from '@/types/folder.types'

export class FolderRepository implements IFolderRepository {
  async findAll(): Promise<Folder[]> {
    return db.folder.findMany({
      include: {
        children: true,
      },
    })
  }

  async findById(id: number): Promise<Folder | null> {
    return db.folder.findUnique({
      where: { id: Number(id) },
      include: {
        children: true,
      },
    })
  }

  async findChildren(parentId: number): Promise<Folder[]> {
    return db.folder.findMany({
      where: {
        parent_id: Number(parentId),
      },
    })
  }

  async create(data: Prisma.FolderCreateInput): Promise<Folder> {
    try {
      const folder = await db.folder.create({
        data: {
          name: data.name,
          ...(data.parent ? {
            parent: {
              connect: {
                id: Number(data.parent.connect?.id)
              }
            }
          } : {})
        },
        include: {
          children: true,
          parent: true,
        },
      })
      return folder
    } catch (error) {
      console.error('Repository Error:', error)
      throw new Error(error instanceof Error ? error.message : 'Failed to create folder')
    }
  }

  async update(id: number, data: Prisma.FolderUpdateInput): Promise<Folder> {
    return await db.folder.update({
      where: { id },
      data
    })
  }

  async delete(id: number): Promise<Folder> {
    return db.folder.delete({
      where: { id: Number(id) },
      include: {
        children: true,
        parent: true,
      },
    })
  }
}

// Create a singleton instance
export const folderRepository = new FolderRepository() 