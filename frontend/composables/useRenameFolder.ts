import { ref } from 'vue'
import type { FolderTree } from '~/types/folder'
import { folderApi } from '~/services/api'

export const useRenameFolder = () => {
  const showRenameModal = ref(false)
  const editedName = ref('')
  const renameError = ref('')
  const isRenaming = ref(false)
  const selectedFolder = ref<FolderTree | null>(null)

  const startRename = (folder: FolderTree) => {
    selectedFolder.value = folder
    editedName.value = folder.name
    showRenameModal.value = true
    renameError.value = ''
  }

  const cancelRename = () => {
    showRenameModal.value = false
    editedName.value = ''
    renameError.value = ''
    selectedFolder.value = null
  }

  const validateFolderName = (name: string): string | undefined => {
    if (!name) return 'Folder name is required'
    if (name.trim().length === 0) return 'Folder name cannot be only whitespace'
    if (name.length > 255) return 'Folder name must be less than 255 characters'
    return undefined
  }

  const handleSaveRename = async (onSuccess?: () => Promise<void>) => {
    if (!selectedFolder.value) return

    const validationError = validateFolderName(editedName.value)
    if (validationError) {
      renameError.value = validationError
      return
    }

    isRenaming.value = true
    try {
      await folderApi.renameFolder(selectedFolder.value.id, editedName.value.trim())
      if (onSuccess) {
        await onSuccess()
      }
      
      const toast = useToast()
      toast.add({
        title: 'Success',
        description: 'Folder renamed successfully',
        icon: 'i-heroicons-check-circle',
        color: 'green',
      })
      showRenameModal.value = false
    } catch (err) {
      console.error('Failed to rename folder:', err)
      renameError.value = err instanceof Error ? err.message : 'Failed to rename folder'
      
      const toast = useToast()
      toast.add({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to rename folder',
        icon: 'i-heroicons-x-circle',
        color: 'red',
      })
    } finally {
      isRenaming.value = false
    }
  }

  return {
    showRenameModal,
    editedName,
    renameError,
    isRenaming,
    selectedFolder,
    startRename,
    cancelRename,
    handleSaveRename
  }
} 