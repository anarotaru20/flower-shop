<template>
  <div class="orders-page">
    <div class="orders-header">
      <div class="orders-title-wrap">
        <h1 class="text-h4 font-weight-bold page-title">Comenzi</h1>
        <p class="page-subtitle">Administrează comenzile rapid și clar.</p>
      </div>

      <div class="orders-toolbar">
        <v-text-field
          v-model="searchQuery"
          placeholder="Caută după numele clientului..."
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-magnify"
          hide-details
          clearable
          class="orders-search"
        />
      </div>
    </div>

    <v-alert v-if="store.error" type="error" variant="tonal" class="mb-4">
      {{ store.error }}
    </v-alert>

    <v-card class="orders-card" elevation="2">
      <v-card-title class="font-weight-bold orders-card-title">
        Lista comenzi
        <v-spacer />
        <span class="orders-count">{{ filteredOrders.length }} comenzi</span>
      </v-card-title>

      <v-card-text>
        <div v-if="store.loading" class="loading-wrap">
          <v-progress-circular indeterminate />
        </div>

        <template v-else>
          <div class="desktop-table">
            <v-table class="orders-table">
              <thead>
                <tr>
                  <th class="text-left font-weight-bold">ID comandă</th>
                  <th class="text-left font-weight-bold">Client</th>
                  <th class="text-left font-weight-bold">Telefon</th>
                  <th class="text-left font-weight-bold">Status</th>
                  <th class="text-left font-weight-bold">Total</th>
                  <th class="text-left font-weight-bold">Data</th>
                  <th class="text-center font-weight-bold">Acțiuni</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="order in filteredOrders" :key="order.id">
                  <td class="order-id">{{ shortId(order.id) }}</td>
                  <td class="order-customer">{{ order.customer_name || '-' }}</td>
                  <td>{{ order.phone || '-' }}</td>
                  <td class="status-cell">
                    <v-select
                      :model-value="order.status"
                      :items="statusOptions"
                      item-title="label"
                      item-value="value"
                      density="compact"
                      variant="outlined"
                      hide-details
                      class="status-select"
                      @update:model-value="changeStatus(order.id, $event)"
                    />
                  </td>
                  <td class="order-total">{{ formatPrice(order.total) }}</td>
                  <td>{{ formatDate(order.created_at) }}</td>
                  <td>
                    <div class="actions-cell">
                      <v-btn size="small" variant="text" @click="openDetails(order.id)">
                        <v-icon size="20">mdi-eye-outline</v-icon>
                      </v-btn>
                    </div>
                  </td>
                </tr>

                <tr v-if="!filteredOrders.length">
                  <td colspan="7" class="text-center py-6">
                    Nu există comenzi care să corespundă căutării.
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <div class="mobile-orders">
            <div v-for="order in filteredOrders" :key="order.id" class="mobile-order-card">
              <div class="mobile-order-top">
                <div class="mobile-order-main">
                  <h3 class="mobile-order-name">{{ order.customer_name || '-' }}</h3>
                  <p class="mobile-order-id">{{ shortId(order.id) }}</p>
                </div>

                <v-btn size="small" variant="text" @click="openDetails(order.id)">
                  <v-icon size="20">mdi-eye-outline</v-icon>
                </v-btn>
              </div>

              <div class="mobile-order-meta">
                <div class="mobile-meta-box">
                  <span class="mobile-meta-label">Telefon</span>
                  <span class="mobile-meta-value">{{ order.phone || '-' }}</span>
                </div>

                <div class="mobile-meta-box">
                  <span class="mobile-meta-label">Total</span>
                  <span class="mobile-meta-value">{{ formatPrice(order.total) }}</span>
                </div>

                <div class="mobile-meta-box">
                  <span class="mobile-meta-label">Data</span>
                  <span class="mobile-meta-value">{{ formatDate(order.created_at) }}</span>
                </div>
              </div>

              <div class="mobile-status-section">
                <span class="mobile-meta-label">Status comandă</span>
                <v-select
                  :model-value="order.status"
                  :items="statusOptions"
                  item-title="label"
                  item-value="value"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="status-select"
                  @update:model-value="changeStatus(order.id, $event)"
                />
              </div>
            </div>

            <div v-if="!filteredOrders.length" class="mobile-empty-state">
              Nu există comenzi care să corespundă căutării.
            </div>
          </div>
        </template>
      </v-card-text>
    </v-card>

    <v-dialog v-model="detailsDialog" max-width="1000">
      <v-card class="dialog-card" rounded="xl">
        <v-card-title class="font-weight-bold dialog-title">Detalii comandă</v-card-title>

        <v-card-text class="dialog-content">
          <div v-if="store.detailsLoading" class="loading-wrap">
            <v-progress-circular indeterminate />
          </div>

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
                    {{ formatOrderStatus(store.selectedOrder.status) }}
                  </v-chip>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Status plată:</span>
                  <v-chip
                    :color="getPaymentStatusColor(store.selectedOrder.payment_status)"
                    size="small"
                    variant="flat"
                  >
                    {{ formatPaymentStatus(store.selectedOrder.payment_status) }}
                  </v-chip>
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

            <div class="details-table-wrap">
              <v-table class="details-products-table">
                <thead>
                  <tr>
                    <th class="font-weight-bold">Produs</th>
                    <th class="font-weight-bold">Cantitate</th>
                    <th class="text-right font-weight-bold">Preț</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in store.selectedOrder.order_items || []" :key="item.id">
                    <td>{{ item.product_name || item.products?.name || '-' }}</td>
                    <td>{{ item.quantity || 0 }}</td>
                    <td class="text-right">{{ formatPrice(item.price) }}</td>
                  </tr>

                  <tr v-if="!(store.selectedOrder.order_items || []).length">
                    <td colspan="4" class="text-center py-4">
                      Nu există produse în această comandă.
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <div class="invoice-summary">
                <div class="invoice-summary-row" v-if="hasDiscount(store.selectedOrder)">
                  <span>Subtotal inițial:</span>
                  <strong>{{ formatPrice(getItemsOriginalSubtotal(store.selectedOrder)) }}</strong>
                </div>

                <div
                  class="invoice-summary-row discount-row"
                  v-if="hasDiscount(store.selectedOrder)"
                >
                  <span>Reducere:</span>
                  <strong>-{{ formatPrice(getDiscountValue(store.selectedOrder)) }}</strong>
                </div>

                <div class="invoice-summary-row" v-if="hasDiscount(store.selectedOrder)">
                  <span>Subtotal redus:</span>
                  <strong>{{ formatPrice(getFinalSubtotal(store.selectedOrder)) }}</strong>
                </div>

                <div class="invoice-summary-row" v-else>
                  <span>Subtotal:</span>
                  <strong>{{ formatPrice(getFinalSubtotal(store.selectedOrder)) }}</strong>
                </div>

                <div class="invoice-total-box">
                  <span>TOTAL DE PLATĂ:</span>
                  <strong>{{ formatPrice(getFinalSubtotal(store.selectedOrder)) }}</strong>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="dialog-actions">
          <v-spacer />
          <v-btn variant="text" @click="closeDetails">Închide</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAdminOrdersStore } from '@/stores/adminOrders'

