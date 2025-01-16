<template>
  <div class="folder-tree">
    <div v-for="folder in folders" :key="getUniqueId(folder)">
      <UButton
        :class="[
          'w-full text-left flex items-center gap-2 py-2 text-base',
          isSelected(folder) ? (isDark ? 'bg-primary-500/20 text-primary-500' : 'bg-primary-50 text-primary-500') : '',
          isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-100'
        ]"
        color="gray"
        variant="ghost"
        :style="{ paddingLeft: `${folder.level * 20 + 8}px` }"
        @click="onFolderClick(folder)"
      >
        <UIcon
          v-if="folder.children?.length"
          :name="folder.isOpen ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
          class="flex-shrink-0 w-5 h-5"
          :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          @click.stop="onToggle(folder)"
        />
        <UIcon
          name="i-heroicons-folder"
          class="flex-shrink-0 w-5 h-5"
          :class="[
            isSelected(folder) ? 'text-primary-500' : (isDark ? 'text-gray-400' : 'text-gray-500')
          ]"
        />
        <span :class="[
          isSelected(folder) ? 'font-medium' : '',
          isDark ? 'text-gray-200' : 'text-gray-700'
        ]">
          {{ folder.name }}
        </span>
      </UButton>
      
      <div v-if="folder.isOpen && folder.children?.length">
        <FolderTree 
          :folders="folder.children"
          :selected-folder-id="selectedFolderId"
          @select="onSelect"
          @toggle="onToggle"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FolderTree } from '~/types/folder'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const props = defineProps<{
  folders: FolderTree[]
  selectedFolderId: string | null
}>()

const emit = defineEmits<{
  select: [folder: FolderTree]
  toggle: [folder: FolderTree]
}>()

const getUniqueId = (folder: FolderTree): string => {
  let path = `${folder.id}`
  let current = folder
  let parent = folder.parent_id ? props.folders.find(f => f.id === folder.parent_id) : null
  
  while (parent) {
    path = `${parent.id}-${path}`
    current = parent
    parent = current.parent_id ? props.folders.find(f => f.id === current.parent_id) : null
  }
  
  return path
}

const isSelected = (folder: FolderTree) => 
  props.selectedFolderId === getUniqueId(folder)

const onFolderClick = (folder: FolderTree) => {
  emit('select', folder)
}

const onSelect = (folder: FolderTree) => {
  emit('select', folder)
}

const onToggle = (folder: FolderTree) => {
  emit('toggle', folder)
}
</script> 