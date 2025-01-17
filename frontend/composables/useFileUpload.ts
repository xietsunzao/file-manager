import { ref } from 'vue'
import { fileApi } from '~/services/file.api'

export const useFileUpload = () => {
    const isUploading = ref(false)
    const uploadProgress = ref(0)
    const uploadError = ref<string | null>(null)

    const uploadFile = async (formData: FormData, onProgress?: (progress: number) => void) => {
        isUploading.value = true
        uploadError.value = null
        uploadProgress.value = 0

        try {
            const response = await fileApi.uploadFile(formData, (progress) => {
                uploadProgress.value = progress
            })

            const toast = useToast()
            toast.add({
                title: 'Success',
                description: 'File uploaded successfully',
                icon: 'i-heroicons-check-circle',
                color: 'green',
            })

            return response
        } catch (error) {
            console.error('Upload error:', error)
            uploadError.value = error instanceof Error ? error.message : 'Failed to upload file'
            
            const toast = useToast()
            toast.add({
                title: 'Error',
                description: uploadError.value,
                icon: 'i-heroicons-x-circle',
                color: 'red',
            })

            throw error
        } finally {
            isUploading.value = false
        }
    }

    return {
        isUploading,
        uploadProgress,
        uploadError,
        uploadFile
    }
} 