const store = useAdminOrdersStore()
const detailsDialog = ref(false)
const searchQuery = ref('')

const statusOptions = [
  { label: 'În procesare', value: 'pending' },
  { label: 'Confirmată', value: 'confirmed' },
  { label: 'Anulată', value: 'cancelled' },
]

const filteredOrders = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) return store.orders || []

  return (store.orders || []).filter((order) =>
    (order.customer_name || '').toLowerCase().includes(query),
  )
})

function getItemsOriginalSubtotal(order) {
  const items = order?.order_items || []

  return items.reduce((sum, item) => {
    const quantity = Number(item.quantity || 0)
    const currentUnitPrice = Number(item.price || 0)
    const originalUnitPrice = Number(
      item.original_price ?? item.products?.price ?? item.product_price ?? currentUnitPrice,
    )

    return sum + originalUnitPrice * quantity
  }, 0)
}

function getFinalSubtotal(order) {
  return Number(order?.total || 0)
}

function getDiscountValue(order) {
  const originalSubtotal = getItemsOriginalSubtotal(order)
  const finalSubtotal = getFinalSubtotal(order)
  const discount = originalSubtotal - finalSubtotal

  return discount > 0 ? discount : 0
}

function hasDiscount(order) {
  return getDiscountValue(order) > 0.009
}

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

function formatOrderStatus(status) {
  if (status === 'pending') return 'În procesare'
  if (status === 'confirmed') return 'Confirmată'
  if (status === 'cancelled') return 'Anulată'
  return status || '-'
}

function formatPaymentStatus(status) {
  if (status === 'paid') return 'Plătit'
  if (status === 'unpaid') return 'Neplătit'
  return status || '-'
}

async function changeStatus(id, status) {
  if (!status) return
  await store.updateOrderStatus(id, status)
}

function getStatusColor(status) {
  if (status === 'confirmed') return 'green'
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
  padding: 8px;
}

