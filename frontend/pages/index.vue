<template>
  <div class="grid grid-cols-[300px_1fr] gap-6">
    <!-- Left Panel with fixed height and scrollbar -->
    <div class="rounded-lg border h-[calc(100vh-8rem)]" :class="[
      isDark ? 'bg-gray-800/50 border-gray-800' : 'bg-gray-50 border-gray-200'
    ]" @contextmenu.prevent>
      <!-- Header - Fixed -->
      <div class="p-4 border-b" :class="isDark ? 'border-gray-800' : 'border-gray-200'">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Folders</h2>
          <div class="flex gap-2">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-arrow-path"
              :loading="loading"
              @click="reloadFolders"
              :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'"
              :tooltip="{ text: 'Reload folders', position: 'bottom' }"
            />
            <UButton
              color="primary"
              variant="ghost"
              icon="i-heroicons-plus"
              @click="showCreateModal = true"
              :tooltip="{ text: 'Create new folder', position: 'bottom' }"
            />
          </div>
        </div>
      </div>
      
      <!-- Scrollable Content Area -->
      <div class="overflow-y-auto h-[calc(100%-4rem)]">
        <div class="p-2">
          <!-- Loading State -->
          <div v-if="loading" class="space-y-2 p-2">
            <USkeleton class="h-6 w-full" />
            <USkeleton class="h-6 w-3/4" />
            <USkeleton class="h-6 w-1/2" />
          </div>
          
          <!-- Error State -->
          <div v-else-if="error" class="p-4 text-center text-red-500">
            {{ error }}
            <UButton
              class="mt-2"
              color="primary"
              size="sm"
              @click="loadAllFolders"
            >
              Retry
            </UButton>
          </div>
          
          <!-- Empty State -->
          <div v-else-if="!allFolders.length" class="p-4 text-center text-gray-500">
            No folders found
          </div>
          
          <!-- Folder Tree -->
          <template v-else>
            <template v-for="folder in allFolders" :key="folder.id">
              <!-- Main folder item -->
              <div
                :style="{ paddingLeft: `${folder.level * 0.75}rem` }"
                class="flex items-center px-3 py-2 hover:bg-gray-700/50 cursor-pointer rounded-md"
                @click="handleFolderClick(folder)"
                @contextmenu.prevent="(e) => onFolderContextMenu(e, folder)"
              >
                <div class="flex items-center gap-2 w-full">
                  <!-- Toggle button for folders with children -->
                  <button 
                    v-if="folder.children?.length"
                    class="w-5 h-5 flex items-center justify-center"
                    @click.stop="toggleFolder(folder)"
                  >
                    <UIcon
                      :name="folder.isOpen ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
                      class="w-4 h-4"
                      :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                    />
                  </button>
                  <span v-else class="w-5"></span> <!-- Spacer for alignment -->
                  
                  <UIcon 
                    name="i-heroicons-folder" 
                    class="flex-shrink-0 w-5 h-5" 
                    :class="isDark ? 'text-gray-400' : 'text-gray-500'" 
                  />
                  <span class="truncate">{{ folder.name }}</span>
                </div>
              </div>

              <!-- Render children recursively if folder is open -->
              <template v-if="folder.isOpen && folder.children?.length">
                <div
                  v-for="child in folder.children"
                  :key="child.id"
                  :style="{ paddingLeft: `${(child.level + 1) * 0.75}rem` }"
                  class="flex items-center px-3 py-2 hover:bg-gray-700/50 cursor-pointer rounded-md"
                  @click="handleFolderClick(child)"
                  @contextmenu.prevent="(e) => onFolderContextMenu(e, child)"
                >
                  <div class="flex items-center gap-2 w-full">
                    <!-- Toggle button for child folders with children -->
                    <button 
                      v-if="child.children?.length"
                      class="w-5 h-5 flex items-center justify-center"
                      @click.stop="toggleFolder(child)"
                    >
                      <UIcon
                        :name="child.isOpen ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
                        class="w-4 h-4"
                        :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                      />
                    </button>
                    <span v-else class="w-5"></span>
                    
                    <UIcon 
                      name="i-heroicons-folder" 
                      class="flex-shrink-0 w-5 h-5" 
                      :class="isDark ? 'text-gray-400' : 'text-gray-500'" 
                    />
                    <span class="truncate">{{ child.name }}</span>
                  </div>
                </div>
              </template>
            </template>
          </template>
        </div>
      </div>
    </div>

    <!-- Right Panel with matching height -->
    <div class="rounded-lg border h-[calc(100vh-8rem)]" :class="[
      isDark ? 'bg-gray-800/50 border-gray-800' : 'bg-gray-50 border-gray-200'
    ]" @contextmenu.prevent>
      <!-- Right content section -->
      <div class="flex-1">
        <!-- Content header with breadcrumbs and search -->
        <div class="flex items-center justify-between p-4 border-b" :class="isDark ? 'border-gray-800' : 'border-gray-200'">
          <!-- Breadcrumbs -->
          <div class="flex items-center gap-2">
            <template v-for="(crumb, index) in breadcrumbs" :key="index">
              <span 
                class="cursor-pointer hover:text-primary-500"
                @click="handleBreadcrumbClick(crumb)"
              >
                {{ crumb.name }}
              </span>
              <UIcon 
                v-if="index < breadcrumbs.length - 1"
                name="i-heroicons-chevron-right" 
                class="w-4 h-4 opacity-50"
              />
            </template>
          </div>

          <!-- Search Input -->
          <div class="relative w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search files and folders..."
              class="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-primary-500 focus:bg-transparent transition-colors"
              :class="isDark ? 'text-gray-200' : 'text-gray-700'"
            />
            <UIcon
              :name="isSearching ? 'i-heroicons-arrow-path' : 'i-heroicons-magnifying-glass'"
              class="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50"
              :class="{ 'animate-spin': isSearching }"
            />
          </div>
        </div>

        <!-- Column Headers -->
        <div class="sticky top-0 bg-inherit border-b px-4 py-2" :class="isDark ? 'border-gray-800' : 'border-gray-200'">
          <div class="flex items-center text-sm font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            <div 
              class="flex-1 cursor-pointer hover:text-primary-500 flex items-center gap-1"
              @click="handleSort('name')"
            >
              Name
              <span class="text-xs" v-if="sortConfig.key === 'name'">
                {{ getSortIndicator('name') }}
              </span>
            </div>
            <div 
              class="w-32 text-right cursor-pointer hover:text-primary-500 flex items-center justify-end gap-1"
              @click="handleSort('size')"
            >
              Size
              <span class="text-xs" v-if="sortConfig.key === 'size'">
                {{ getSortIndicator('size') }}
              </span>
            </div>
            <div 
              class="w-48 text-right cursor-pointer hover:text-primary-500 flex items-center justify-end gap-1"
              @click="handleSort('date')"
            >
              Date Modified
              <span class="text-xs" v-if="sortConfig.key === 'date'">
                {{ getSortIndicator('date') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="flex-1 overflow-y-auto">
          <!-- Loading State -->
          <div v-if="loading" class="space-y-2">
            <USkeleton v-for="i in 3" :key="i" class="h-12 w-full" />
          </div>

          <!-- Empty State (No folders and files) -->
          <div 
            v-else-if="!subfolders.length && !fileList.length" 
            class="text-center py-12"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            <UIcon 
              name="i-heroicons-folder-open" 
              class="w-12 h-12 mx-auto mb-4 opacity-50" 
            />
            <p v-if="selectedFolder">This folder is empty</p>
            <p v-else>Select a folder to view its contents</p>
            <UButton 
              v-if="selectedFolder"
              color="primary" 
              variant="ghost" 
              class="mt-4"
              @click="triggerFileUpload"
            >
              Upload Files
            </UButton>
          </div>

          <!-- Content List -->
          <div v-else class="divide-y" :class="isDark ? 'divide-gray-800' : 'divide-gray-200'">
            <!-- Sorted Folders -->
            <div
              v-for="folder in sortedContent.folders"
              :key="`folder-${folder.id}`"
              class="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer group"
              @click="handleFolderClick(folder)"
            >
              <div class="flex-1 flex items-center gap-3">
                <UIcon 
                  name="i-heroicons-folder" 
                  class="w-5 h-5"
                  :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                />
                <span class="truncate">{{ folder.name }}</span>
              </div>
              <div class="w-32 text-right text-sm" />
              <div 
                class="w-48 text-right text-sm"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                {{ formatDate(folder.updated_at) }}
              </div>
            </div>

            <!-- Sorted Files -->
            <div
              v-for="file in sortedContent.files"
              :key="`file-${file.id}`"
              class="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer group"
              @click="handleFileClick(file)"
              @contextmenu.prevent="(e) => onFileContextMenu(e, file)"
            >
              <div class="flex-1 flex items-center gap-3">
                <UIcon 
                  :name="getFileIcon(file.type)" 
                  class="w-5 h-5"
                  :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                />
                <span class="truncate">{{ file.name }}</span>
              </div>
              <div 
                class="w-32 text-right text-sm"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                {{ formatFileSize(file.size) }}
              </div>
              <div 
                class="w-48 text-right text-sm"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                {{ formatDate(file.updated_at) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Hidden File Input -->
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          @change="handleFileInputChange"
          multiple
        />

        <!-- File Preview Modal -->
        <UModal v-model="showPreview">
          <div class="max-w-3xl">
            <div class="p-4 bg-white dark:bg-gray-800 rounded-lg">
              <!-- Image Preview -->
              <template v-if="selectedFile?.type.startsWith('image/')">
                <img 
                  :src="getFileUrl(selectedFile.id)" 
                  :alt="selectedFile.name"
                  class="max-h-[80vh] w-auto mx-auto"
                />
              </template>

              <!-- Video Preview -->
              <template v-else-if="selectedFile?.type.startsWith('video/')">
                <video 
                  controls 
                  class="max-h-[80vh] w-auto mx-auto"
                >
                  <source :src="getFileUrl(selectedFile.id)" :type="selectedFile.type">
                </video>
              </template>

              <!-- Other File Types -->
              <template v-else>
                <div class="text-center py-8">
                  <UIcon 
                    :name="getFileIcon(selectedFile?.type || '')" 
                    class="w-16 h-16 mx-auto mb-4 opacity-50"
                  />
                  <p class="mb-4">Preview not available for this file type</p>
                  <UButton 
                    color="primary"
                    @click="selectedFile && downloadFile(selectedFile)"
                  >
                    Download File
                  </UButton>
                </div>
              </template>
            </div>
          </div>
        </UModal>
      </div>

      <!-- Create Folder Modal -->
      <UModal v-model="showCreateModal">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold leading-6">
                Create New Folder
              </h3>
            </div>
          </template>

          <form @submit.prevent="handleCreateFolder" class="space-y-4">
            <UFormGroup label="Folder Name" required :error="modalError">
              <UInput
                v-model="newFolderName"
                placeholder="Enter folder name"
                :error="!!modalError"
                @keyup="modalError = validateFolderName(newFolderName)"
              />
            </UFormGroup>

            <UFormGroup label="Parent Folder">
              <USelect
                v-model="selectedParentId"
                :options="folderOptions"
                option-attribute="name"
                value-attribute="id"
                placeholder="Select parent folder (optional)"
                searchable
                :clearable="true"
              />
            </UFormGroup>
          </form>

          <template #footer>
            <div class="flex justify-end space-x-4">
              <UButton 
                color="gray" 
                variant="outline"
                :class="[
                  isDark 
                    ? 'border-gray-700 hover:bg-gray-800' 
                    : 'border-gray-200 hover:bg-gray-50'
                ]"
                @click="showCreateModal = false"
              >
                Cancel
              </UButton>
              <UButton 
                color="primary" 
                :loading="loading" 
                :disabled="!!modalError || !newFolderName.trim()"
                @click="handleCreateFolder"
              >
                Create
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>

      <!-- Context Menu with improved size -->
      <UContextMenu 
        v-model="isContextMenuOpen" 
        :virtual-element="virtualElement"
        :popper="{ arrow: true, placement: 'right-start' }"
        class="context-menu"
      >
        <div class="p-2 min-w-[200px]">
          <div class="px-3 py-2 text-sm font-medium text-gray-400 border-b border-gray-700 mb-2">
            {{ selectedContextFolder?.name }}
          </div>
          <UButton
            block
            color="gray"
            variant="ghost"
            class="justify-start px-3 py-2 text-base w-full mb-1"
            @click="handleStartRename"
          >
            <template #leading>
              <UIcon name="i-heroicons-pencil-square" class="w-5 h-5" />
            </template>
            <span class="ml-2">Rename</span>
          </UButton>
          <UButton
            block
            color="red"
            variant="ghost"
            class="justify-start px-3 py-2 text-base w-full"
            @click="showDeleteConfirm"
          >
            <template #leading>
              <UIcon name="i-heroicons-trash" class="w-5 h-5" />
            </template>
            <span class="ml-2">Delete</span>
          </UButton>
        </div>
      </UContextMenu>

      <!-- Delete Confirmation Modal -->
      <UModal v-model="showDeleteModal">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold leading-6">
                Delete Folder
              </h3>
            </div>
          </template>

          <p class="text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete "{{ selectedContextFolder?.name }}"? This action cannot be undone.
          </p>

          <template #footer>
            <div class="flex justify-end space-x-4">
              <UButton 
                color="gray" 
                variant="outline" 
                @click="showDeleteModal = false"
              >
                Cancel
              </UButton>
              <UButton 
                color="red" 
                variant="solid" 
                :loading="isDeleting"
                @click="handleDelete"
              >
                Delete
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>

      <!-- Rename Folder Modal -->
      <UModal v-model="showRenameModal">
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
            Rename Folder
          </h3>
          
          <UFormGroup label="New Name" :class="isDark ? 'text-gray-200' : 'text-gray-700'">
            <UInput
              v-model="editedName"
              :class="isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'"
              placeholder="Enter new folder name"
              @keyup.enter="handleSaveRenameWithReload"
            />
          </UFormGroup>

          <p v-if="renameError" class="mt-2 text-sm text-red-500">
            {{ renameError }}
          </p>

          <div class="flex justify-end gap-2 mt-4">
            <UButton
              color="gray"
              variant="solid"
              :loading="isRenaming"
              @click="cancelRename"
            >
              Cancel
            </UButton>
            <UButton
              color="primary"
              variant="solid"
              :loading="isRenaming"
              @click="handleSaveRenameWithReload"
            >
              Save
            </UButton>
          </div>
        </div>
      </UModal>

      <!-- File Context Menu with virtual element -->
      <UContextMenu 
        v-model="fileContextMenu.isOpen" 
        :items="fileContextMenuItems"
        :virtual-element="{
          getBoundingClientRect: () => ({
            width: 0,
            height: 0,
            top: fileContextMenu.y,
            right: fileContextMenu.x,
            bottom: fileContextMenu.y,
            left: fileContextMenu.x,
            x: fileContextMenu.x,
            y: fileContextMenu.y,
          })
        }"
      />
    </div>
  </div>
</template>
  
<script setup lang="ts">
import type { Folder, FolderTree } from '~/types/folder'
import { useFolders } from '~/composables/useFolders'
import { useMouse, useWindowScroll } from '@vueuse/core'
import { folderApi } from '~/services/api'
import { useRenameFolder } from '~/composables/useRenameFolder'
import { ref, computed } from 'vue'
import type { File } from '~/types/file'
import { fileApi } from '~/services/file.api'
import { useSearch } from '~/composables/useSearch'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const toast = useToast()
  
const { 
  allFolders,
  selectedFolder,
  loading,
  error,
  breadcrumbs,
  loadAllFolders,
  toggleFolder,
  selectFolder,
  createFolder,
  reloadFolders,
  loadSubfolders
} = useFolders()

const { x, y } = useMouse()
const { y: windowY } = useWindowScroll()

// Context menu state
const isContextMenuOpen = ref(false)
const virtualElement = ref({ getBoundingClientRect: () => ({}) })
const selectedContextFolder = ref<FolderTree | null>(null)
const editingFolder = ref<FolderTree | null>(null)

// Handle context menu
function onFolderContextMenu(event: MouseEvent, folder: FolderTree) {
  event.preventDefault()
  event.stopPropagation()
  
  const top = unref(y) - unref(windowY)
  const left = unref(x)

  virtualElement.value.getBoundingClientRect = () => ({
    width: 0,   
    height: 0,
    top,
    left
  })

  selectedContextFolder.value = folder
  isContextMenuOpen.value = true
}

// Handle starting rename
const handleStartRename = () => {
  if (selectedContextFolder.value) {
    startRename(selectedContextFolder.value)
    isContextMenuOpen.value = false
  }
}

// Breadcrumb click handler
const handleBreadcrumbClick = (crumb: Folder) => {
  selectFolder
}

  
// Click outside handler
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.folder-name-input') && editingFolder.value) {
    handleSaveRename()
  }
}

