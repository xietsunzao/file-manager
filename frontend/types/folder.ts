export interface Folder {
  id: number
  name: string
  parent_id: number | null
  children?: Folder[]
  created_at: string
  updated_at: string
}

export interface FolderTree extends Folder {
  level: number
  isOpen: boolean
  children?: FolderTree[]
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
} 