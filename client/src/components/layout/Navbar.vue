<template>
  <header class="navbar">
    <div class="container navbar-top">
      <RouterLink to="/" class="brand">
        <span class="brand-pink">bloom</span>
        <span class="brand-green">era</span>
      </RouterLink>

      <!-- searchbar -->
      <div class="search-area" ref="searchRef">
        <form class="search-form" @submit.prevent="handleSearchSubmit">
          <input
            v-model.trim="searchQuery"
            type="text"
            class="search-input"
            placeholder="Caută buchete, plante, accesorii..."
            @focus="showSuggestions = true"
          />
          <button v-if="searchQuery" type="button" class="search-btn" @click="clearSearch">
            <v-icon size="20">mdi-close</v-icon>
          </button>

          <button v-else type="submit" class="search-btn" aria-label="Caută">
            <v-icon size="20">mdi-magnify</v-icon>
          </button>
        </form>

        <div v-if="showSuggestions && searchQuery" class="search-suggestions">
          <template v-if="filteredSuggestions.length">
            <RouterLink
              v-for="product in filteredSuggestions"
              :key="product.id"
              :to="`/products/${product.slug}`"
              class="search-suggestion-item"
              @click="closeSearch"
            >
              <div class="search-suggestion-image">
                <img v-if="product.image_url" :src="product.image_url" :alt="product.name" />
                <div v-else class="search-suggestion-image-placeholder">🌸</div>
              </div>

              <div class="search-suggestion-info">
                <div class="search-suggestion-name">
                  {{ product.name }}
                </div>
                <div class="search-suggestion-price">{{ product.price }} RON</div>
              </div>
            </RouterLink>

            <button type="button" class="search-see-all" @click="handleSearchSubmit">
              Apasă Enter pentru toate rezultatele →
            </button>
          </template>

          <div v-else class="search-no-results">Nu am găsit produse pentru „{{ searchQuery }}”</div>
        </div>
      </div>

      <nav class="nav-links">
        <RouterLink to="/cart" class="nav-item">
          <div class="nav-icon-wrap cart-icon">
            <v-icon size="20">mdi-cart-outline</v-icon>
            <span v-if="cart.cartCount" class="cart-badge">
              {{ cart.cartCount }}
            </span>
          </div>
          <span class="nav-label">Coș</span>
        </RouterLink>

        <template v-if="isAuthenticated">
          <RouterLink to="/profile" class="nav-item">
            <div class="nav-icon-wrap">
              <v-icon size="20">mdi-account-outline</v-icon>
            </div>
            <span class="nav-label">Profil</span>
          </RouterLink>

          <!-- <RouterLink to="/orders" class="nav-item">
            <div class="nav-icon-wrap">
              <v-icon size="20">mdi-package-variant-closed</v-icon>
            </div>
            <span class="nav-label">Comenzi</span>
          </RouterLink> -->

          <button class="nav-item logout-btn" @click="handleLogout">
            <div class="nav-icon-wrap">
              <v-icon size="20">mdi-logout-variant</v-icon>
            </div>
            <span class="nav-label">Logout</span>
          </button>
        </template>

        <template v-else>
          <RouterLink to="/login" class="nav-item">
            <div class="nav-icon-wrap">
              <v-icon size="20">mdi-account-outline</v-icon>
            </div>
            <span class="nav-label">Intra în cont</span>
          </RouterLink>
        </template>
      </nav>
    </div>

    <div class="navbar-bottom" @mouseleave="activeCategory = null">
      <div class="container category-row">
        <div
          v-for="category in categoriesWithProducts"
          :key="category.id"
          class="category-item"
          @mouseenter="activeCategory = category"
        >
          <RouterLink
            :to="`/products?category=${category.slug}`"
            class="category-link"
            :class="{ active: isActiveCategory(category) }"
          >
            {{ category.name }}
          </RouterLink>
        </div>
      </div>

      <div v-if="activeCategory" class="mega-menu">
        <div class="mega-menu-content">
          <div class="mega-menu-left">
            <RouterLink
              :to="`/products?category=${activeCategory.slug}`"
              class="mega-menu-title-link"
            >
              {{ activeCategory.name }}
            </RouterLink>
            <RouterLink :to="`/products?category=${activeCategory.slug}`" class="mega-menu-all">
              Vezi toate
            </RouterLink>
          </div>

          <div class="mega-menu-separator"></div>

          <div class="mega-menu-right">
            <RouterLink
              v-for="product in activeCategory.products.slice(0, 8)"
              :key="product.id"
              :to="`/products/${product.slug}`"
              class="mega-menu-product"
            >
              {{ product.name }}
            </RouterLink>

            <div v-if="!activeCategory.products.length" class="mega-menu-empty">
              Nu există produse momentan
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useCategoriesStore } from '@/stores/categories'
import { useProductsStore } from '@/stores/products'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const cart = useCartStore()
const categoriesStore = useCategoriesStore()
const productsStore = useProductsStore()