// Remove duplicate onUnmounted declarations and combine cleanup logic
onUnmounted(() => {
  // Remove event listeners
  document.removeEventListener('click', handleClickOutside)
  
  // Reset state
  selectedContextFolder.value = null
  editingFolder.value = null
  selectedFile.value = null
  fileList.value = []
  
  // Clear modals
  showCreateModal.value = false
  showDeleteModal.value = false
  showRenameModal.value = false
  showPreview.value = false
  
  // Reset search
  resetSearch()
})

// Initialize data
onMounted(async () => {
  await loadAllFolders()
})

const showCreateModal = ref(false)
const newFolderName = ref('')
const selectedParentId = ref<number | undefined>(undefined)

const folderOptions = computed(() => {
  return allFolders.value.map(folder => ({
    id: folder.id,
    name: folder.name,
    disabled: false
  }))
})

const modalError = ref<string | undefined>(undefined)

const validateFolderName = (name: string): string | undefined => {
  if (!name) return 'Folder name is required'
  if (name.trim().length === 0) return 'Folder name cannot be only whitespace'
  if (name.length > 255) return 'Folder name must be less than 255 characters'
  return undefined
}

const handleCreateFolder = async () => {
  if (!newFolderName.value) {
    modalError.value = 'Folder name is required'
    return
  }

  // Validate folder name
  const validationError = validateFolderName(newFolderName.value)
  if (validationError) {
    modalError.value = validationError
    return
  }

  modalError.value = undefined
  try {
    // Convert parent_id to number if it exists
    const parentId = selectedParentId.value ? Number(selectedParentId.value) : undefined
    
    await createFolder(newFolderName.value.trim(), parentId)
    showCreateModal.value = false
    newFolderName.value = ''
    selectedParentId.value = undefined
    
    // Force reload folders
    await reloadFolders()
    
    toast.add({
      id: Date.now().toString(),
      title: 'Success',
      description: 'Folder created successfully',
      icon: 'i-heroicons-check-circle',
      color: 'green',
      timeout: 3000
    })
  } catch (err) {
    modalError.value = err instanceof Error ? err.message : 'Failed to create folder'
    console.error('Failed to create folder:', err)
    
    toast.add({
      id: Date.now().toString(),
      title: 'Error',
      description: err instanceof Error ? err.message : 'Failed to create folder',
      icon: 'i-heroicons-x-circle',
      color: 'red',
      timeout: 5000
    })
  }
}

