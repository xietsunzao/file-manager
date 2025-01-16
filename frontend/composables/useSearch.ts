import { ref, watch } from 'vue'
import { searchApi } from '~/services/api'
import type { Folder } from '~/types/folder'
import type { File } from '~/types/file'
import { useDebounceFn } from '@vueuse/core'

export interface SearchResults {
    folders: Folder[]
    files: File[]
}

export const useSearch = () => {
    const searchQuery = ref('')
    const searchResults = ref<SearchResults>({
        folders: [],
        files: []
    })
    const isSearching = ref(false)
    const searchError = ref<string | null>(null)

    const resetSearch = () => {
        searchQuery.value = ''
        searchResults.value = { folders: [], files: [] }
        isSearching.value = false
        searchError.value = null
    }

    const debouncedSearch = useDebounceFn(async (query: string) => {
        if (!query.trim()) {
            searchResults.value = { folders: [], files: [] }
            return
        }

        isSearching.value = true
        searchError.value = null

        try {
            const results = await searchApi.search(query)
            searchResults.value = {
                folders: results.folders.map(folder => ({
                    ...folder,
                    isOpen: false,
                    level: 0,
                    children: []
                })),
                files: results.files
            }
        } catch (error) {
            console.error('Search error:', error)
            searchError.value = 'Failed to perform search'
            searchResults.value = { folders: [], files: [] }
        } finally {
            isSearching.value = false
        }
    }, 300)

    watch(searchQuery, (newQuery) => {
        debouncedSearch(newQuery)
    })

    return {
        searchQuery,
        searchResults,
        isSearching,
        searchError,
        resetSearch
    }
} 