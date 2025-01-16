import { ref, computed } from 'vue'
import type { Folder, FolderTree } from '~/types/folder'
import type { File } from '~/types/file'

export type SortKey = 'name' | 'size' | 'date' | null
export type SortDirection = 'asc' | 'desc'

export const useSorting = () => {
  const sortConfig = ref<{
    key: SortKey
    direction: SortDirection
  }>({
    key: null,
    direction: 'asc'
  })

  const sortContent = <T extends (Folder | FolderTree | File)[]>(items: T) => {
    if (!sortConfig.value.key || !items.length) return items

    const multiplier = sortConfig.value.direction === 'asc' ? 1 : -1
    
    return [...items].sort((a, b) => {
      switch (sortConfig.value.key) {
        case 'name':
          return multiplier * a.name.localeCompare(b.name)
        case 'size':
          if ('size' in a && 'size' in b) {
            return multiplier * (a.size - b.size)
          }
          return 'size' in a ? 1 : -1
        case 'date':
          const dateA = new Date(a.updated_at).getTime()
          const dateB = new Date(b.updated_at).getTime()
          return multiplier * (dateA - dateB)
        default:
          return 0
      }
    })
  }

  const sortedContent = computed(() => {
    return {
      folders: sortContent,
      files: sortContent
    }
  })

  const handleSort = (key: SortKey) => {
    if (sortConfig.value.key === key) {
      // Toggle direction if clicking the same column
      sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc'
    } else {
      // Set new sorting column with default ascending direction
      sortConfig.value = {
        key,
        direction: 'asc'
      }
    }
  }

  const getSortIndicator = (key: SortKey): string => {
    if (sortConfig.value.key !== key) return ''
    return sortConfig.value.direction === 'asc' ? '↑' : '↓'
  }

  return {
    sortConfig,
    sortContent,
    sortedContent,
    handleSort,
    getSortIndicator
  }
} 