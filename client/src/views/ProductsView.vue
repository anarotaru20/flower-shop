<template>
  <section class="products-page">
    <div class="container">
      <div class="page-header">
        <h1>Shop</h1>
        <p>Descoperă colecția noastră de flori și aranjamente</p>
      </div>

      <div v-if="productsStore.loading" class="state">
        Se incarca produsele...
      </div>

      <div v-else-if="productsStore.error" class="state error">
        {{ productsStore.error }}
      </div>

      <div v-else-if="!productsStore.products.length" class="state">
        Nu exista produse momentan.
      </div>

      <div v-else class="products-grid">
        <div
          v-for="product in displayedProducts"
          :key="product.id"
          class="product-card"
        >
          <RouterLink :to="`/products/${product.slug}`" class="card-link">
            <div class="image-placeholder">
              🌸
            </div>

            <div class="card-body">
              <h3>{{ product.name }}</h3>

              <div v-if="product.hasPromo" class="promo-badge">
                {{ product.promoLabel }}
              </div>

              <div class="price-block">
                <p v-if="product.hasPromo" class="old-price">
                  {{ product.oldPrice }} RON
                </p>
                <p class="price">
                  {{ product.finalPrice }} RON
                </p>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'
import { getProductPromoData } from '@/utils/promotions'

const productsStore = useProductsStore()
const authStore = useAuthStore()

const userBirthDate = computed(() => authStore.user?.birth_date || null)

const displayedProducts = computed(() => {
  return (productsStore.products || []).map((product) =>
    getProductPromoData(product, userBirthDate.value)
  )
})

onMounted(() => {
  productsStore.fetchProducts()
})
</script>

<style scoped>
.products-page {
  padding: 40px 0;
  background: #fffaf7;
  min-height: calc(100vh - 80px);
}

.container {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 0;
  color: #5a514d;
}

.page-header p {
  margin: 8px 0 0;
  color: #7a716b;
}

.state {
  padding: 40px;
  text-align: center;
  color: #7a716b;
}

.state.error {
  color: #d9534f;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.product-card {
  background: #ffffff;
  border: 1px solid #f1e6e1;
  border-radius: 20px;
  overflow: hidden;
  transition: 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(160, 120, 120, 0.1);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.image-placeholder {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  background: #fdf1f4;
}

.card-body {
  padding: 16px;
}

.card-body h3 {
  margin: 0 0 6px;
  font-size: 16px;
  color: #5a514d;
}

.promo-badge {
  display: inline-block;
  margin-bottom: 8px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #ffe3eb;
  color: #b85c77;
  font-size: 12px;
  font-weight: 700;
}

.price-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.old-price {
  margin: 0;
  color: #a79a95;
  text-decoration: line-through;
  font-size: 14px;
}

.price {
  margin: 0;
  color: #c48797;
  font-weight: 700;
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>