// Reset form when modal is opened
watch(showCreateModal, (newValue) => {
  if (newValue) {
    newFolderName.value = ''
    selectedParentId.value = undefined
    modalError.value = undefined
  }
})

// Add date formatting function
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Add helper function to transform Folder to FolderTree
const transformToFolderTree = (folder: Folder): FolderTree => {
  return {
    ...folder,
    level: calculateFolderLevel(folder),
    isOpen: false,
    children: folder.children?.map(child => transformToFolderTree(child))
  }
}

// Update the calculate level function
const calculateFolderLevel = (folder: Folder): number => {
  let level = 0
  let current: Folder = folder
  
  while (current.parent_id !== null && current.parent_id !== undefined) {
    level++
    const parent = allFolders.value.find(f => f.id === current.parent_id)
    if (!parent) break
    current = parent
  }
  
  return level
}
// Delete state
const showDeleteModal = ref(false)
const isDeleting = ref(false)

// Show delete confirmation
const showDeleteConfirm = () => {
  showDeleteModal.value = true
  isContextMenuOpen.value = false
}

// Handle delete
const handleDelete = async () => {
  if (!selectedContextFolder.value) return

  isDeleting.value = true
  try {
    await folderApi.deleteFolder(selectedContextFolder.value.id)
    await reloadFolders()
    
    toast.add({
      title: 'Success',
      description: 'Folder deleted successfully',
      icon: 'i-heroicons-check-circle',
      color: 'green',
    })
    showDeleteModal.value = false
  } catch (err) {
    console.error('Failed to delete folder:', err)
    toast.add({
      title: 'Error',
      description: err instanceof Error ? err.message : 'Failed to delete folder',
      icon: 'i-heroicons-x-circle',
      color: 'red',
    })
  } finally {
    isDeleting.value = false
  }
}

