<template>
  <v-app>
    <Navbar v-if="showNavbar" />

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'

const route = useRoute()

const hiddenNavbarRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/home']

const showNavbar = computed(() => !hiddenNavbarRoutes.includes(route.path))
</script>
<style scoped>
html, body, #app {
  height: 100%;
}
</style>

