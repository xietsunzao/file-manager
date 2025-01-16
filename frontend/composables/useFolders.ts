import type { Folder, FolderTree } from '~/types/folder'
import { folderApi } from '~/services/api'

export const useFolders = () => {
  const allFolders = ref<FolderTree[]>([])
  const selectedFolder = ref<FolderTree | null>(null)
  const selectedFolderId = ref<string | null>(null)
  const subfolders = ref<Folder[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  const getUniqueId = (folder: FolderTree): string => {
    let path = `${folder.id}`
    let current = folder
    let parent = findParentFolder(current.parent_id)
    
    while (parent) {
      path = `${parent.id}-${path}`
      current = parent
      parent = findParentFolder(current.parent_id)
    }
    
    return path
  }

  const findParentFolder = (parentId: number | null): FolderTree | null => {
    if (!parentId) return null
    
    const findInTree = (folders: FolderTree[]): FolderTree | null => {
      for (const folder of folders) {
        if (folder.id === parentId) return folder
        if (folder.children?.length) {
          const found = findInTree(folder.children)
          if (found) return found
        }
      }
      return null
    }
    
    return findInTree(allFolders.value)
  }

  const transformToTree = (folders: Folder[]): FolderTree[] => {
    // First, create a map of all folders by their IDs
    const folderMap = new Map<number, FolderTree>()
    
    // Initialize all folders with their basic properties
    folders.forEach(folder => {
      folderMap.set(folder.id, {
        ...folder,
        level: 0,
        isOpen: false,
        children: []
      })
    })
    
    // Build the tree structure
    const rootFolders: FolderTree[] = []
    
    folders.forEach(folder => {
      const currentFolder = folderMap.get(folder.id)
      if (!currentFolder) return
      
      if (folder.parent_id === null) {
        // This is a root folder
        rootFolders.push(currentFolder)
      } else {
        // This is a child folder
        const parentFolder = folderMap.get(folder.parent_id)
        if (parentFolder) {
          if (!parentFolder.children) {
            parentFolder.children = []
          }
          parentFolder.children.push(currentFolder)
        }
      }
    })

    // Add level information recursively
    const addLevels = (folders: FolderTree[], level = 0): void => {
      folders.forEach(folder => {
        folder.level = level
        if (folder.children?.length) {
          addLevels(folder.children, level + 1)
        }
      })
    }

    addLevels(rootFolders)
    return rootFolders
  }

  const loadAllFolders = async () => {
    if (initialized.value) return
    
    loading.value = true
    error.value = null
    
    try {
      const folders = await folderApi.getAllFolders()
      allFolders.value = transformToTree(folders)
      initialized.value = true
    } catch (err) {
      console.error('Failed to load folders:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load folders'
      allFolders.value = []
    } finally {
      loading.value = false
    }
  }

  const loadSubfolders = async (folderId: number) => {
    loading.value = true
    error.value = null
    try {
      const folders = await folderApi.getSubfolders(folderId)
      
      // Find the parent folder in the tree
      const updateFolderInTree = (tree: FolderTree[], parentId: number, subfolders: Folder[]): boolean => {
        for (const folder of tree) {
          if (folder.id === parentId) {
            // Transform subfolders to FolderTree format
            folder.children = subfolders.map(sub => ({
              ...sub,
              level: folder.level + 1,
              isOpen: false,
              children: []
            }))
            return true
          }
          if (folder.children?.length) {
            if (updateFolderInTree(folder.children, parentId, subfolders)) {
              return true
            }
          }
        }
        return false
      }

      updateFolderInTree(allFolders.value, folderId, folders)
      
    } catch (err) {
      console.error('Failed to load subfolders:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load subfolders'
    } finally {
      loading.value = false
    }
  }

  const toggleFolder = (folder: FolderTree) => {
    if (folder.children?.length) {
      folder.isOpen = !folder.isOpen
      
      // Recursively close all children when closing parent
      if (!folder.isOpen) {
        const closeChildren = (children: FolderTree[]) => {
          children.forEach(child => {
            child.isOpen = false
            if (child.children?.length) {
              closeChildren(child.children)
            }
          })
        }
        closeChildren(folder.children)
      }
    }
  }

  const selectFolder = async (folder: FolderTree) => {
    selectedFolder.value = folder
    selectedFolderId.value = getUniqueId(folder)
    await loadSubfolders(folder.id)
  }

  const createFolder = async (name: string, parentId?: number) => {
    loading.value = true
    error.value = null
    try {
      const newFolder = await folderApi.createFolder(name, parentId)
      await loadAllFolders()
      return newFolder
    } catch (err) {
      console.error('Failed to create folder:', err)
      error.value = err instanceof Error ? err.message : 'Failed to create folder'
      throw err
    } finally {
      loading.value = false
    }
  }

  const breadcrumbs = computed(() => {
    if (!selectedFolder.value) return []
    
    const crumbs: FolderTree[] = []
    let current: FolderTree | null = selectedFolder.value
    
    while (current) {
      crumbs.unshift(current)
      current = findParentFolder(current.parent_id)
    }
    
    return crumbs
  })

  const calculateFolderLevel = (folder: Omit<FolderTree, 'level'>): number => {
    let level = 0
    let current = folder
    
    while (current.parent_id) {
      level++
      const parent = allFolders.value.find(f => f.id === current.parent_id)
      if (!parent) break
      current = parent
    }
    
    return level
  }

  if (process.client) {
    loadAllFolders()
  }

  return {
    allFolders,
    selectedFolder,
    selectedFolderId,
    subfolders,
    loading,
    error,
    breadcrumbs,
    loadAllFolders,
    loadSubfolders,
    toggleFolder,
    selectFolder,
    createFolder,
    reloadFolders: () => {
      initialized.value = false
      return loadAllFolders()
    }
  }
} 