const handleFolderClick = async (folder: Folder) => {
  // Transform the folder to FolderTree format
  const folderTree: FolderTree = {
    ...folder,
    level: calculateFolderLevel(folder),
    isOpen: false,
    children: []
  }
  
  selectFolder(folderTree)
  await loadSubfolders(folder.id)
}

const {
  showRenameModal,
  editedName,
  renameError,
  isRenaming,
  startRename,
  cancelRename,
  handleSaveRename
} = useRenameFolder()

const handleSaveRenameWithReload = () => handleSaveRename(reloadFolders)

// File context menu
const fileContextMenu = ref({
  isOpen: false,
  x: 0,
  y: 0,
})

const fileList = ref<File[]>([])
const selectedFile = ref<File | null>(null)
const uploading = ref(false)

const fileContextMenuItems = computed(() => [
  [
    {
      label: 'Rename',
      icon: 'i-heroicons-pencil',
      click: () => selectedFile.value && handleRenameFile(selectedFile.value),
    },
    {
      label: 'Download',
      icon: 'i-heroicons-arrow-down-tray',
      click: () => selectedFile.value && handleDownloadFile(selectedFile.value),
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash',
      click: () => selectedFile.value && handleDeleteFile(selectedFile.value),
    },
  ],
])

// File handlers
const handleRenameFile = async (file: File) => {
  const newName = prompt('Enter new name:', file.name)
  if (!newName || newName === file.name) return

  try {
    await fileApi.updateFile(file.id, newName)
    // Reload files after rename
    if (selectedFolder.value) {
      const response = await fileApi.getFiles(selectedFolder.value.id)
      fileList.value = response // Assuming response is File[]
    }
    toast.add({
      title: 'Success',
      description: 'File renamed successfully',
      color: 'green',
      icon: 'i-heroicons-check-circle'
    })
  } catch (error) {
    console.error('Error renaming file:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to rename file',
      color: 'red',
      icon: 'i-heroicons-x-circle'
    })
  }
}

