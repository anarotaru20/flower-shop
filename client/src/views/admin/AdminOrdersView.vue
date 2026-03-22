<template>
  <div class="orders-page">
    <h1 class="text-h4 font-weight-bold mb-6">Comenzi</h1>

    <v-alert v-if="store.error" type="error" variant="tonal" class="mb-4">
      {{ store.error }}
    </v-alert>

    <v-card elevation="2" rounded="xl">
      <v-card-text>
        <v-progress-circular v-if="store.loading" indeterminate />

        <v-table v-else>
          <thead>
            <tr>
              <th>ID comandă</th>
              <th>Client</th>
              <th>Telefon</th>
              <th>Status</th>
              <th>Total</th>
              <th>Data</th>
              <th>Acțiuni</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="order in store.orders" :key="order.id">
              <td>{{ shortId(order.id) }}</td>
              <td>{{ order.customer_name || '-' }}</td>
              <td>{{ order.phone || '-' }}</td>
              <td>
                <v-select
                  :model-value="order.status"
                  :items="statusOptions"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="status-select"
                  @update:model-value="changeStatus(order.id, $event)"
                />
              </td>

              <td>{{ formatPrice(order.total) }}</td>
              <td>{{ formatDate(order.created_at) }}</td>
              <td>
                <v-btn size="small" variant="text" @click="openDetails(order.id)"> Detalii </v-btn>
              </td>
            </tr>

            <tr v-if="!store.orders.length && !store.loading">
              <td colspan="7" class="text-center py-4">Nu există comenzi.</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="detailsDialog" max-width="1000">
      <v-card rounded="xl">
        <v-card-title class="font-weight-bold"> Detalii comandă </v-card-title>

        <v-card-text>
          <v-progress-circular v-if="store.detailsLoading" indeterminate />

          <div v-else-if="store.selectedOrder" class="details-content">
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <div class="detail-item">
                  <span class="detail-label">ID comandă:</span>
                  <span>{{ store.selectedOrder.id || '-' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Client:</span>
                  <span>{{ store.selectedOrder.customer_name || '-' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Telefon:</span>
                  <span>{{ store.selectedOrder.phone || '-' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Adresă:</span>
                  <span>{{ store.selectedOrder.shipping_address || '-' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Metodă plată:</span>
                  <span>{{ store.selectedOrder.payment_method || '-' }}</span>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="detail-item">
                  <span class="detail-label">Status comandă:</span>
                  <v-chip
                    :color="getStatusColor(store.selectedOrder.status)"
                    size="small"
                    variant="flat"
                  >
                    {{ store.selectedOrder.status || '-' }}
                  </v-chip>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Status plată:</span>
                  <v-chip
                    :color="getPaymentStatusColor(store.selectedOrder.payment_status)"
                    size="small"
                    variant="flat"
                  >
                    {{ store.selectedOrder.payment_status || '-' }}
                  </v-chip>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Subtotal:</span>
                  <span>{{ formatPrice(store.selectedOrder.subtotal) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">TVA:</span>
                  <span>{{ formatPrice(store.selectedOrder.tax_amount) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Total:</span>
                  <span>{{ formatPrice(store.selectedOrder.total) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Nr. factură:</span>
                  <span>{{ store.selectedOrder.invoice_number || '-' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Plătit la:</span>
                  <span>{{ formatDate(store.selectedOrder.paid_at) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Creată la:</span>
                  <span>{{ formatDate(store.selectedOrder.created_at) }}</span>
                </div>
              </v-col>
            </v-row>

            <v-divider class="mb-4" />

            <h3 class="text-h6 font-weight-bold mb-3">Produse</h3>

            <v-table>
              <thead>
                <tr>
                  <th>Imagine</th>
                  <th>Produs</th>
                  <th>Cantitate</th>
                  <th>Preț</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in store.selectedOrder.order_items || []" :key="item.id">
                  <td>
                    <v-img
                      v-if="item.products?.image_url"
                      :src="item.products.image_url"
                      width="56"
                      height="56"
                      cover
                      class="rounded-lg"
                    />
                    <span v-else>-</span>
                  </td>
                  <td>{{ item.product_name || item.products?.name || '-' }}</td>
                  <td>{{ item.quantity || 0 }}</td>
                  <td>{{ formatPrice(item.price) }}</td>
                </tr>

                <tr v-if="!(store.selectedOrder.order_items || []).length">
                  <td colspan="4" class="text-center py-4">
                    Nu există produse în această comandă.
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeDetails"> Închide </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAdminOrdersStore } from '@/stores/adminOrders'

const store = useAdminOrdersStore()
const detailsDialog = ref(false)

function formatPrice(value) {
  return `${Number(value || 0).toFixed(2)} lei`
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString('ro-RO')
}

function shortId(id) {
  if (!id) return '-'
  return `${id.slice(0, 8)}...`
}

const statusOptions = ['pending', 'confirmed', 'completed', 'cancelled']

async function changeStatus(id, status) {
  if (!status) return
  await store.updateOrderStatus(id, status)
}

function getStatusColor(status) {
  if (status === 'completed') return 'green'
  if (status === 'pending') return 'orange'
  if (status === 'cancelled') return 'red'
  return 'grey'
}

function getPaymentStatusColor(status) {
  if (status === 'paid') return 'green'
  if (status === 'unpaid') return 'red'
  return 'grey'
}

async function openDetails(id) {
  detailsDialog.value = true
  await store.fetchOrderById(id)
}

function closeDetails() {
  detailsDialog.value = false
  store.clearSelectedOrder()
}

onMounted(() => {
  store.fetchOrders()
})
</script>

<style scoped>
.orders-page {
  max-width: 1400px;
  margin: 0 auto;
}

.details-content {
  padding-top: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.detail-label {
  font-weight: 700;
}
</style>