const { isAuthenticated } = storeToRefs(auth)

const activeCategory = ref(null)
const searchQuery = ref('')
const showSuggestions = ref(false)
const searchRef = ref(null)

watch(
  () => route.fullPath,
  () => {
    activeCategory.value = null
    showSuggestions.value = false
  },
)

onMounted(async () => {
  if (!categoriesStore.categories.length) {
    await categoriesStore.fetchCategories()
  }

  if (!productsStore.products.length) {
    await productsStore.fetchProducts()
  }

  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

const categoriesWithProducts = computed(() => {
  const order = [
    'buchete-flori',
    'aranjamente-florale',
    'plante-interior',
    'plante-exterior',
    'plante-propagare',
    'kituri-propagare',
    'accesorii',
  ]

  return categoriesStore.categories
    .map((category) => ({
      ...category,
      products: productsStore.products.filter((product) => product.category_id === category.id),
    }))
    .sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug))
})

const filteredSuggestions = computed(() => {
  if (!searchQuery.value) return []

  const query = searchQuery.value.toLowerCase()

  return productsStore.products
    .filter((product) => {
      const name = product.name?.toLowerCase() || ''
      const description = product.description?.toLowerCase() || ''
      return name.includes(query) || description.includes(query)
    })
    .slice(0, 6)
})

function handleSearchSubmit() {
  const query = searchQuery.value.trim()

  if (!query) {
    router.push('/products')
    closeSearch()
    return
  }

  router.push({
    path: '/products',
    query: { search: query },
  })

  closeSearch()
}

watch(searchQuery, (val) => {
  if (val) {
    showSuggestions.value = true
  }
})

function clearSearch() {
  searchQuery.value = ''
  showSuggestions.value = false
}

function closeSearch() {
  showSuggestions.value = false
}

function handleClickOutside(event) {
  if (searchRef.value && !searchRef.value.contains(event.target)) {
    showSuggestions.value = false
  }
}

function isActiveCategory(category) {
  return route.query.category === category.slug
}

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
  background: linear-gradient(135deg, #fffaf7 0%, #fdf3ee 40%, #fffaf7 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #f1e6e1;
}

.container {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
}

.navbar-top {
  min-height: 82px;
  display: grid;
  grid-template-columns: auto minmax(280px, 1fr) auto;
  align-items: center;
  gap: 28px;
}

.brand {
  display: flex;
  text-decoration: none;
  font-size: 35px;
  font-weight: 900;
  letter-spacing: 0.02em;
  line-height: 1;
}

.brand-pink {
  color: #c72c48;
}

.brand-green {
  color: #4c3a32;
}

.search-area {
  position: relative;
  width: 100%;
  max-width: 560px;
  justify-self: center;
}

.search-form {
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  background: #ffffff;
  border: 1px solid #e6ddd8;
  border-radius: 999px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(90, 81, 77, 0.04);
}

.search-form:focus-within {
  border-color: #d9b4bf;
  box-shadow: 0 4px 18px rgba(199, 44, 72, 0.08);
}

.search-input {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  padding: 0 14px;
  font-size: 14px;
  color: #5a514d;
}

.search-input::placeholder {
  color: #9b908a;
}

.search-btn {
  width: 44px;
  height: 100%;
  border: none;
  background: transparent;
  color: #7a6f6a;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease;
}

.search-btn:hover {
  color: #c72c48;
}

.search-suggestions {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: #ffffff;
  border: 1px solid #e7ddd8;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(80, 50, 60, 0.12);
  padding: 8px 0 0;
  z-index: 1200;
  overflow: hidden;
}

.search-suggestion-item {
  display: grid;
  grid-template-columns: 56px 1fr;
  align-items: center;
  gap: 5px;
  padding: 12px 16px;
  text-decoration: none;
  color: #5a514d;
  transition: 0.2s ease;
  border-bottom: 1px solid #f4ece7;
}

.search-suggestion-item:hover {
  background: #fff6f8;
}

.search-suggestion-image {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  overflow: hidden;
  background: #f8efef;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f1e6e1;
}

