<template>
  <v-container class="py-8">
    <div class="checkout-page">
      <div v-if="!cartItems.length && !orderPlaced && !finishingOrder" class="empty-cart-one">
        <div class="empty-icon">🛒</div>
        <h2>Coșul este gol</h2>
        <p>Adaugă produse din shop și revino aici pentru checkout.</p>
        <RouterLink to="/products" class="shop-link">Mergi la magazin</RouterLink>
      </div>

      <div v-else-if="orderPlaced" class="success-wrapper">
        <v-card class="checkout-card success-card" elevation="0">
          <v-card-title class="section-title">Comanda a fost plasata cu succes</v-card-title>

          <v-card-text>
            <p class="success-text">
              Comanda ta a fost inregistrata. Mai jos poti vedea codul QR generat pentru mesajul
              plantei.
            </p>

            <div v-if="qrImage" class="qr-preview">
              <img :src="qrImage" alt="QR Code" class="qr-image" />

              <div class="qr-actions">
                <v-btn class="view-qr" @click="goToQrPage">Vezi pagina QR</v-btn>
              </div>
            </div>

            <v-alert v-else type="info" variant="tonal" color="warning" class="mt-4">
              Comanda a fost plasata, dar nu exista un QR disponibil pentru aceasta comanda.
            </v-alert>

            <div class="actions mt-6">
              <v-btn variant="outlined" class="back-btn" @click="goToProducts"
                >Continua cumparaturile</v-btn
              >
            </div>
          </v-card-text>
        </v-card>
      </div>

      <v-row v-else class="mt-2" align="start">
        <v-col cols="12" md="7">
          <v-card class="checkout-card" elevation="0">
            <v-card-title class="section-title">Date livrare</v-card-title>

            <v-card-text>
              <v-form class="delivery-form" @submit.prevent="handleSubmit">
                <div class="payment-label">Nume complet</div>
                <v-text-field
                  v-model="form.customer_name"
                  variant="outlined"
                  density="comfortable"
                  class="mb-3"
                  :error-messages="errors.customer_name"
                />

                <div class="payment-label">Telefon</div>
                <v-text-field
                  v-model="form.phone"
                  variant="outlined"
                  density="comfortable"
                  class="mb-3"
                  :error-messages="errors.phone"
                />

                <div class="payment-label">Adresă</div>
                <v-textarea
                  v-model="form.shipping_address"
                  variant="outlined"
                  density="comfortable"
                  rows="4"
                  class="mb-3"
                  :error-messages="errors.shipping_address"
                />

                <div v-if="hasEligibleQrProducts">
                  <div class="payment-label">Mesaj pentru plante / buchet</div>

                  <v-textarea
                    v-model="form.gift_message"
                    variant="outlined"
                    density="comfortable"
                    rows="4"
                    class="mb-3"
                    placeholder="Scrie un mesaj care va fi afisat dupa scanarea codului QR"
                    counter="300"
                  />
                </div>

                <div class="payment-label">Metoda de plata</div>

                <v-radio-group
                  v-model="form.payment_method"
                  :error-messages="errors.payment_method"
                  class="payment-radio-group"
                  color="#b9364e"
                  inline
                >
                  <v-radio label="Cash la livrare" value="cash" />
                  <v-radio label="Card" value="card" />
                </v-radio-group>

                <v-dialog v-model="stripeDialog" max-width="640">
                  <v-card class="stripe-dialog-card" elevation="0">
                    <v-card-title class="section-title d-flex align-center justify-space-between">
                      <span>Plată cu cardul</span>

                      <v-btn icon variant="text" @click="stripeDialog = false">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-card-title>

                    <v-card-text class="pt-6">
                      <StripePaymentForm
                        v-if="createdOrderId"
                        :order-id="createdOrderId"
                        @paid="handleStripePaid"
                      />
                    </v-card-text>
                  </v-card>
                </v-dialog>

                <v-alert v-if="submitError" type="error" variant="tonal" class="mb-4">
                  {{ submitError }}
                </v-alert>

                <div class="actions">
                  <v-btn class="back-btn" @click="goBackToCart">Inapoi la cos</v-btn>

                  <v-btn
                    v-if="!showStripePayment"
                    class="checkout-btn"
                    type="submit"
                    :loading="loading"
                  >
                    {{ form.payment_method === 'card' ? 'Continua la plata' : 'Plaseaza comanda' }}
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="5">
          <v-card class="checkout-card summary-card" elevation="0">
            <v-card-title class="section-title">Comandă</v-card-title>

            <v-card-text>
              <div v-for="item in promoCartItems" :key="item.id" class="summary-item">
                <div>
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-meta">
                    {{ item.quantity }} x
                    <span v-if="item.hasPromo" class="old-inline-price">
                      {{ formatPrice(item.price) }}
                    </span>
                    {{ formatPrice(item.finalPrice) }}
                  </div>
                </div>

                <div class="item-total">
                  <span v-if="item.hasPromo" class="old-inline-price">
                    {{ formatPrice(item.price * item.quantity) }}
                  </span>
                  {{ formatPrice(item.finalPrice * item.quantity) }}
                </div>
              </div>

              <div v-if="hasBirthdayPromo" class="summary-row discount-row">
                <span>Subtotal initial</span>
                <span>{{ formatPrice(originalCartTotal) }}</span>
              </div>

              <div v-if="hasBirthdayPromo" class="summary-row discount-row">
                <span>Reducere aniversara</span>
                <span>- {{ formatPrice(discountAmount) }}</span>
              </div>

              <div class="summary-row">
                <span>Subtotal</span>
                <span>{{ formatPrice(finalCartTotal) }}</span>
              </div>

              <div class="summary-row">
                <span>Taxe</span>
                <span>{{ formatPrice(taxAmount) }}</span>
              </div>

              <v-divider class="my-4" />

              <div class="summary-total">
                <span>Total de plată</span>
                <strong>{{ formatPrice(totalWithTax) }}</strong>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'