const handleDownloadFile = (file: File) => {
  // Create a temporary link to download the file
  const link = document.createElement('a')
  link.href = `${useRuntimeConfig().public.apiBaseUrl}/files/${file.id}/download`
  link.download = file.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleDeleteFile = async (file: File) => {
  if (!confirm(`Are you sure you want to delete "${file.name}"?`)) return

  try {
    await fileApi.deleteFile(file.id)
    // Remove file from list with proper typing
    fileList.value = fileList.value.filter((f: File) => f.id !== file.id)
    toast.add({
      title: 'Success',
      description: 'File deleted successfully',
      color: 'green',
      icon: 'i-heroicons-check-circle'
    })
  } catch (error) {
    console.error('Error deleting file:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to delete file',
      color: 'red',
      icon: 'i-heroicons-x-circle'
    })
  }
}

// File context menu handlers
const onFileContextMenu = (e: MouseEvent, file: File) => {
  e.preventDefault()
  selectedFile.value = file
  fileContextMenu.value = {
    isOpen: true,
    x: e.clientX,
    y: e.clientY,
  }
}

// Watch for folder changes to load files
watch(() => selectedFolder.value?.id, async (folderId) => {
  if (!folderId) {
    fileList.value = []
    return
  }
  
  loading.value = true
  try {
    const response = await fileApi.getFiles(folderId)
    fileList.value = response
  } catch (error) {
    console.error('Error loading files:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load files',
      color: 'red',
      icon: 'i-heroicons-x-circle'
    })
  } finally {
    loading.value = false
  }
})

