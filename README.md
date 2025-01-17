# Infokes Technical Test Project

A modern file management system built with Vue.js and Express.js, featuring a clean and intuitive interface for organizing and managing files and folders.

![Image](https://github.com/user-attachments/assets/aa763c97-d205-483a-8c1b-598525c138bd)

## Features

- 📁 Hierarchical folder structure
- 📄 File upload and management
- 🔍 Real-time search functionality
- 🌓 Dark/Light mode support
- ⚡ Responsive design
- 🔄 Drag and drop file upload
- 📊 Sort files by name, size, and date
- 🗂️ Folder operations (create, rename, delete)
- 📱 Mobile-friendly interface

## Tech Stack

### Frontend
- **Framework**: Nuxt.js 3 (Vue.js)
- **UI Components**: Nuxt UI
- **Styling**: Tailwind CSS
- **State Management**: Vue Composition API
- **HTTP Client**: Native Fetch API
- **TypeScript** for type safety

### Backend
- **Runtime**: Bun.js
- **Framework**: Express.js
- **Database**: MySQL with Prisma ORM
- **File Storage**: Local filesystem
- **API Documentation**: REST API
- **Validation**: Zod
- **TypeScript** for type safety

## Usage

### Backend Setup

1. Navigate to the backend directory: 

```bash
cd backend
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables

```bash
cp .env.example .env
```

4. Configure your `.env` file:

```bash
DATABASE_URL=mysql://username:password@localhost:3306/database_name
PORT=4000
```

5. Run the server   

```bash
bun run dev
```

The server will run on `http://localhost:4000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:  

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure your `.env` file:

```bash
NUXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
```

5. Run the development server:

```bash
bun run dev
```

The frontend will run on `http://localhost:3000`

The application will be available at `http://localhost:3000`

## API Endpoints

### Folders
- `GET /api/v1/folders` - Get all folders
- `GET /api/v1/folders/:id` - Get folder by ID
- `POST /api/v1/folders` - Create new folder
- `PATCH /api/v1/folders/:id` - Rename folder
- `DELETE /api/v1/folders/:id` - Delete folder

### Files
- `GET /api/v1/files/folder/:folderId` - Get files in folder
- `GET /api/v1/files/:id` - Get file by ID
- `POST /api/v1/files/upload` - Upload file(s)
- `PATCH /api/v1/files/:id/rename` - Rename file
- `DELETE /api/v1/files/:id` - Delete file

## License

MIT License

## Author

Jefri Maruli H


