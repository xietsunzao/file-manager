import { Router } from 'express'
import { searchController } from '../controllers/search.controller'

const router = Router()

router.get('/', searchController.search.bind(searchController))

export default router 