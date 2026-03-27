<template>
  <v-app>
    <v-app-bar v-if="isMobile" flat class="admin-mobile-bar">
      <v-btn icon variant="text" @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-app-bar-title class="font-weight-bold">
        Salut, {{ store.user?.first_name }} {{ store.user?.last_name }}
      </v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      :permanent="!isMobile"
      :temporary="isMobile"
      :width="260"
    >
      <div class="pa-4 text-h6 font-weight-bold admin-drawer-title">
        Salut, {{ store.user?.first_name }} {{ store.user?.last_name }}
      </div>

      <v-list nav density="comfortable">
        <v-list-item
          title="Dashboard"
          prepend-icon="mdi-view-dashboard-outline"
          to="/admin"
          @click="closeDrawer"
        />
        <v-list-item
          title="Rapoarte"
          prepend-icon="mdi-chart-line"
          to="/admin/reports"
          @click="closeDrawer"
        />
        <v-list-item
          title="Produse"
          prepend-icon="mdi-flower-outline"
          to="/admin/products"
          @click="closeDrawer"
        />
        <v-list-item
          title="Comenzi"
          prepend-icon="mdi-receipt-text-outline"
          to="/admin/orders"
          @click="closeDrawer"
        />
        <v-list-item
          title="Utilizatori"
          prepend-icon="mdi-account-outline"
          to="/admin/users"
          @click="closeDrawer"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main class="admin-main">
      <v-container fluid class="admin-container">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/auth'

const store = useAuthStore()
onMounted(() => {
  if (store.token && !store.user) {
    store.fetchProfile()
  }
})

const drawer = ref(true)
const { mdAndDown } = useDisplay()

const isMobile = mdAndDown

watch(
  isMobile,
  (value) => {
    drawer.value = !value
  },
  { immediate: true },
)

function closeDrawer() {
  if (isMobile.value) {
    drawer.value = false
  }
}
</script>

<style scoped>
.admin-mobile-bar {
  border-bottom: 1px solid #f1e6e1;
  background: #fffaf7;
}

.admin-drawer-title {
  color: #4c3a32;
  border-bottom: 1px solid #f1e6e1;
  text-align: start;
}

.admin-main {
  min-height: 100vh;
}

.admin-container {
  padding: 24px;
}

@media (max-width: 960px) {
  .admin-container {
    padding: 16px;
  }
}

@media (max-width: 600px) {
  .admin-container {
    padding: 12px;
  }
}
</style>
