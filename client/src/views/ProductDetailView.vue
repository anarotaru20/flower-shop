<template>
  <section class="product-detail-page">
    <div class="container">
      <div v-if="productsStore.loading" class="state">Se incarca produsul...</div>

      <div v-else-if="productsStore.error" class="state error">
        {{ productsStore.error }}
      </div>

      <div v-else-if="!productsStore.product" class="state">Produsul nu a fost gasit.</div>

      <div v-else class="product-detail">
        <div class="product-image">🌸</div>

        <div class="product-info">
          <p class="category">
            {{ productsStore.product.category_name || 'Categorie' }}
          </p>

          <h1>{{ productsStore.product.name }}</h1>

          <p class="price">{{ productsStore.product.price }} RON</p>

          <p class="description">
            {{ productsStore.product.description || 'Fara descriere disponibila.' }}
          </p>

          <p class="stock">
            Stoc:
            <span
              :class="{
                inStock: productsStore.product.stock > 0,
                outOfStock: productsStore.product.stock <= 0,
              }"
            >
              {{
                productsStore.product.stock > 0
                  ? `${productsStore.product.stock} disponibile`
                  : 'Indisponibil'
              }}
            </span>
          </p>

          <div class="actions">
            <button
              class="add-btn"
              :disabled="productsStore.product.stock <= 0"
              @click="cartStore.addToCart(productsStore.product)"
            >
              Adauga in cos
            </button>

            <RouterLink to="/products" class="back-link"> Inapoi la shop </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()

onMounted(() => {
  productsStore.fetchProductBySlug(route.params.slug)
})
</script>

<style scoped>
.product-detail-page {
  padding: 40px 0;
  background: #fffaf7;
  min-height: calc(100vh - 80px);
}

.container {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
}

.state {
  padding: 40px;
  text-align: center;
  color: #7a716b;
}

.state.error {
  color: #d9534f;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

.product-image {
  height: 420px;
  border-radius: 24px;
  background: #fdf1f4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 72px;
  border: 1px solid #f1e6e1;
}

.product-info {
  background: #ffffff;
  border: 1px solid #f1e6e1;
  border-radius: 24px;
  padding: 32px;
}

.category {
  margin: 0 0 10px;
  color: #c48797;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
}

.product-info h1 {
  margin: 0 0 14px;
  color: #5a514d;
  font-size: 34px;
}

.price {
  margin: 0 0 18px;
  font-size: 24px;
  font-weight: 700;
  color: #8f5f6b;
}

.description {
  margin: 0 0 20px;
  line-height: 1.8;
  color: #7a716b;
}

.stock {
  margin: 0 0 24px;
  color: #5a514d;
  font-weight: 600;
}

.inStock {
  color: #4caf50;
}

.outOfStock {
  color: #d9534f;
}

.actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.add-btn {
  height: 48px;
  padding: 0 22px;
  border: none;
  border-radius: 999px;
  background: #dba4b2;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.add-btn:disabled {
  background: #d8cdd1;
  cursor: not-allowed;
}

.back-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 22px;
  border-radius: 999px;
  text-decoration: none;
  background: #edf4ea;
  color: #6b7f68;
  border: 1px solid #d8e7d2;
  font-weight: 700;
}

@media (max-width: 900px) {
  .product-detail {
    grid-template-columns: 1fr;
  }

  .product-image {
    height: 300px;
  }
}
</style>