// File upload handlers
const handleFileUpload = async (files: FileList) => {
  if (!selectedFolder.value || !files.length) return
  
  uploading.value = true
  try {
    // Create FormData and append each file
    const formData = new FormData()
    formData.append('folder_id', selectedFolder.value.id.toString())
    Array.from(files).forEach(file => {
      formData.append('files', file)
    })
    
    // Use createFile instead of uploadFiles
    await fileApi.createFile(formData)
    
    // Reload files after upload
    if (selectedFolder.value) {
      const response = await fileApi.getFiles(selectedFolder.value.id)
      fileList.value = response
    }
    
    toast.add({
      title: 'Success',
      description: 'Files uploaded successfully',
      color: 'green',
      icon: 'i-heroicons-check-circle'
    })
  } catch (error) {
    console.error('Error uploading files:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to upload files',
      color: 'red',
      icon: 'i-heroicons-x-circle'
    })
  } finally {
    uploading.value = false
  }
}

// Utility functions
const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return 'i-heroicons-photo'
  if (type.startsWith('video/')) return 'i-heroicons-film'
  if (type.includes('pdf')) return 'i-heroicons-document-text'
  if (type.includes('spreadsheet')) return 'i-heroicons-table-cells'
  if (type.includes('document')) return 'i-heroicons-document'
  return 'i-heroicons-document'
}