.search-suggestion-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-suggestion-image-placeholder {
  font-size: 24px;
}

.search-suggestion-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.search-suggestion-name {
  font-size: 15px;
  font-weight: 700;
  color: #3f3835;
  line-height: 1.35;
}

.search-suggestion-price {
  font-size: 14px;
  font-weight: 700;
  color: #348b41;
}

.search-see-all {
  width: 100%;
  border: none;
  border-top: 1px solid #f1e6e1;
  background: #fff;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 700;
  color: #348b41;
  cursor: pointer;
  transition: 0.2s ease;
}

.search-see-all:hover {
  background: #f7fcf8;
}

.search-no-results {
  padding: 16px;
  font-size: 14px;
  color: #7a716b;
}

.nav-links {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.nav-links a {
  text-decoration: none;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-width: 52px;
  color: #5a514d;
  font-weight: 600;
  transition: 0.2s ease;
}

.nav-item:hover {
  color: #c48797;
}

.nav-item.router-link-active {
  color: #c48797;
}

.nav-icon-wrap {
  position: relative;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-label {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  color: #5a514d;
  text-align: center;
}

.nav-item:hover .nav-label,
.nav-item.router-link-active .nav-label {
  color: #c48797;
}

.cart-icon {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -10px;
  background: #c72c48;
  color: white;
  font-size: 11px;
  font-weight: 700;
  border-radius: 999px;
  padding: 2px 6px;
  min-width: 18px;
  text-align: center;
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

.navbar-bottom {
  border-top: 1px solid #f3e7e3;
}

.category-row {
  min-height: 50px;
  display: flex;
  align-items: center;
  gap: 28px;
  position: relative;
}

.category-item {
  position: relative;
  display: flex;
  align-items: center;
  height: 50px;
}

.category-link {
  text-decoration: none;
  color: #3f3835;
  font-weight: 600;
  white-space: nowrap;
  transition: 0.2s ease;
  color: #5a4f49;
}

.category-link:hover {
  color: #c72c48;
}

.mega-menu {
  position: absolute;
  top: 100%;
  left: calc(50% - 50vw);
  width: 100vw;
  background: #fffaf7;
  border-top: 1px solid #f1e6e1;
  border-bottom: 1px solid #f1e6e1;
  padding: 28px 0;
  z-index: 1100;
}

.mega-menu-content {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: 240px 1px 1fr;
  column-gap: 44px;
  align-items: start;
}

.mega-menu-left {
  width: 240px;
  min-width: 240px;
  max-width: 240px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.mega-menu-separator {
  width: 1px;
  background: #f1e6e1;
  align-self: stretch;
}

.mega-menu-all {
  text-decoration: underline;
  text-underline-offset: 3px;
  color: #5a514d;
  font-weight: 700;
}

.mega-menu-all:hover {
  color: #c72c48;
}

.mega-menu-right {
  display: grid;
  grid-template-columns: repeat(2, minmax(230px, 260px));
  gap: 10px 150px;
  white-space: nowrap;
}

.mega-menu-product {
  text-decoration: none;
  color: #5a514d;
  line-height: 1.5;
  transition: 0.2s ease;
}

.mega-menu-product:hover {
  color: #c72c48;
}

.mega-menu-empty {
  color: #8a7f7b;
  font-style: italic;
}

.mega-menu-title-link {
  text-decoration: none;
  color: #c72c48;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
}

.mega-menu-title-link:hover {
  color: #a61f38;
}

.mega-menu-all {
  text-decoration: underline;
  text-underline-offset: 3px;
  color: #5a514d;
  font-weight: 700;
}

.mega-menu-all:hover {
  color: #c72c48;
}

.category-link.active {
  color: #c72c48;
  font-weight: 700;
  border-bottom: 2px solid #c72c48;
  padding-bottom: 2px;
}

@media (max-width: 980px) {
  .navbar-top {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 14px 0;
  }

  .brand {
    font-size: 30px;
  }

  .search-area {
    max-width: 100%;
  }

  .nav-links {
    width: 100%;
    justify-content: flex-start;
    gap: 14px;
  }
}

@media (max-width: 768px) {
  .category-row {
    overflow-x: auto;
    gap: 18px;
    scrollbar-width: none;
  }

  .category-row::-webkit-scrollbar {
    display: none;
  }

  .mega-menu {
    display: none;
  }

  .search-form {
    height: 40px;
  }

  .search-input {
    font-size: 14px;
  }
}
</style>
