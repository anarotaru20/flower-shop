<template>
  <div class="products-page">
    <div class="products-header">
      <div class="products-title-wrap">
        <h1 class="text-h4 font-weight-bold page-title">Produse</h1>
      </div>

      <div class="products-toolbar">
        <v-text-field
          v-model="searchInput"
          placeholder="Caută după numele produsului..."
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-magnify"
          hide-details
          clearable
          class="products-search"
        />
        <v-btn color="primary" class="add-product-btn" @click="openCreateDialog">
          Adaugă produs
        </v-btn>
      </div>
    </div>

    <v-alert v-if="store.error" type="error" variant="tonal" class="mb-4">
      {{ store.error }}
    </v-alert>

    <v-card class="products-card" elevation="2">
      <v-card-title class="font-weight-bold products-card-title">
        Lista produse
        <v-spacer />
        <span class="products-count">{{ filteredProducts.length }} produse</span>
      </v-card-title>

      <v-card-text>
        <div v-if="store.loading" class="loading-wrap">
          <v-progress-circular indeterminate />
        </div>

        <template v-else>
          <div v-if="!isMobile" class="desktop-table">
            <v-table class="products-table">
              <thead>
                <tr>
                  <th class="text-left font-weight-bold">Nume</th>
                  <th class="text-right font-weight-bold">Preț</th>
                  <th class="text-left font-weight-bold">Categorie</th>
                  <th class="text-center font-weight-bold">
                    <div class="stock-header">
                      <span>Stoc</span>

                      <v-btn icon size="x-small" variant="text" @click="toggleStockSort">
                        <v-icon size="18">
                          {{
                            stockSort === 'asc'
                              ? 'mdi-arrow-up'
                              : stockSort === 'desc'
                                ? 'mdi-arrow-down'
                                : 'mdi-swap-vertical'
                          }}
                        </v-icon>
                      </v-btn>
                    </div>
                  </th>
                  <th class="text-center font-weight-bold">Acțiuni</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="product in filteredProducts"
                  :key="product.id"
                  v-memo="[
                    product.id,
                    product.name,
                    product.price,
                    product.stock,
                    product.image_url,
                    product.categories?.name,
                  ]"
                >
                  <td>
                    <div class="product-name-cell">
                      <div v-if="product.image_url" class="product-thumb">
                        <img
                          :src="getOptimizedImage(product.image_url, 100)"
                          :alt="product.name"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div v-else class="product-thumb placeholder">
                        <v-icon size="18">mdi-image-outline</v-icon>
                      </div>

                      <div class="product-main-info">
                        <span class="product-name">{{ product.name }}</span>
                      </div>
                    </div>
                  </td>

                  <td class="text-right product-price">{{ formatPrice(product.price) }}</td>
                  <td>{{ product.categories?.name || '-' }}</td>
                  <td class="text-center">
                    <v-chip
                      :color="getStockColor(product.stock)"
                      size="small"
                      variant="flat"
                      class="stock-chip"
                    >
                      {{ product.stock ?? 0 }}
                    </v-chip>
                  </td>
                  <td>
                    <div class="actions-cell">
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        color="primary"
                        @click="openEditDialog(product)"
                      >
                        <v-icon>mdi-pencil-outline</v-icon>
                      </v-btn>

                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        color="red"
                        @click="openDeleteDialog(product)"
                      >
                        <v-icon>mdi-delete-outline</v-icon>
                      </v-btn>
                    </div>
                  </td>
                </tr>

                <tr v-if="!filteredProducts.length">
                  <td colspan="5" class="text-center py-6">
                    Nu există produse care să corespundă căutării.
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <div v-else class="mobile-products">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="mobile-product-card"
              v-memo="[
                product.id,
                product.name,
                product.price,
                product.stock,
                product.image_url,
                product.categories?.name,
              ]"
            >
              <div class="mobile-product-top">
                <div v-if="product.image_url" class="mobile-product-thumb">
                  <img
                    :src="getOptimizedImage(product.image_url, 120)"
                    :alt="product.name"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div v-else class="mobile-product-thumb placeholder">
                  <v-icon size="20">mdi-image-outline</v-icon>
                </div>

                <div class="mobile-product-main">
                  <h3 class="mobile-product-name">{{ product.name }}</h3>
                  <p class="mobile-product-category">
                    {{ product.categories?.name || 'Fără categorie' }}
                  </p>
                </div>
              </div>

              <div class="mobile-product-meta">
                <div class="mobile-meta-box">
                  <span class="mobile-meta-label">Preț</span>
                  <span class="mobile-meta-value">{{ formatPrice(product.price) }}</span>
                </div>

                <div class="mobile-meta-box">
                  <span class="mobile-meta-label">Stoc</span>
                  <v-chip
                    :color="getStockColor(product.stock)"
                    size="small"
                    variant="flat"
                    class="stock-chip"
                  >
                    {{ product.stock ?? 0 }}
                  </v-chip>
                </div>
              </div>

              <div class="mobile-actions">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="primary"
                  @click="openEditDialog(product)"
                >
                  <v-icon>mdi-pencil-outline</v-icon>
                </v-btn>

                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="red"
                  @click="openDeleteDialog(product)"
                >
                  <v-icon>mdi-delete-outline</v-icon>
                </v-btn>
              </div>
            </div>

            <div v-if="!filteredProducts.length" class="mobile-empty-state">
              Nu există produse care să corespundă căutării.
            </div>
          </div>
        </template>
      </v-card-text>
    </v-card>

    <v-dialog v-model="productDialog" max-width="760">
      <v-card class="dialog-card" rounded="xl">
        <v-card-title class="font-weight-bold dialog-title">
          {{ isEditMode ? 'Editează produs' : 'Adaugă produs' }}
        </v-card-title>

        <v-card-text class="dialog-content">
          <v-row>
            <v-col cols="12">
              <label class="profile-input-label">Nume</label>
              <v-text-field v-model="form.name" variant="outlined" density="comfortable" />
            </v-col>

            <v-col cols="12" md="6">
              <label class="profile-input-label">Preț</label>
              <v-text-field
                v-model.number="form.price"
                type="number"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <v-col cols="12" md="6">
              <label class="profile-input-label">Stoc</label>
              <v-text-field
                v-model.number="form.stock"
                type="number"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <v-col cols="12">
              <v-row align="center">
                <v-col cols="12" md="9">
                  <label class="profile-input-label">Imagine URL</label>
                  <v-text-field v-model="form.image_url" variant="outlined" density="comfortable" />
                </v-col>

                <v-col cols="12" md="3" class="d-flex justify-center">
                  <div class="image-preview-box" v-if="form.image_url">
                    <img
                      :src="getOptimizedImage(form.image_url, 200)"
                      alt="Preview produs"
                      class="image-preview"
                    />
                  </div>

                  <div v-else class="image-preview-placeholder">
                    <v-icon size="20">mdi-image-outline</v-icon>
                  </div>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <label class="profile-input-label">Descriere</label>
              <v-textarea v-model="form.description" variant="outlined" rows="3" />
            </v-col>

            <v-col cols="12">
              <label class="profile-input-label">Instrucțiuni de îngrijire</label>
              <v-textarea v-model="form.care_instructions" variant="outlined" rows="3" />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="dialog-actions">
          <v-spacer />
          <v-btn variant="text" @click="closeProductDialog"> Anulează </v-btn>
          <v-btn color="primary" :loading="store.loading" @click="submitProduct">
            {{ isEditMode ? 'Salvează' : 'Creează' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card class="dialog-card" rounded="xl">
        <v-card-title class="font-weight-bold dialog-title"> Confirmare ștergere </v-card-title>

        <v-card-text class="delete-text">
          Sigur vrei să ștergi produsul
          <strong>{{ productToDelete?.name || '-' }}</strong
          >?
        </v-card-text>

        <v-card-actions class="dialog-actions">
          <v-spacer />
          <v-btn variant="text" @click="closeDeleteDialog"> Anulează </v-btn>
          <v-btn color="red" :loading="store.loading" @click="confirmDelete"> Șterge </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useAdminProductsStore } from '@/stores/adminProducts'

const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)

