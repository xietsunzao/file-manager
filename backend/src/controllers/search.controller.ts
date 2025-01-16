import { Request, Response } from 'express'
import { SearchService } from '@/services/search.service'

export class SearchController {
    private service = new SearchService()

    async search(req: Request, res: Response) {
        try {
            const query = req.query.q as string
            const results = await this.service.search(query)
            
            res.json({
                success: true,
                data: results
            })
        } catch (error) {
            throw error
        }
    }
}

export const searchController = new SearchController() 