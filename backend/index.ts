import { app } from './src/app'
import { db } from '@/core/database'

const PORT = parseInt(process.env.PORT || '4000')

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`Click here to access the API: http://localhost:${PORT}`)
})

// Handle shutdown
process.on('SIGTERM', async () => {
    console.log('Shutting down server...')
    await db.$disconnect()
    process.exit(0)
})

process.on('SIGINT', async () => {
    console.log('Shutting down server...')
    await db.$disconnect()
    process.exit(0)
})