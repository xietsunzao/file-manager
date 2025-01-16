export interface File {
  id: number
  name: string
  type: string
  size: number
  folder_id: number
  path: string
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Array<{
    field: string
    message: string
  }>
} 