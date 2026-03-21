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
        <v-alert v-if="!orders.length" type="info" variant="tonal"> Nu ai comenzi inca. </v-alert>

        <v-card v-for="order in orders" :key="order.id" class="mb-4" elevation="1">
          <v-card-title class="d-flex justify-space-between">
            <div>
              <strong>#{{ order.invoice_number }}</strong>
              <div class="text-caption">
                {{ formatDate(order.created_at) }}
              </div>
            </div>

            <div>
              <v-chip color="primary" class="mr-2">
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
                <div class="text-caption">{{ item.quantity }} x {{ formatPrice(item.price) }}</div>
              </div>

              <div>
                {{ formatPrice(item.quantity * item.price) }}
              </div>
            </div>

            <v-divider class="my-3" />

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

const orders = computed(() => ordersStore.orders)

function formatPrice(val) {
  return `${Number(val).toFixed(2)} lei`
}

function formatDate(date) {
  return new Date(date).toLocaleString()
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
.order-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.item-name {
  font-weight: 600;
}

.order-total {
  text-align: right;
  font-size: 16px;
}
</style>
