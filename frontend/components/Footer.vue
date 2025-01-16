<template>
  <footer :class="[
    'py-2 border-t transition-colors',
    isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'
  ]">
    <div class="container mx-auto px-6">
      <div class="flex h-8 items-center justify-between">
        <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          © 2024 Jefri Maruli H
        </span>
        <div class="flex gap-4">
          <a 
            href="https://github.com/xietsunzao/file-manager"
            target="_blank"
            class="text-sm transition-colors"
            :class="isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'"
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