import { useProductsStore } from '@/stores/products'
import { useQrStore } from '@/stores/qr'
import { useAuthStore } from '@/stores/auth'
import StripePaymentForm from '@/components/checkout/StripePaymentForm.vue'
import { isBirthdayWeek, getProductPromoData } from '@/utils/promotions'

const router = useRouter()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const productsStore = useProductsStore()
const qrStore = useQrStore()
const authStore = useAuthStore()

const { qr } = storeToRefs(qrStore)

const createdOrderId = ref('')
const stripeDialog = ref(false)
const showStripePayment = ref(false)
const loading = ref(false)
const submitError = ref('')
const orderPlaced = ref(false)
const finishingOrder = ref(false)

const form = reactive({
  customer_name: '',
  phone: '',
  shipping_address: '',
  gift_message: '',
  payment_method: 'cash',
})

function fillFormFromUser() {
  const user = authStore.user || {}

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim()

  form.customer_name = fullName || ''
  form.shipping_address = user.address || ''
}

onMounted(async () => {
  if (!authStore.user) {
    try {
      await authStore.fetchProfile()
    } catch (error) {
      console.error(error)
    }
  }

  fillFormFromUser()
})

watch(
  () => authStore.user,
  () => {
    fillFormFromUser()
  },
  { immediate: true },
)

const errors = reactive({
  customer_name: '',
  phone: '',
  shipping_address: '',
  payment_method: '',
})

const cartItems = computed(() => cartStore.items)
const userBirthDate = computed(() => authStore.user?.birth_date || null)
const hasBirthdayPromo = computed(() => isBirthdayWeek(userBirthDate.value))

