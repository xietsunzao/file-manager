import type { Folder } from '~/types/folder'

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export const folderApi = {
  async getAllFolders(): Promise<Folder[]> {
    const config = useRuntimeConfig()
    console.log('Fetching folders from:', config.public.apiBaseUrl)
    
    const { data: response } = await useFetch<ApiResponse<Folder[]>>('/folders', {
      baseURL: config.public.apiBaseUrl,
      key: 'getAllFolders',
      server: false,
    })
    
    if (!response.value) {
      console.error('No response data')
      return []
    }
    
    return response.value.data
  },

  async getFolderById(id: number): Promise<Folder | null> {
    const config = useRuntimeConfig()
    const { data: response } = await useFetch<ApiResponse<Folder>>(`/folders/${id}`, {
      baseURL: config.public.apiBaseUrl,
      key: `folder-${id}`,
      server: false,
    })
    
    if (!response.value) return null
    return response.value.data
  },

  async getSubfolders(parentId: number): Promise<Folder[]> {
    const config = useRuntimeConfig()
    const { data: response } = await useFetch<ApiResponse<Folder[]>>(`/folders/${parentId}/subfolders`, {
      baseURL: config.public.apiBaseUrl,
      key: `subfolders-${parentId}`,
      server: false,
    })
    
    if (!response.value) return []
    return response.value.data
  },

  async createFolder(name: string, parentId?: number | null): Promise<Folder> {
    const config = useRuntimeConfig()
    const { data: response, error } = await useFetch<ApiResponse<Folder>>('/folders', {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      body: { 
        name, 
        parent_id: parentId ? Number(parentId) : null 
      },
      headers: {
        'Content-Type': 'application/json'
      },
      key: 'createFolder',
      server: false,
    })
    
    if (error.value) {
      console.error('API Error:', error.value)
      const errorMessage = error.value.data?.errors?.[0]?.message || 
                         error.value.data?.message || 
                         'Failed to create folder'
      throw new Error(errorMessage)
    }
    
    if (!response.value?.success) {
      const errorMessage = response.value?.errors?.[0]?.message || 
                         response.value?.message || 
                         'Failed to create folder'
      throw new Error(errorMessage)
    }
    
    return response.value.data
  },

  async renameFolder(id: number, newName: string): Promise<Folder> {
    const config = useRuntimeConfig()
    const { data: response, error } = await useFetch<ApiResponse<Folder>>(`/folders/${id}`, {
      baseURL: config.public.apiBaseUrl,
      method: 'PATCH',
      body: { name: newName },
      headers: {
        'Content-Type': 'application/json'
      },
      key: `renameFolder-${id}`,
      server: false,
    })
    
    if (error.value) {
      console.error('API Error:', error.value)
      const errorMessage = error.value.data?.errors?.[0]?.message || 
                         error.value.data?.message || 
                         'Failed to rename folder'
      throw new Error(errorMessage)
    }
    
    if (!response.value?.success) {
      const errorMessage = response.value?.errors?.[0]?.message || 
                         response.value?.message || 
                         'Failed to rename folder'
      throw new Error(errorMessage)
    }
    
    return response.value.data
  },

  async deleteFolder(id: number) {
    const config = useRuntimeConfig()

    const { data, error } = await useFetch(`/folders/${id}`, {
      baseURL: config.public.apiBaseUrl,
      method: 'DELETE',
      key: `deleteFolder-${id}`,
      server: false,
    })

    if (error.value) throw error.value
    return data.value
  }
} 