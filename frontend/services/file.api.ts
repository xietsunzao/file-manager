import type { File } from '~/types/file'
import type { ApiResponse } from '~/types/file'

export const fileApi = {
  async getFiles(folderId?: number): Promise<File[]> {
    const config = useRuntimeConfig()
    const url = folderId ? `/files/folder/${folderId}` : '/files'
    
    const { data: response } = await useFetch<ApiResponse<File[]>>(url, {
      baseURL: config.public.apiBaseUrl,
      key: folderId ? `files-folder-${folderId}` : 'all-files',
      server: false,
    })
    
    if (!response.value) return []
    return response.value.data
  },

  async getFileById(id: number): Promise<File | null> {
    const config = useRuntimeConfig()
    const { data: response } = await useFetch<ApiResponse<File>>(`/files/${id}`, {
      baseURL: config.public.apiBaseUrl,
      key: `file-${id}`,
      server: false,
    })
    
    if (!response.value) return null
    return response.value.data
  },

  async createFile(file: FormData): Promise<File> {
    const config = useRuntimeConfig()
    const { data: response, error } = await useFetch<ApiResponse<File>>('/files', {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      body: file,
      headers: {
        // Don't set Content-Type, let the browser set it with the boundary
      },
      key: 'createFile',
      server: false,
    })
    
    if (error.value) {
      console.error('API Error:', error.value)
      throw new Error(error.value.data?.message || 'Failed to create file')
    }
    
    if (!response.value?.success) {
      throw new Error(response.value?.message || 'Failed to create file')
    }
    
    return response.value.data
  },

  async updateFile(id: number, name: string): Promise<File> {
    const config = useRuntimeConfig()
    const { data: response, error } = await useFetch<ApiResponse<File>>(`/files/${id}`, {
      baseURL: config.public.apiBaseUrl,
      method: 'PATCH',
      body: { name },
      headers: {
        'Content-Type': 'application/json'
      },
      key: `updateFile-${id}`,
      server: false,
    })
    
    if (error.value) {
      console.error('API Error:', error.value)
      throw new Error(error.value.data?.message || 'Failed to update file')
    }
    
    if (!response.value?.success) {
      throw new Error(response.value?.message || 'Failed to update file')
    }
    
    return response.value.data
  },

  async deleteFile(id: number): Promise<void> {
    const config = useRuntimeConfig()
    const { error } = await useFetch(`/files/${id}`, {
      baseURL: config.public.apiBaseUrl,
      method: 'DELETE',
      key: `deleteFile-${id}`,
      server: false,
    })

    if (error.value) {
      throw new Error(error.value.data?.message || 'Failed to delete file')
    }
  }
} 