const formatFileSize = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

// Add downloadFile function
const downloadFile = (file: File) => {
  if (!file) return
  
  const link = document.createElement('a')
  link.href = getFileUrl(file.id)
  link.download = file.name // This will suggest the file name to save as
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Update handleFileClick to use the new downloadFile function
const handleFileClick = (file: File) => {
  if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
    selectedFile.value = file
    showPreview.value = true
  } else {
    downloadFile(file)
  }
}

// Add file input ref
const fileInput = ref<HTMLInputElement | null>(null)

// Add triggerFileUpload function
const triggerFileUpload = () => {
  // Trigger the hidden file input click
  fileInput.value?.click()
}

// Make sure handleFileInputChange is defined
const handleFileInputChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    handleFileUpload(input.files)
  }
}

// showpreview
const showPreview = ref(false)
// getfileurl
const getFileUrl = (fileId: number) => {
  return `${useRuntimeConfig().public.apiBaseUrl}/files/${fileId}/view`
}

// Add subfolders state
const subfolders = computed(() => {
  if (!selectedFolder.value) return []
  return allFolders.value
    .find(f => f.id === selectedFolder.value?.id)
    ?.children || []
})

// Add sorting state
const sortConfig = ref<{
  key: 'name' | 'size' | 'date' | null
  direction: 'asc' | 'desc'
}>({
  key: null,
  direction: 'asc'
})

