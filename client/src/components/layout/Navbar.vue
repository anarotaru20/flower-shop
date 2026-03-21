<template>
  <header class="navbar">
    <div class="container navbar-content">
      <RouterLink to="/" class="brand">Bloomera</RouterLink>

      <nav class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/products">Shop</RouterLink>
        <RouterLink to="/cart" class="cart-link">
          🛒
          <span v-if="cart.cartCount" class="cart-badge">
            {{ cart.cartCount }}
          </span>
        </RouterLink>

        <template v-if="isAuthenticated">
          <RouterLink to="/profile">Profile</RouterLink>
          <RouterLink to="/orders">Orders</RouterLink>
          <button class="logout-btn" @click="handleLogout">Logout</button>
        </template>

        <template v-else>
          <RouterLink to="/login">Login</RouterLink>
          <RouterLink to="/register">Register</RouterLink>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()

const { isAuthenticated, token, user } = storeToRefs(auth)

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 250, 247, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #f1e6e1;
}

.container {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
}

.navbar-content {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand {
  text-decoration: none;
  font-size: 28px;
  font-weight: 800;
  color: #8f5f6b;
  letter-spacing: 0.02em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.nav-links a {
  text-decoration: none;
  color: #5a514d;
  font-weight: 600;
  transition: 0.2s ease;
}

.nav-links a:hover {
  color: #c48797;
}

.nav-links a.router-link-active {
  color: #c48797;
}

.logout-btn {
  border: none;
  background: transparent;
  color: #5a514d;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  transition: 0.2s ease;
}

.logout-btn:hover {
  color: #c48797;
}

.cart-link {
  position: relative;
  font-size: 20px;
  text-decoration: none;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -10px;
  background: #dba4b2;
  color: white;
  font-size: 12px;
  font-weight: 700;
  border-radius: 999px;
  padding: 2px 6px;
  min-width: 18px;
  text-align: center;
}

@media (max-width: 768px) {
  .navbar-content {
    padding: 14px 0;
    align-items: flex-start;
    flex-direction: column;
  }

  .nav-links {
    width: 100%;
    gap: 14px;
  }
}
</style>
