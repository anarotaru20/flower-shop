<template>
  <v-container class="py-8">
    <div class="checkout-page">
      <div class="checkout-header">
        <h1 class="checkout-title">Checkout</h1>
        <p class="checkout-subtitle">Completeaza datele pentru plasarea comenzii</p>
      </div>

      <div v-if="!cartItems.length" class="empty-cart">
        <v-alert type="warning" variant="tonal"> Cosul tau este gol. </v-alert>

        <v-btn color="primary" class="mt-4" @click="goToProducts"> Mergi la produse </v-btn>
      </div>

      <v-row v-else class="mt-2" align="start">
        <v-col cols="12" md="7">
          <v-card class="checkout-card" elevation="0">
            <v-card-title class="section-title">Date livrare</v-card-title>

            <v-card-text>
              <v-form @submit.prevent="handleSubmit">
                <v-text-field
                  v-model="form.customer_name"
                  label="Nume complet"
                  variant="outlined"
                  density="comfortable"
                  class="mb-3"
                  :error-messages="errors.customer_name"
                />

                <v-text-field
                  v-model="form.phone"
                  label="Telefon"
                  variant="outlined"
                  density="comfortable"
                  class="mb-3"
                  :error-messages="errors.phone"
                />

                <v-textarea
                  v-model="form.shipping_address"
                  label="Adresa de livrare"
                  variant="outlined"
                  density="comfortable"
                  rows="4"
                  class="mb-3"
                  :error-messages="errors.shipping_address"
                />

                <div class="payment-label">Metoda de plata</div>

                <v-radio-group
                  v-model="form.payment_method"
                  :error-messages="errors.payment_method"
                  class="mb-4 payment-radio-group"
                  inline
                >
                  <v-radio label="Cash la livrare" value="cash" color="primary" />
                  <v-radio label="Card" value="card" color="primary" />
                </v-radio-group>

                <v-alert v-if="submitError" type="error" variant="tonal" class="mb-4">
                  {{ submitError }}
                </v-alert>

                <div class="actions">
                  <v-btn variant="outlined" @click="goBackToCart"> Inapoi la cos </v-btn>

                  <v-btn color="primary" type="submit" :loading="loading"> Plaseaza comanda </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="5">
          <v-card class="checkout-card summary-card" elevation="0">
            <v-card-title class="section-title">Sumar comanda</v-card-title>

            <v-card-text>
              <div v-for="item in cartItems" :key="item.id" class="summary-item">
                <div>
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-meta">{{ item.quantity }} x {{ formatPrice(item.price) }}</div>
                </div>

                <div class="item-total">
                  {{ formatPrice(item.price * item.quantity) }}
                </div>
              </div>

              <v-divider class="my-4" />

              <div class="summary-total">
                <span>Total</span>
                <strong>{{ formatPrice(cartTotal) }}</strong>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'
import { useProductsStore } from '@/stores/products'

const router = useRouter()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const productsStore = useProductsStore()

const loading = ref(false)
const submitError = ref('')

const form = reactive({
  customer_name: '',
  phone: '',
  shipping_address: '',
  payment_method: 'cash',
})

const errors = reactive({
  customer_name: '',
  phone: '',
  shipping_address: '',
  payment_method: '',
})

const cartItems = computed(() => cartStore.items)
const cartTotal = computed(() => cartStore.cartTotal)

function formatPrice(value) {
  return `${Number(value).toFixed(2)} lei`
}

function resetErrors() {
  errors.customer_name = ''
  errors.phone = ''
  errors.shipping_address = ''
  errors.payment_method = ''
}

function validateForm() {
  resetErrors()
  let isValid = true

  if (!form.customer_name.trim()) {
    errors.customer_name = 'Numele este obligatoriu'
    isValid = false
  }

  if (!form.phone.trim()) {
    errors.phone = 'Telefonul este obligatoriu'
    isValid = false
  }

  if (!form.shipping_address.trim()) {
    errors.shipping_address = 'Adresa este obligatorie'
    isValid = false
  }

  if (!form.payment_method) {
    errors.payment_method = 'Selecteaza metoda de plata'
    isValid = false
  }

  return isValid
}

function goBackToCart() {
  router.push('/cart')
}

function goToProducts() {
  router.push('/products')
}

async function handleSubmit() {
  if (!validateForm()) return

  loading.value = true
  submitError.value = ''

  try {
    const payload = {
      customer_name: form.customer_name.trim(),
      phone: form.phone.trim(),
      shipping_address: form.shipping_address.trim(),
      payment_method: form.payment_method,
      items: cartItems.value.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    }
    await ordersStore.addOrder(payload)

    cartStore.clearCart()

    // refresh produse
    await productsStore.fetchProducts()

    router.push('/orders')
  } catch (error) {
    submitError.value =
      ordersStore.error ||
      error.response?.data?.message ||
      error.message ||
      'A aparut o eroare la plasarea comenzii.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.checkout-page {
  max-width: 1200px;
  background: #fffaf7;
  margin: 0 auto;
}

.checkout-header {
  margin-bottom: 24px;
}

.checkout-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 6px;
}

.checkout-subtitle {
  color: #6b7280;
  margin: 0;
}

.checkout-card {
  border: 1px solid #e5e7eb;
  border-radius: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  padding-bottom: 0;
}

.payment-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.summary-card {
  position: sticky;
  top: 24px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
}

.item-name {
  font-weight: 600;
  color: #111827;
}

.item-meta {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

.item-total {
  font-weight: 600;
  white-space: nowrap;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
}

.empty-cart {
  max-width: 500px;
}
.payment-radio-group {
  padding: 8px 0 4px;
}

:deep(.payment-radio-group .v-selection-control) {
  min-height: 44px;
}

:deep(.payment-radio-group .v-label) {
  opacity: 1;
  color: #111827;
  font-size: 15px;
}
</style>
