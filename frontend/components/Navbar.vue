<template>
  <header :class="[
    'border-b transition-colors',
    isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
  ]">
    <div class="container mx-auto px-6">
      <div class="flex h-16 items-center justify-between">
        <h1 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
          Folder Explorer
        </h1>
        <ClientOnly>
          <UButton
            color="gray"
            variant="ghost"
            :class="isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'"
            :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'"
            @click="toggleColorMode"
          />
        </ClientOnly>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const toggleColorMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>