<template>
  <div class="products-page">
    <div class="products-header">
      <h1 class="text-h4 font-weight-bold">Produse</h1>

      <v-btn color="primary" @click="openCreateDialog">
        Adaugă produs
      </v-btn>
    </div>

    <v-alert
      v-if="store.error"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      {{ store.error }}
    </v-alert>

    <v-card elevation="2" rounded="xl">
      <v-card-text>
        <v-progress-circular
          v-if="store.loading"
          indeterminate
        />

        <v-table v-else>
          <thead>
            <tr>
              <th>Nume</th>
              <th>Preț</th>
              <th>Categorie</th>
              <th>Stoc</th>
              <th>Acțiuni</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="product in store.products" :key="product.id">
              <td>{{ product.name }}</td>
              <td>{{ formatPrice(product.price) }}</td>
              <td>{{ product.categories?.name || '-' }}</td>
              <td>
                <v-chip
                  :color="getStockColor(product.stock)"
                  size="small"
                  variant="flat"
                >
                  {{ product.stock ?? 0 }}
                </v-chip>
              </td>
              <td>
                <div class="actions-cell">
                  <v-btn
                    size="small"
                    variant="text"
                    @click="openEditDialog(product)"
                  >
                    Edit
                  </v-btn>

                  <v-btn
                    size="small"
                    variant="text"
                    color="red"
                    @click="openDeleteDialog(product)"
                  >
                    Delete
                  </v-btn>
                </div>
              </td>
            </tr>

            <tr v-if="!store.products.length && !store.loading">
              <td colspan="5" class="text-center py-4">
                Nu există produse.
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="productDialog" max-width="700">
      <v-card rounded="xl">
        <v-card-title class="font-weight-bold">
          {{ isEditMode ? 'Editează produs' : 'Adaugă produs' }}
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                label="Nume"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.price"
                label="Preț"
                type="number"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.stock"
                label="Stoc"
                type="number"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.category_id"
                label="Category ID"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.image_url"
                label="Imagine URL"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Descriere"
                variant="outlined"
                rows="4"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeProductDialog">
            Anulează
          </v-btn>
          <v-btn color="primary" :loading="store.loading" @click="submitProduct">
            {{ isEditMode ? 'Salvează' : 'Creează' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card rounded="xl">
        <v-card-title class="font-weight-bold">
          Confirmare ștergere
        </v-card-title>

        <v-card-text>
          Sigur vrei să ștergi produsul
          <strong>{{ productToDelete?.name || '-' }}</strong>?
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeDeleteDialog">
            Anulează
          </v-btn>
          <v-btn color="red" :loading="store.loading" @click="confirmDelete">
            Șterge
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAdminProductsStore } from '@/stores/adminProducts'

const store = useAdminProductsStore()

const productDialog = ref(false)
const deleteDialog = ref(false)
const isEditMode = ref(false)
const editingProductId = ref(null)
const productToDelete = ref(null)

const initialForm = () => ({
  name: '',
  price: 0,
  stock: 0,
  description: '',
  image_url: '',
  category_id: '',
})

const form = ref(initialForm())

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
}

.products-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.actions-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>