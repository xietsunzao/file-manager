<template>
  <div :class="[
    'min-h-screen transition-colors duration-300',
    isDark ? 'dark bg-gray-950' : 'bg-gray-100'
  ]">
    <UContainer class="py-8">
      <header class="mb-8">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            Folder Explorer
          </h1>
          <UButton
            :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'"
            color="gray"
            variant="ghost"
            @click="toggleColorMode"
          />
        </div>
      </header>

      <NuxtPage />
    </UContainer>

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const toggleColorMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
  colorMode.value = isDark.value ? 'light' : 'dark'
}

onMounted(() => {
  const savedMode = localStorage.getItem('color-mode')
  if (savedMode) {
    colorMode.preference = savedMode
    colorMode.value = savedMode
  } else {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    colorMode.preference = systemDark ? 'dark' : 'light'
    colorMode.value = systemDark ? 'dark' : 'light'
  }
})
</script>
