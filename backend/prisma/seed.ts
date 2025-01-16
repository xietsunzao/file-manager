import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean the database
  await prisma.file.deleteMany()
  await prisma.folder.deleteMany()

  // Create root folders
  const documents = await prisma.folder.create({
    data: {
      name: 'Documents',
    },
  })

  const pictures = await prisma.folder.create({
    data: {
      name: 'Pictures',
    },
  })

  // Create subfolders for Documents with files
  const work = await prisma.folder.create({
    data: {
      name: 'Work',
      parent_id: documents.id,
    },
  })

  const personal = await prisma.folder.create({
    data: {
      name: 'Personal',
      parent_id: documents.id,
    },
  })

  // Create files in Work folder
  await prisma.file.createMany({
    data: [
      {
        name: 'Project Plan.pdf',
        type: 'application/pdf',
        size: 1024 * 1024 * 2, // 2MB
        folder_id: work.id,
        path: '/storage/documents/work/project-plan.pdf'
      },
      {
        name: 'Meeting Notes.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 1024 * 512, // 512KB
        folder_id: work.id,
        path: '/storage/documents/work/meeting-notes.docx'
      }
    ]
  })

  // Create files in Personal folder
  await prisma.file.createMany({
    data: [
      {
        name: 'Resume.pdf',
        type: 'application/pdf',
        size: 1024 * 768, // 768KB
        folder_id: personal.id,
        path: '/storage/documents/personal/resume.pdf'
      },
      {
        name: 'Budget.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 1024 * 256, // 256KB
        folder_id: personal.id,
        path: '/storage/documents/personal/budget.xlsx'
      }
    ]
  })

  // Create subfolders for Pictures
  const vacation = await prisma.folder.create({
    data: {
      name: 'Vacation',
      parent_id: pictures.id,
    },
  })

  const family = await prisma.folder.create({
    data: {
      name: 'Family',
      parent_id: pictures.id,
    },
  })

  // Create files in Vacation folder
  await prisma.file.createMany({
    data: [
      {
        name: 'Beach.jpg',
        type: 'image/jpeg',
        size: 1024 * 1024 * 5, // 5MB
        folder_id: vacation.id,
        path: '/storage/pictures/vacation/beach.jpg'
      },
      {
        name: 'Mountains.png',
        type: 'image/png',
        size: 1024 * 1024 * 8, // 8MB
        folder_id: vacation.id,
        path: '/storage/pictures/vacation/mountains.png'
      }
    ]
  })

  // Create files in Family folder
  await prisma.file.createMany({
    data: [
      {
        name: 'Birthday Party.jpg',
        type: 'image/jpeg',
        size: 1024 * 1024 * 3, // 3MB
        folder_id: family.id,
        path: '/storage/pictures/family/birthday-party.jpg'
      },
      {
        name: 'Family Reunion.mp4',
        type: 'video/mp4',
        size: 1024 * 1024 * 50, // 50MB
        folder_id: family.id,
        path: '/storage/pictures/family/family-reunion.mp4'
      }
    ]
  })

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 