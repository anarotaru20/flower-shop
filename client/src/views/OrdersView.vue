<template>
  <v-container class="py-8">
    <div class="orders-page">
      <div class="orders-header">
        <h1>Comenzile mele</h1>
      </div>

      <v-alert v-if="ordersStore.error" type="error" class="mb-4">
        {{ ordersStore.error }}
      </v-alert>

      <v-progress-circular v-if="ordersStore.loading" indeterminate color="primary" />

      <div v-else>
        <v-alert v-if="!decoratedOrders.length" type="info" variant="tonal">
          Nu ai comenzi inca.
        </v-alert>

        <v-card v-for="order in decoratedOrders" :key="order.id" class="mb-4 order-card" elevation="1">
          <v-card-title class="d-flex justify-space-between flex-wrap ga-3">
            <div>
              <strong>#{{ order.invoice_number }}</strong>
              <div class="text-caption">
                {{ formatDate(order.created_at) }}
              </div>
            </div>

            <div class="d-flex align-center flex-wrap ga-2">
              <v-chip v-if="order.hasDiscount" color="pink-lighten-4" text-color="pink-darken-2">
                Reducere aplicata
              </v-chip>

              <v-chip color="primary">
                {{ order.status }}
              </v-chip>

              <v-chip :color="order.payment_status === 'paid' ? 'green' : 'orange'">
                {{ order.payment_status }}
              </v-chip>
            </div>
          </v-card-title>

          <v-card-text>
            <div v-for="item in order.order_items" :key="item.id" class="order-item">
              <div>
                <div class="item-name">
                  {{ item.product_name || item.products?.name }}
                </div>

                <div class="text-caption item-price-line">
                  {{ item.quantity }} x

                  <span v-if="item.hasDiscount" class="old-price">
                    {{ formatPrice(item.originalPrice) }}
                  </span>

                  <span>
                    {{ formatPrice(item.price) }}
                  </span>

                  <span v-if="item.hasDiscount" class="discount-badge">
                    -{{ item.discountPercent }}%
                  </span>
                </div>
              </div>

              <div class="item-line-total">
                <span v-if="item.hasDiscount" class="old-price">
                  {{ formatPrice(item.originalLineTotal) }}
                </span>
                <span>
                  {{ formatPrice(item.lineTotal) }}
                </span>
              </div>
            </div>

            <v-divider class="my-3" />

            <div v-if="order.hasDiscount" class="totals-box">
              <div class="totals-row">
                <span>Subtotal initial</span>
                <span>{{ formatPrice(order.originalSubtotal) }}</span>
              </div>

              <div class="totals-row discount-row">
                <span>Reducere</span>
                <span>- {{ formatPrice(order.discountAmount) }}</span>
              </div>
            </div>

            <div class="order-total">
              Total: <strong>{{ formatPrice(order.total) }}</strong>
            </div>

            <v-btn
              variant="outlined"
              size="small"
              class="mt-3"
              @click="handleDownloadInvoice(order.id, order.invoice_number)"
            >
              Descarca factura
            </v-btn>

            <v-btn
              v-if="order.status === 'pending'"
              variant="outlined"
              size="small"
              class="mt-3 ml-2"
              @click="handleCancelOrder(order.id)"
            >
              Anuleaza comanda
            </v-btn>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useOrdersStore } from '@/stores/orders'

const ordersStore = useOrdersStore()

const decoratedOrders = computed(() => {
  return (ordersStore.orders || []).map((order) => {
    const decoratedItems = (order.order_items || []).map((item) => {
      const currentPrice = Number(item.price || 0)
      const originalPrice = Number(item.products?.price || item.price || 0)
      const quantity = Number(item.quantity || 0)
      const hasDiscount = originalPrice > currentPrice
      const discountPercent = hasDiscount
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : 0

      return {
        ...item,
        originalPrice,
        hasDiscount,
        discountPercent,
        lineTotal: currentPrice * quantity,
        originalLineTotal: originalPrice * quantity,
      }
    })

    const originalSubtotal = decoratedItems.reduce((sum, item) => sum + item.originalLineTotal, 0)
    const finalSubtotal = decoratedItems.reduce((sum, item) => sum + item.lineTotal, 0)
    const discountAmount = Number((originalSubtotal - finalSubtotal).toFixed(2))
    const hasDiscount = discountAmount > 0

    return {
      ...order,
      order_items: decoratedItems,
      originalSubtotal,
      finalSubtotal,
      discountAmount,
      hasDiscount,
    }
  })
})

function formatPrice(val) {
  return `${Number(val).toFixed(2)} lei`
}

function formatDate(date) {
  return new Date(date).toLocaleString('ro-RO')
}

onMounted(() => {
  ordersStore.fetchOrders()
})

async function handleDownloadInvoice(orderId, invoiceNumber) {
  try {
    const blob = await ordersStore.downloadUserInvoice(orderId)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `factura-${invoiceNumber || orderId}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()

    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Eroare la descarcarea facturii:', error)
  }
}

async function handleCancelOrder(orderId) {
  if (!confirm('Sigur vrei sa anulezi comanda?')) return

  try {
    await ordersStore.cancelUserOrder(orderId)
  } catch (error) {
    console.error('Eroare la anulare:', error)
  }
}
</script>

<style scoped>
.order-card {
  border-radius: 18px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
}

.item-name {
  font-weight: 600;
}

.item-price-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.item-line-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.old-price {
  text-decoration: line-through;
  color: #9ca3af;
}

.discount-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  background: #fce7f3;
  color: #be185d;
  font-size: 12px;
  font-weight: 700;
}

.totals-box {
  margin-bottom: 10px;
}

.totals-row {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-bottom: 6px;
  color: #6b7280;
}

.discount-row {
  color: #be185d;
  font-weight: 600;
}

.order-total {
  text-align: right;
  font-size: 16px;
  padding-top: 8px;
}
</style>