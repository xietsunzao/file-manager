<template>
  <footer :class="[
    'fixed bottom-0 w-full border-t transition-colors',
    isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
  ]">
    <div class="container mx-auto px-6">
      <div class="flex h-10 items-center justify-between">
        <span :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          © 2024 Folder Explorer
        </span>
        <div class="flex gap-4">
          <a 
            href="#" 
            :class="[
              'text-sm transition-colors',
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Documentation
          </a>
          <a 
            href="#" 
            :class="[
              'text-sm transition-colors',
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
</script>