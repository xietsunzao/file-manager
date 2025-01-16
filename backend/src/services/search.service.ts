import { db } from '../core/database'

export class SearchService {
    async search(query: string) {
        if (!query) {
            return {
                folders: [],
                files: []
            }
        }

        const searchTerm = query.toLowerCase()

        const [folders, files] = await Promise.all([
            // Search folders
            db.folder.findMany({
                where: {
                    name: {
                        contains: searchTerm
                    }
                },
                orderBy: {
                    name: 'asc'
                }
            }),
            // Search files
            db.file.findMany({
                where: {
                    name: {
                        contains: searchTerm
                    }
                },
                orderBy: {
                    name: 'asc'
                },
                include: {
                    folder: true
                }
            })
        ])

        return {
            folders,
            files
        }
    }
} 