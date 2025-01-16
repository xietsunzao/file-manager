export interface Folder {
  id: number
  name: string
  parent_id: number | null
  created_at: Date
  updated_at: Date
}

export interface FolderWithChildren extends Folder {
  children?: Folder[]
}

export interface FolderTree extends Folder {
  children?: FolderTree[]
} 