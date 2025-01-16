import { fileApi } from '~/services/file.api'
import type { File } from '~/types/file'

export const useFiles = () => {
  const files = ref<File[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadFiles = async (folderId: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fileApi.getFiles(folderId)
      files.value = response
    } catch (err) {
      console.error('Error loading files:', err)
      error.value = 'Failed to load files'
    } finally {
      loading.value = false
    }
  }

  return {
    files,
    loading,
    error,
    loadFiles
  }
} 