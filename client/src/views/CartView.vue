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
          <article v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <div class="item-image">🌸</div>

            <div class="item-info">
              <RouterLink :to="`/products/${item.slug}`" class="item-name">
                {{ item.name }}
              </RouterLink>

              <p class="item-price">{{ item.price }} RON / buc</p>

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

              <p class="item-total">{{ (Number(item.price) * item.quantity).toFixed(2) }} RON</p>

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

          <div class="summary-row total">
            <span>Total</span>
            <span>{{ cartStore.cartTotal.toFixed(2) }} RON</span>
          </div>

          <v-btn color="primary" @click="goToCheckout"> Continua spre checkout </v-btn>

          <button class="clear-btn" @click="cartStore.clearCart()">Goleste cosul</button>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cartStore = useCartStore()

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

.item-price,
.item-stock {
  margin: 8px 0 0;
  color: #7a716b;
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