const store = useAdminProductsStore()

const searchInput = ref('')
const searchQuery = ref('')
const productDialog = ref(false)
const deleteDialog = ref(false)
const isEditMode = ref(false)
const editingProductId = ref(null)
const productToDelete = ref(null)
const stockSort = ref(null)

let searchTimeout = null

watch(
  searchInput,
  (value) => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      searchQuery.value = value
    }, 180)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  clearTimeout(searchTimeout)
})

function getOptimizedImage(url, width = 200) {
  if (!url) return ''

  if (url.includes('supabase')) {
    return `${url}?width=${width}&quality=70`
  }

  if (url.includes('cloudinary')) {
    return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`)
  }

  return url
}

function toggleStockSort() {
  if (stockSort.value === null) {
    stockSort.value = 'asc'
  } else if (stockSort.value === 'asc') {
    stockSort.value = 'desc'
  } else {
    stockSort.value = null
  }
}

const initialForm = () => ({
  name: '',
  price: 0,
  stock: 0,
  description: '',
  care_instructions: '',
  image_url: '',
  category_id: '',
})

const form = ref(initialForm())

const filteredProducts = computed(() => {
  let list = store.products ? [...store.products] : []
  const query = searchQuery.value.trim().toLowerCase()

  if (query) {
    list = list.filter((product) => (product.name || '').toLowerCase().includes(query))
  }

  if (stockSort.value === 'asc') {
    list.sort((a, b) => (a.stock || 0) - (b.stock || 0))
  } else if (stockSort.value === 'desc') {
    list.sort((a, b) => (b.stock || 0) - (a.stock || 0))
  }

  return list
})

function formatPrice(value) {
  return `${Number(value || 0).toFixed(2)} lei`
}

function getStockColor(stock) {
  if (Number(stock) > 10) return 'green'
  if (Number(stock) > 0) return 'orange'
  return 'red'
}

function resetForm() {
  form.value = initialForm()
  editingProductId.value = null
  isEditMode.value = false
}

function openCreateDialog() {
  resetForm()
  productDialog.value = true
}

function openEditDialog(product) {
  isEditMode.value = true
  editingProductId.value = product.id
  form.value = {
    name: product.name || '',
    price: Number(product.price || 0),
    stock: Number(product.stock || 0),
    description: product.description || '',
    care_instructions: product.care_instructions || '',
    image_url: product.image_url || '',
    category_id: product.category_id || '',
  }
  productDialog.value = true
}

function closeProductDialog() {
  productDialog.value = false
  resetForm()
}

async function submitProduct() {
  const payload = {
    name: form.value.name,
    price: Number(form.value.price || 0),
    stock: Number(form.value.stock || 0),
    description: form.value.description,
    care_instructions: form.value.care_instructions,
    image_url: form.value.image_url,
    category_id: form.value.category_id || null,
  }

  if (isEditMode.value && editingProductId.value) {
    await store.updateProduct(editingProductId.value, payload)
  } else {
    await store.createProduct(payload)
  }

  if (!store.error) {
    closeProductDialog()
  }
}

function openDeleteDialog(product) {
  productToDelete.value = product
  deleteDialog.value = true
}

function closeDeleteDialog() {
  deleteDialog.value = false
  productToDelete.value = null
}

async function confirmDelete() {
  if (!productToDelete.value?.id) return

  await store.deleteProduct(productToDelete.value.id)

  if (!store.error) {
    closeDeleteDialog()
  }
}

onMounted(() => {
  store.fetchProducts()
})
</script>

<style scoped>
.products-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 8px;
}

.products-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.products-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.page-title {
  color: #1f2937;
}

.products-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.products-search {
  min-width: 320px;
  max-width: 380px;
}

.add-product-btn {
  height: 48px;
  border-radius: 10px;
  text-transform: none;
  font-weight: 700;
  padding-inline: 18px;
  background: #b9364e;
  color: white;
}

.products-card {
  border-radius: 24px;
  border: 1px solid #f1e6e1;
  box-shadow: 0 12px 30px rgba(76, 58, 50, 0.08) !important;
  overflow: hidden;
}

.products-card-title {
  padding: 22px 24px 10px;
  color: #1f2937;
}

.products-count {
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

.mobile-products {
  display: none;
}

:deep(.products-table) {
  background: transparent;
}

:deep(.products-table .v-table__wrapper) {
  overflow-x: auto;
}

:deep(.products-table thead th) {
  color: #374151;
  font-size: 14px;
  font-weight: 800 !important;
  white-space: nowrap;
}

:deep(.products-table tbody td) {
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  color: #111827;
  vertical-align: middle;
}

:deep(.products-table tbody tr) {
  transition: background 0.2s ease;
}

:deep(.products-table tbody tr:hover) {
  background: #fcfcfc;
}

.product-name-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 240px;
}

.product-thumb {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  overflow: hidden;
  background: #f8f1ec;
  border: 1px solid #f1e6e1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  contain: layout paint style;
}

.product-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.product-thumb.placeholder {
  color: #9ca3af;
}

.product-main-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.product-name {
  font-weight: 700;
  color: #1f2937;
}

.product-price {
  font-weight: 700;
  color: #1f2937;
  white-space: nowrap;
}

.stock-chip {
  min-width: 52px;
  justify-content: center;
  font-weight: 700;
}

.actions-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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

.delete-text {
  font-size: 15px;
  color: #374151;
}

.mobile-product-card {
  border: 1px solid #f1e6e1;
  border-radius: 20px;
  padding: 16px;
  background: #fff;
  box-shadow: 0 8px 20px rgba(76, 58, 50, 0.06);
  content-visibility: auto;
  contain-intrinsic-size: 180px;
}

.mobile-product-top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-product-thumb {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  overflow: hidden;
  background: #f8f1ec;
  border: 1px solid #f1e6e1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  contain: layout paint style;
}

.mobile-product-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.mobile-product-thumb.placeholder {
  color: #9ca3af;
}

.mobile-product-main {
  min-width: 0;
  flex: 1;
}

.mobile-product-name {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #1f2937;
  word-break: break-word;
}

.mobile-product-category {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 13px;
}

.mobile-product-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
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
}

.mobile-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f3ebe7;
}

.mobile-empty-state {
  text-align: center;
  padding: 24px 16px;
  color: #6b7280;
  border: 1px dashed #e7d7cf;
  border-radius: 18px;
}

.stock-header {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.image-preview-box {
  width: 110px;
  height: 110px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f1e6e1;
  background: #fcfaf8;
  display: flex;
  align-items: center;
  justify-content: center;
  contain: layout paint style;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-preview-placeholder {
  width: 110px;
  height: 110px;
  border-radius: 16px;
  border: 1px solid #f1e6e1;
  background: #fcfaf8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.profile-input-label {
  font-size: 14px;
  font-weight: 600;
  color: #574741;
}

@media (max-width: 960px) {
  .products-page {
    padding: 4px;
  }

  .products-header {
    align-items: stretch;
  }

  .products-toolbar {
    width: 100%;
  }

  .products-search {
    min-width: 0;
    max-width: none;
    flex: 1;
  }

  .add-product-btn {
    flex-shrink: 0;
  }
}

@media (max-width: 700px) {
  .desktop-table {
    display: none;
  }

  .mobile-products {
    display: grid;
    gap: 14px;
  }

  .products-card-title {
    padding: 18px 18px 8px;
  }

  .page-title {
    font-size: 28px !important;
  }
}

@media (max-width: 600px) {
  .products-page {
    padding: 0;
  }

  .products-header {
    gap: 14px;
    margin-bottom: 18px;
  }

  .products-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .products-search {
    width: 100%;
  }

  .add-product-btn {
    width: 100%;
  }

  .products-card {
    border-radius: 20px;
  }

  .mobile-product-card {
    padding: 14px;
    border-radius: 18px;
  }

  .mobile-product-meta {
    grid-template-columns: 1fr;
  }

  .dialog-title {
    font-size: 18px;
  }
}
</style>
