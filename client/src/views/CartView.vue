<template>
  <section class="cart-page">
    <div class="container">
      <div class="page-header">
        <h1>Produse în coș</h1>
      </div>

      <v-snackbar v-model="toast.show" :timeout="3500" location="top right" color="error">
        {{ toast.message }}
      </v-snackbar>

      <div v-if="!cartStore.items.length" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h2>Coșul este gol</h2>
        <p>Adaugă produse din shop și revino aici pentru checkout.</p>
        <RouterLink to="/products" class="shop-link">Mergi la magazin</RouterLink>
      </div>

      <div v-else class="cart-layout">
        <div class="cart-items">
          <div v-if="hasBirthdayPromo" class="promo-banner">
            🎂 Birthday Week: ai 10% reducere la toate produsele
          </div>

          <article v-for="item in promoCartItems" :key="item.id" class="cart-item">
            <div class="item-image">
              <img
                v-if="item.image_url"
                :src="getOptimizedImage(item.image_url)"
                :alt="item.name"
                loading="lazy"
                decoding="async"
              />
              <div v-else class="fallback-emoji">🌸</div>
            </div>

            <div class="item-info">
              <RouterLink :to="`/products/${item.slug}`" class="item-name">
                {{ item.name }}
              </RouterLink>

              <div v-if="item.hasPromo" class="promo-badge">
                {{ item.promoLabel }}
              </div>

              <p class="item-price">
                <span v-if="item.hasPromo" class="old-price">
                  {{ Number(item.price).toFixed(2) }} lei
                </span>
                {{ Number(item.finalPrice).toFixed(2) }} lei / buc
              </p>
            </div>

            <div class="item-actions">
              <div class="quantity-box">
                <button class="qty-btn" @click="cartStore.decreaseQuantity(item.id)">-</button>

                <span class="qty-value">{{ item.quantity }}</span>

                <button
                  class="qty-btn"
                  @click="cartStore.increaseQuantity(item.id)"
                  :disabled="item.quantity >= item.stock"
                >
                  +
                </button>
              </div>

              <p class="item-total">
                <span v-if="item.hasPromo" class="old-total">
                  {{ (Number(item.price) * item.quantity).toFixed(2) }} lei
                </span>
                {{ (Number(item.finalPrice) * item.quantity).toFixed(2) }} lei
              </p>

              <button class="remove-btn" @click="cartStore.removeFromCart(item.id)">Șterge</button>
            </div>
          </article>
        </div>

        <aside class="cart-summary">
          <h2>Comandă</h2>

          <div class="summary-row">
            <span>Produse</span>
            <span>{{ cartStore.cartCount }}</span>
          </div>

          <div v-if="hasBirthdayPromo" class="summary-row">
            <span>Subtotal initial</span>
            <span>{{ originalCartTotal.toFixed(2) }} lei</span>
          </div>

          <div v-if="hasBirthdayPromo" class="summary-row discount-row">
            <span>Reducere aniversara</span>
            <span>- {{ discountAmount.toFixed(2) }} lei</span>
          </div>

          <div class="summary-row total">
            <span>Total</span>
            <span>{{ finalCartTotal.toFixed(2) }} lei</span>
          </div>

          <div class="summary-row">
            <span>Transport</span>
            <span>Calculat la finalizarea comenzii</span>
          </div>

          <RouterLink to="/products" class="back-home">← Continuă cumparaturile</RouterLink>

          <p v-if="!isAuthenticated" class="auth-warning">
            ⚠️ Trebuie să fii autentificat pentru a comanda.
          </p>

          <v-btn class="checkout-order-btn" color="primary" @click="goToCheckout">
            {{ isAuthenticated ? 'Continua spre plată' : 'Intră în cont / Înregistrare' }}
          </v-btn>

          <button class="clear-btn" @click="cartStore.clearCart()">Golește coșul</button>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { isBirthdayWeek, getProductPromoData } from '@/utils/promotions'
import { useProductsStore } from '@/stores/products'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const productsStore = useProductsStore()

const toast = ref({
  show: false,
  message: '',
})

const isAuthenticated = computed(() => authStore.isAuthenticated)
const userBirthDate = computed(() => authStore.user?.birth_date || null)
const hasBirthdayPromo = computed(() => isBirthdayWeek(userBirthDate.value))

function getOptimizedImage(url) {
  if (!url) return ''

  if (url.includes('unsplash.com')) {
    return `${url}${url.includes('?') ? '&' : '?'}auto=format&fit=crop&w=320&q=70`
  }

  return url
}

const promoCartItems = computed(() => {
  return (cartStore.items || []).map((item) => getProductPromoData(item, userBirthDate.value))
})

const originalCartTotal = computed(() => {
  return promoCartItems.value.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.quantity || 0)
  }, 0)
})

const finalCartTotal = computed(() => {
  return promoCartItems.value.reduce((sum, item) => {
    return sum + Number(item.finalPrice || 0) * Number(item.quantity || 0)
  }, 0)
})

const discountAmount = computed(() => {
  return Number((originalCartTotal.value - finalCartTotal.value).toFixed(2))
})