const promoCartItems = computed(() => {
  return cartItems.value.map((item) => getProductPromoData(item, userBirthDate.value))
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

const hasEligibleQrProducts = computed(() =>
  cartItems.value.some(
    (item) =>
      item.category_slug === 'plante-interior' ||
      item.category_slug === 'plante-exterior' ||
      item.category_slug === 'plante-propagare' ||
      item.category_slug === 'buchete-flori' ||
      item.category_slug === 'aranjamente-florale',
  ),
)

const qrImage = computed(() => qr.value?.qr_image || '')
const qrPath = computed(() => {
  if (!qr.value?.token) return ''
  return `/qr/${qr.value.token}`
})

function goToQrPage() {
  if (!qrPath.value) return
  router.push(qrPath.value)
}

function formatPrice(value) {
  return `${Number(value).toFixed(2)} lei`
}

function resetErrors() {
  errors.customer_name = ''
  errors.phone = ''
  errors.shipping_address = ''
  errors.payment_method = ''
}

const taxRate = 0.19

const taxAmount = computed(() => {
  return Number((finalCartTotal.value * taxRate).toFixed(2))
})

const totalWithTax = computed(() => {
  return Number((finalCartTotal.value + taxAmount.value).toFixed(2))
})

function validateForm() {
  resetErrors()
  let isValid = true

  if (!form.customer_name.trim()) {
    errors.customer_name = 'Câmp obligatoriu'
    isValid = false
  }

  if (!form.phone.trim()) {
    errors.phone = 'Câmp obligatoriu'
    isValid = false
  }

  if (!form.shipping_address.trim()) {
    errors.shipping_address = 'Câmp obligatoriu'
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

function goToOrders() {
  router.push('/orders')
}

async function generateQrForOrder(orderId) {
  try {
    if (!hasEligibleQrProducts.value) return

    await qrStore.createQr({
      order_id: orderId,
      message: form.gift_message.trim() || '',
    })
  } catch (qrError) {
    console.error('QR generation failed:', qrError)
  }
}

watch(hasEligibleQrProducts, (value) => {
  if (!value) {
    form.gift_message = ''
  }
})

// async function handleSubmit() {
//   if (!validateForm()) return

//   loading.value = true
//   submitError.value = ''
//   qrStore.clearQr()

//   try {
//     const payload = {
//       customer_name: form.customer_name.trim(),
//       phone: form.phone.trim(),
//       shipping_address: form.shipping_address.trim(),
//       gift_message: form.gift_message.trim(),
//       payment_method: form.payment_method,
//       promo_type: hasBirthdayPromo.value ? 'birthday_week' : null,
//       promo_discount_percent: hasBirthdayPromo.value ? 10 : 0,
//       original_total: originalCartTotal.value,
//       final_total: finalCartTotal.value,
//       items: promoCartItems.value.map((item) => ({
//         product_id: item.id,
//         quantity: item.quantity,
//         unit_price: item.hasPromo ? item.finalPrice : item.price,
//         original_unit_price: item.price,
//         discount_percent: item.discountPercent || 0,
//       })),
//     }

//     const order = await ordersStore.addOrder(payload)

//     await generateQrForOrder(order.id)

//     if (form.payment_method === 'card') {
//       createdOrderId.value = order.id
//       stripeDialog.value = true
//       return
//     }

//     cartStore.clearCart()
//     await productsStore.fetchProducts()
//     orderPlaced.value = true
//   } catch (error) {
//     submitError.value =
//       ordersStore.error ||
//       error.response?.data?.message ||
//       error.message ||
//       'A aparut o eroare la plasarea comenzii.'
//   } finally {
//     loading.value = false
//   }
// }

async function handleSubmit() {
  if (!validateForm()) return

  loading.value = true
  submitError.value = ''
  qrStore.clearQr()

  try {
    const payload = {
      customer_name: form.customer_name.trim(),
      phone: form.phone.trim(),
      shipping_address: form.shipping_address.trim(),
      gift_message: form.gift_message.trim(),
      payment_method: form.payment_method,
      promo_type: hasBirthdayPromo.value ? 'birthday_week' : null,
      promo_discount_percent: hasBirthdayPromo.value ? 10 : 0,
      original_total: originalCartTotal.value,
      final_total: finalCartTotal.value,
      items: promoCartItems.value.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.hasPromo ? item.finalPrice : item.price,
        original_unit_price: item.price,
        discount_percent: item.discountPercent || 0,
      })),
    }

    const order = await ordersStore.addOrder(payload)

    await generateQrForOrder(order.id)

    if (form.payment_method === 'card') {
      createdOrderId.value = order.id
      stripeDialog.value = true
      return
    }

    cartStore.clearCart()
    await productsStore.fetchProducts()

    if (qr.value?.token && form.gift_message.trim()) {
      router.replace(`/qr/${qr.value.token}`)
    } else {
      router.replace('/orders')
    }
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

// async function handleStripePaid() {
//   finishingOrder.value = true
//   orderPlaced.value = true
//   stripeDialog.value = false
//   cartStore.clearCart()

//   try {
//     await productsStore.fetchProducts()
//   } finally {
//     finishingOrder.value = false
//   }
// }

async function handleStripePaid() {
  stripeDialog.value = false
  cartStore.clearCart()
  await productsStore.fetchProducts()

  if (qr.value?.token && form.gift_message.trim()) {
    router.replace(`/qr/${qr.value.token}`)
  } else {
    router.replace('/orders')
  }
}
</script>

<style scoped>
.checkout-page {
  max-width: 1200px;
  background: #fff;
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
  background: rgba(255, 255, 255, 0.696);
  border: 3px solid #f1e6e1;
  border-radius: 24px;
  padding: 24px;
  position: sticky;
  top: 92px;
}

.section-title {
  font-size: 25px;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 2px solid #f1e6e1;
}

.payment-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 20px;
}

.summary-card {
  background: rgba(255, 255, 255, 0.696);
  border: 3px solid #f1e6e1;
  border-radius: 24px;
  padding: 24px;
  position: sticky;
  top: 92px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  font-size: 15px;
  border-bottom: 1px solid #f1e6e1;
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
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 10px;
  padding-top: 15px;
}

.discount-row {
  color: #8f5f6b;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  color: #5a514d;
}

.empty-cart {
  max-width: 500px;
}

:deep(.payment-radio-group .v-selection-control-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

:deep(.payment-radio-group .v-selection-control) {
  min-height: 44px;
  margin: 0;
}

.success-wrapper {
  max-width: 760px;
  margin: 0 auto;
}

.success-card {
  padding-bottom: 8px;
}

.success-text {
  color: #4b5563;
  margin: 0 0 20px;
  padding-top: 25px;
}

.qr-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-radius: 18px;
  background: #fff;
}

.qr-image {
  width: 240px;
  height: 240px;
  object-fit: contain;
  border-radius: 16px;
  background: #fff;
}

.qr-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.promo-summary-badge {
  margin-bottom: 16px;
  padding: 10px 14px;
  border-radius: 12px;
  background: #ffe3eb;
  color: #b85c77;
  font-size: 14px;
  font-weight: 700;
}

.old-inline-price {
  text-decoration: line-through;
  color: #9ca3af;
  margin-right: 6px;
}
.delivery-form {
  padding-top: 25px;
}
.checkout-btn {
  margin-top: 15px;
  margin-bottom: 5px;
  border-radius: 10px;
  padding-inline: 22px;
  padding: 20px;
  text-transform: none;
  font-weight: 600;
  background: #b9364e;
  color: white;
}

.back-btn {
  border-radius: 8px;
  text-transform: none;
  font-weight: 700;
  color: #b9364e;
  border: 1px solid #f3c4cd;
  background: #fff1f4;
}

.stripe-dialog-card {
  background: #fff;
  border: 3px solid #f1e6e1;
  border-radius: 24px;
  padding: 12px;
}
.empty-cart-one {
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

.view-qr {
  margin-top: 15px;
  margin-bottom: 5px;
  padding-inline: 22px;
  padding: 20px;
  text-transform: none;
  font-weight: 600;
  background: #b9364e;
  color: white;
}
@media (max-width: 600px) {
  .checkout-page {
    padding: 0 6px;
  }

  .checkout-card,
  .summary-card {
    padding: 16px;
    border-radius: 18px;
    position: static;
    top: unset;
  }

  .section-title {
    font-size: 20px;
  }

  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .checkout-btn,
  .back-btn {
    width: 100%;
    justify-content: center;
  }

  .summary-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .item-total {
    align-items: flex-start;
  }

  .summary-row,
  .summary-total {
    font-size: 14px;
  }

  .qr-image {
    width: 180px;
    height: 180px;
  }

  .empty-cart-one {
    padding: 32px 16px;
  }

  .stripe-dialog-card {
    padding: 8px;
    border-radius: 18px;
  }

  :deep(.payment-radio-group .v-selection-control-group) {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
