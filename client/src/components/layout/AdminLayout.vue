<template>
  <v-app>
    <v-navigation-drawer app permanent width="260">
      <div class="pa-4 text-h6 font-weight-bold">
        Bloomera Admin
      </div>

      <v-list nav density="comfortable">
        <v-list-item title="Dashboard" prepend-icon="mdi-view-dashboard-outline" to="/admin" />
        <v-list-item title="Rapoarte" prepend-icon="mdi-chart-line" to="/admin/reports" />
        <v-list-item title="Produse" prepend-icon="mdi-flower-outline" to="/admin/products" />
        <v-list-item title="Comenzi" prepend-icon="mdi-receipt-text-outline" to="/admin/orders" />
        <v-list-item title="Utilizatori" prepend-icon="mdi-account-outline" to="/admin/users" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
</script>