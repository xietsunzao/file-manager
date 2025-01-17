<template>
    <div>
        <input
            ref="fileInput"
            type="file"
            multiple
            class="hidden"
            @change="handleFileSelect"
        >

        <!-- Upload Progress -->
        <div v-if="isUploading" class="mt-4">
            <div class="text-sm mb-2">
                Uploading... {{ uploadProgress }}%
            </div>
            <UProgress
                :value="uploadProgress"
                color="primary"
                size="xs"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const fileInput = ref<HTMLInputElement | null>(null)
const { isUploading, uploadProgress, uploadFile } = useFileUpload()
const { selectedFolder } = useFolders()

const emit = defineEmits(['upload-complete'])

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFileSelect = async (event: Event) => {
    const input = event.target as HTMLInputElement
    if (!input.files?.length || !selectedFolder.value) return

    try {
        const formData = new FormData()
        
        // Add each file to the formData
        Array.from(input.files).forEach(file => {
            formData.append('files', file)
        })
        
        // Add the folder ID
        formData.append('folder_id', selectedFolder.value.id.toString())

        await uploadFile(formData, (progress) => {
            uploadProgress.value = progress
        })
        
        // Clear the input
        input.value = ''
        
        // Emit event to refresh file list
        emit('upload-complete')
    } catch (error) {
        console.error('Upload failed:', error)
    }
}
</script> 