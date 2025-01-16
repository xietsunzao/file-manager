<template>
  <div :class="[
    'min-h-screen flex flex-col transition-colors duration-300',
    isDark ? 'dark bg-gray-950' : 'bg-gray-100'
  ]">
    <!-- Navbar -->
    <Navbar />
    
    <!-- Main Content with padding -->
    <main class="flex-1 container mx-auto px-6 py-8">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <Footer />
    
    <!-- Notifications -->
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

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

<style>
/* Ensure the layout takes full height */
html, body, #__nuxt {
  height: 100%;
}

/* Add space for fixed footer */
main {
  min-height: calc(100vh - 4rem - 2.5rem); /* Subtract navbar and footer heights */
  padding-bottom: 2.5rem; /* Footer height */
}

/* Dark mode overrides */
.dark {
  color-scheme: dark;
}
</style>