// Sort function for both folders and files
const sortedContent = computed(() => {
  // If searching, return search results
  if (searchQuery.value.trim()) {
    return {
      folders: searchResults.value?.folders || [],
      files: searchResults.value?.files || []
    }
  }

  // Otherwise return normal folder contents
  return {
    folders: selectedFolder.value ? subfolders.value : [],
    files: fileList.value
  }
})

// Handle column header click
const handleSort = (key: 'name' | 'size' | 'date') => {
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

// Helper function to show sort indicator
const getSortIndicator = (key: 'name' | 'size' | 'date') => {
  if (sortConfig.value.key !== key) return ''
  return sortConfig.value.direction === 'asc' ? '↑' : '↓'
}

// Initialize search
const { searchQuery, searchResults, isSearching, resetSearch } = useSearch()

// Update folder selection to reset search
</script>

<style scoped>
/* Modern scrollbar styling */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

/* Dark/Light mode adjustments */
:deep(.dark) .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
}

:deep(.light) .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
}

/* Add this if you want to ensure the date info doesn't wrap awkwardly */
.folder-info {
  white-space: nowrap;
}

/* Ensure the sticky header works properly */
.overflow-y-auto {
  position: relative;
}

/* Prevent text overflow */
.truncate {
  max-width: 100%;
}

/* Add these styles for the context menu buttons */
:deep(.context-menu-button) {
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  transition: all 0.2s;
}

:deep(.context-menu-button:hover) {
  background-color: rgba(255, 255, 255, 0.05);
}

:deep(.dark .context-menu-button:hover) {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Add shadow and border to context menu */
:deep(.context-menu) {
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Smooth transitions */
:deep(.context-menu-enter-active),
:deep(.context-menu-leave-active) {
  transition: opacity 0.2s ease;
}

:deep(.context-menu-enter-from),
:deep(.context-menu-leave-to) {
  opacity: 0;
}

/* Prevent text selection when right-clicking */
.prevent-select {
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.folder-name-input {
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: 1px solid rgb(75, 85, 99);
  border-radius: 0.375rem;
  color: inherit;
  font-size: inherit;
  transition: all 0.2s ease;
}

.folder-name-input:focus {
  outline: none;
  border-color: rgb(59, 130, 246);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.dark .folder-name-input {
  border-color: rgb(75, 85, 99);
}

.dark .folder-name-input:focus {
  border-color: rgb(107, 114, 128);
  box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.2);
}

/* Button hover effects */
:deep(.context-menu-button:hover) {
  background-color: rgba(255, 255, 255, 0.05);
}

:deep(.dark .context-menu-button:hover) {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Context Menu Styles */
:deep(.context-menu) {
  --context-menu-width: 240px;
  min-width: var(--context-menu-width);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 0.5rem;
}

/* Folder name input styles */
.folder-name-input {
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: 1px solid rgb(75, 85, 99);
  border-radius: 0.375rem;
  color: inherit;
  font-size: inherit;
}

.folder-name-input:focus {
  outline: none;
  border-color: rgb(59, 130, 246);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.dark .folder-name-input {
  border-color: rgb(75, 85, 99);
}

.dark .folder-name-input:focus {
  border-color: rgb(107, 114, 128);
}

/* Button hover effects */
:deep(.context-menu-button:hover) {
  background-color: rgba(255, 255, 255, 0.05);
}

:deep(.dark .context-menu-button:hover) {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Add some transitions for the sort indicators */
.text-xs {
  transition: transform 0.2s ease;
}

/* Optional: Add a subtle rotation animation when changing sort direction */
@keyframes sortRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(180deg); }
}

.sort-indicator-anim {
  animation: sortRotate 0.2s ease;
}
</style>