.orders-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.orders-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.page-title {
  color: #1f2937;
}

.page-subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.orders-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.orders-search {
  min-width: 320px;
  max-width: 380px;
}

.orders-card {
  border-radius: 24px;
  border: 1px solid #f1e6e1;
  box-shadow: 0 12px 30px rgba(76, 58, 50, 0.08) !important;
  overflow: hidden;
}

.orders-card-title {
  padding: 22px 24px 10px;
  color: #1f2937;
}

.orders-count {
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
}

.loading-wrap {
  display: flex;
  justify-content: center;
  padding: 36px 0;
}

.desktop-table {
  display: block;
}

.mobile-orders {
  display: none;
}

:deep(.orders-table) {
  background: transparent;
}

:deep(.orders-table .v-table__wrapper) {
  overflow-x: auto;
}

:deep(.orders-table thead th) {
  color: #374151;
  font-size: 14px;
  font-weight: 800 !important;
  white-space: nowrap;
}

:deep(.orders-table tbody td) {
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  color: #111827;
  vertical-align: middle;
}

:deep(.orders-table tbody tr) {
  transition: background 0.2s ease;
}

:deep(.orders-table tbody tr:hover) {
  background: #fcfcfc;
}

.order-id {
  color: #6b7280;
  font-size: 13px;
  white-space: nowrap;
}

.order-customer {
  font-weight: 700;
  color: #1f2937;
}

.order-total {
  font-weight: 700;
  color: #1f2937;
  white-space: nowrap;
}

.status-cell {
  min-width: 190px;
}

.actions-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-order-card {
  border: 1px solid #f1e6e1;
  border-radius: 20px;
  padding: 16px;
  background: #fff;
  box-shadow: 0 8px 20px rgba(76, 58, 50, 0.06);
}

.mobile-order-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.mobile-order-main {
  min-width: 0;
  flex: 1;
}

.mobile-order-name {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #1f2937;
  word-break: break-word;
}

.mobile-order-id {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 13px;
}

.mobile-order-meta {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 14px;
}

.mobile-meta-box {
  background: #fcfaf8;
  border: 1px solid #f1e6e1;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-meta-label {
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
}

.mobile-meta-value {
  font-size: 14px;
  font-weight: 800;
  color: #1f2937;
  word-break: break-word;
}

.mobile-status-section {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #f3ebe7;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-empty-state {
  text-align: center;
  padding: 24px 16px;
  color: #6b7280;
  border: 1px dashed #e7d7cf;
  border-radius: 18px;
}

.dialog-card {
  border-radius: 24px;
}

.dialog-title {
  padding: 22px 24px 10px;
  color: #1f2937;
}

.dialog-content {
  padding-top: 10px;
}

.dialog-actions {
  padding: 16px 24px 20px;
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

.details-table-wrap {
  overflow-x: auto;
}

:deep(.details-products-table thead th) {
  white-space: nowrap;
}

.invoice-summary {
  max-width: 360px;
  margin-left: auto;
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.invoice-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
}

.invoice-summary-row span {
  color: #374151;
}

.discount-row strong {
  color: #b9364e;
}

.invoice-total-box {
  margin-top: 4px;
  padding: 16px 18px;
  border: 1px solid #efc2cb;
  background: #fff5f7;
  border-radius: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  font-size: 18px;
  font-weight: 800;
  color: #b9364e;
}

@media (max-width: 960px) {
  .orders-page {
    padding: 4px;
  }

  .orders-header {
    align-items: stretch;
  }

  .orders-toolbar {
    width: 100%;
  }

  .orders-search {
    min-width: 0;
    max-width: none;
    flex: 1;
  }
}

@media (max-width: 700px) {
  .desktop-table {
    display: none;
  }

  .mobile-orders {
    display: grid;
    gap: 14px;
  }

  .orders-card-title {
    padding: 18px 18px 8px;
  }

  .page-title {
    font-size: 28px !important;
  }

  .page-subtitle {
    font-size: 13px;
  }

  .invoice-summary {
    max-width: 100%;
    margin-left: 0;
  }

  .invoice-total-box {
    font-size: 16px;
  }
}

@media (max-width: 600px) {
  .orders-page {
    padding: 0;
  }

  .orders-header {
    gap: 14px;
    margin-bottom: 18px;
  }

  .orders-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .orders-search {
    width: 100%;
  }

  .orders-card {
    border-radius: 20px;
  }

  .mobile-order-card {
    padding: 14px;
    border-radius: 18px;
  }

  .dialog-title {
    font-size: 18px;
  }
}
</style>
