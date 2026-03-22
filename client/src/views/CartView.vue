<template>
  <section class="cart-page">
    <div class="container">
      <div class="page-header">
        <h1>Cosul meu</h1>
        <p>Produsele alese cu drag pentru urmatoarea ta comanda</p>
      </div>

      <div v-if="!cartStore.items.length" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h2>Cosul este gol</h2>
        <p>Adauga produse din shop si revino aici pentru checkout.</p>
        <RouterLink to="/products" class="shop-link">Mergi la shop</RouterLink>
      </div>

      <div v-else class="cart-layout">
        <div class="cart-items">
          <div v-if="hasBirthdayPromo" class="promo-banner">
            🎂 Birthday Week: ai 10% reducere la toate produsele
          </div>

          <article v-for="item in promoCartItems" :key="item.id" class="cart-item">
            <div class="item-image">🌸</div>

            <div class="item-info">
              <RouterLink :to="`/products/${item.slug}`" class="item-name">
                {{ item.name }}
              </RouterLink>

              <div v-if="item.hasPromo" class="promo-badge">
                {{ item.promoLabel }}
              </div>

              <p class="item-price">
                <span v-if="item.hasPromo" class="old-price">
                  {{ Number(item.price).toFixed(2) }} RON
                </span>
                {{ Number(item.finalPrice).toFixed(2) }} RON / buc
              </p>

              <p class="item-stock">Stoc disponibil: {{ item.stock }}</p>
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
                  {{ (Number(item.price) * item.quantity).toFixed(2) }} RON
                </span>
                {{ (Number(item.finalPrice) * item.quantity).toFixed(2) }} RON
              </p>

              <button class="remove-btn" @click="cartStore.removeFromCart(item.id)">Elimina</button>
            </div>
          </article>
        </div>

        <aside class="cart-summary">
          <h2>Sumar comanda</h2>

          <div class="summary-row">
            <span>Produse</span>
            <span>{{ cartStore.cartCount }}</span>
          </div>

          <div v-if="hasBirthdayPromo" class="summary-row">
            <span>Subtotal initial</span>
            <span>{{ originalCartTotal.toFixed(2) }} RON</span>
          </div>

          <div v-if="hasBirthdayPromo" class="summary-row discount-row">
            <span>Reducere aniversara</span>
            <span>- {{ discountAmount.toFixed(2) }} RON</span>
          </div>

          <div class="summary-row total">
            <span>Total</span>
            <span>{{ finalCartTotal.toFixed(2) }} RON</span>
          </div>

          <v-btn color="primary" @click="goToCheckout"> Continua spre checkout </v-btn>

          <button class="clear-btn" @click="cartStore.clearCart()">Goleste cosul</button>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { isBirthdayWeek, getProductPromoData } from '@/utils/promotions'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const userBirthDate = computed(() => authStore.user?.birth_date || null)
const hasBirthdayPromo = computed(() => isBirthdayWeek(userBirthDate.value))

const promoCartItems = computed(() => {
  return (cartStore.items || []).map((item) =>
    getProductPromoData(item, userBirthDate.value)
  )
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

function goToCheckout() {
  router.push('/checkout')
}
</script>

<style scoped>
.cart-page {
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

.empty-cart {
  background: #ffffff;
  border: 1px solid #f1e6e1;
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
  border-radius: 999px;
  text-decoration: none;
  background: #dba4b2;
  color: white;
  font-weight: 700;
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
}

.item-image {
  height: 120px;
  border-radius: 18px;
  background: #fdf1f4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
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
  background: #dba4b2;
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
  color: #c75c5c;
  font-weight: 700;
  cursor: pointer;
}

.cart-summary {
  background: #ffffff;
  border: 1px solid #f1e6e1;
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

.clear-btn {
  width: 100%;
  min-height: 46px;
  margin-top: 12px;
  border: 1px solid #eadcd6;
  border-radius: 999px;
  background: #fff7f3;
  color: #8f5f6b;
  font-weight: 700;
  cursor: pointer;
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