async function validateCartStock() {
  if (!productsStore.products?.length) {
    await productsStore.fetchProducts()
  }

  const invalidItem = cartStore.items.find((cartItem) => {
    const product = productsStore.products.find((p) => p.id === cartItem.id)

    if (!product) {
      return false
    }

    return Number(cartItem.quantity) > Number(product.stock)
  })

  return invalidItem
}

async function goToCheckout() {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  const invalidItem = await validateCartStock()

  if (invalidItem) {
    const product = productsStore.products.find((p) => p.id === invalidItem.id)

    toast.value.message = `Stoc insuficient pentru produsul: ${invalidItem.name}. Disponibil: ${product?.stock ?? 0} buc.`
    toast.value.show = true
    return
  }

  router.push('/checkout')
}
</script>

<style scoped>
.cart-page {
  padding: 40px 0;
  background: #ffffff;
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

.empty-cart {
  background: #ffffff;
  border: 2px solid #f1e6e1;
  border-radius: 24px;
  padding: 48px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-cart h2 {
  margin: 0 0 10px;
  color: #5a514d;
}

.empty-cart p {
  margin: 0 0 20px;
  color: #7a716b;
}

.shop-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 22px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  background: #b9364e;
  color: white;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1.7fr 0.9fr;
  gap: 24px;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.promo-banner {
  padding: 14px 16px;
  border-radius: 16px;
  background: #ffe3eb;
  color: #b85c77;
  font-weight: 700;
  border: 1px solid #ffd0dd;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 20px;
  background: #ffffff;
  border: 1px solid #f1e6e1;
  border-radius: 24px;
  padding: 20px;
  align-items: center;
  content-visibility: auto;
  contain-intrinsic-size: 160px;
}
.item-image {
  height: 120px;
  border-radius: 18px;
  background: #fdf1f4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  border-radius: 18px;
  object-fit: cover;
  will-change: transform;
  transform: translateZ(0);
}

.fallback-emoji {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
}

.fallback-emoji {
  background: #fdf1f4;
  border-radius: 18px;
}

.item-name {
  text-decoration: none;
  color: #5a514d;
  font-size: 20px;
  font-weight: 700;
}

.promo-badge {
  display: inline-block;
  margin-top: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #ffe3eb;
  color: #b85c77;
  font-size: 12px;
  font-weight: 700;
}

.item-price,
.item-stock {
  margin: 8px 0 0;
  color: #7a716b;
}

.old-price {
  text-decoration: line-through;
  color: #9ca3af;
  margin-right: 8px;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.quantity-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff7f3;
  border: 1px solid #f2e3dc;
  border-radius: 999px;
  padding: 6px 10px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 999px;
  background: #b9364e;
  color: white;
  font-size: 18px;
  cursor: pointer;
}

.qty-btn:disabled {
  background: #d8cdd1;
  cursor: not-allowed;
}

.qty-value {
  min-width: 24px;
  text-align: center;
  font-weight: 700;
  color: #5a514d;
}

.item-total {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #8f5f6b;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.old-total {
  text-decoration: line-through;
  color: #9ca3af;
  font-size: 14px;
  font-weight: 400;
}

.remove-btn {
  border: none;
  background: transparent;
  color: #fd0000;
  font-weight: 600;
  text-decoration-line: underline;
  text-decoration-style: dotted;
  cursor: pointer;
  font-size: 13px;
}

.cart-summary {
  background: rgba(255, 255, 255, 0.696);
  border: 3px solid #f1e6e1;
  border-radius: 24px;
  padding: 24px;
  position: sticky;
  top: 92px;
}

.cart-summary h2 {
  margin: 0 0 18px;
  color: #5a514d;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  color: #7a716b;
}

.discount-row {
  color: #8f5f6b;
}

.summary-row.total {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #f1e6e1;
  font-size: 18px;
  font-weight: 700;
  color: #5a514d;
}

.checkout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  border-radius: 999px;
  text-decoration: none;
  background: #dba4b2;
  color: white;
  font-weight: 700;
  margin-top: 20px;
}

.checkout-order-btn {
  width: 100%;
  min-height: 46px;
  margin-top: 12px;
  border-radius: 10px;
  font-weight: 600;
  background: #b9364e;
  color: white;
  cursor: pointer;
}

.clear-btn {
  width: 100%;
  min-height: 46px;
  margin-top: 12px;
  border-radius: 10px;
  font-weight: 600;
  color: #b9364e;
  border: 1px solid #f3c4cd;
  background: #fff1f4;
  cursor: pointer;
}

.back-home {
  border-top: 1px solid #f1e6e1;
  padding-top: 15px;
  padding-bottom: 10px;
  margin-top: 25px;
  font-size: 14px;
  color: #a08c83;
  text-decoration: none;
  transition: all 0.2s ease;
  display: flex;
}

.auth-warning {
  margin: 12px 0 0;
  font-size: 14px;
  font-weight: 600;
  color: #b9364e;
  background: #fff1f4;
  border: 1px solid #f3c4cd;
  border-radius: 10px;
  padding: 10px 12px;
}

@media (max-width: 900px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 1fr;
  }

  .item-actions {
    align-items: flex-start;
  }

  .cart-summary {
    position: static;
  }
}
</style>
