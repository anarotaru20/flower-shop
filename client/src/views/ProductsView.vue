<template>
  <section class="products-page">
    <div class="container">
      <div v-if="productsStore.loading" class="state">Se incarca produsele...</div>

      <div v-else-if="productsStore.error" class="state error">
        {{ productsStore.error }}
      </div>

      <div v-else-if="!productsStore.products.length" class="state">
        Nu exista produse momentan.
      </div>

      <div v-else class="products-layout">
        <aside class="filters-sidebar">
          <div class="filters-card">
            <input
              v-model="searchTerm"
              type="text"
              class="search-input"
              placeholder="Caută un produs..."
            />

            <h2>Filtrează Produsele</h2>
            <div class="divider"></div>

            <div class="filter-group">
              <h3>Categorie</h3>

              <label class="radio-option">
                <input v-model="selectedCategory" type="radio" value="" />
                <span>Toate produsele</span>
              </label>

              <label v-for="category in categories" :key="category.slug" class="radio-option">
                <input v-model="selectedCategory" type="radio" :value="category.slug" />
                <span>{{ category.name }}</span>
              </label>
            </div>

            <!-- <div class="filter-group">
              <h3>Tip produs</h3>

              <label class="radio-option">
                <input v-model="selectedType" type="radio" value="" />
                <span>Toate tipurile</span>
              </label>

              <label v-for="type in types" :key="type.value" class="radio-option">
                <input v-model="selectedType" type="radio" :value="type.value" />
                <span>{{ type.label }}</span>
              </label>
            </div> -->

            <div class="filter-group">
              <h3>Stil</h3>

              <label class="radio-option">
                <input v-model="selectedStyle" type="radio" value="" />
                <span>Toate stilurile</span>
              </label>

              <label v-for="style in styles" :key="style.value" class="radio-option">
                <input v-model="selectedStyle" type="radio" :value="style.value" />
                <span>{{ style.label }}</span>
              </label>
            </div>

            <div class="filter-group">
              <h3>Culoare</h3>

              <div class="color-grid">
                <button
                  v-for="color in colors"
                  :key="color.value"
                  type="button"
                  class="color-option"
                  :class="{ active: selectedColor === color.value }"
                  :title="color.label"
                  @click="selectedColor = color.value"
                >
                  <span class="color-swatch" :style="{ background: colorMap[color.value] }"></span>
                </button>

                <button
                  type="button"
                  class="color-option reset"
                  :class="{ active: !selectedColor }"
                  title="Toate culorile"
                  @click="selectedColor = ''"
                >
                  ✕
                </button>
              </div>
            </div>

            <div class="filter-group">
              <label class="checkbox-option">
                <input v-model="onlyInStock" type="checkbox" />
                <span>Doar produse în stoc</span>
              </label>
            </div>

            <div class="filter-group">
              <h3>
                Pret Maxim: <span class="price-highlight">{{ priceRange }} Lei</span>
              </h3>

              <div class="range-wrap">
                <input
                  v-model="priceRange"
                  type="range"
                  :min="minAvailablePrice"
                  :max="maxAvailablePrice"
                  step="1"
                  class="price-range"
                  :style="rangeStyle"
                />
              </div>

              <div class="price-labels">
                <span>{{ minAvailablePrice }} Lei</span>
                <span>{{ maxAvailablePrice }} Lei</span>
              </div>
            </div>

            <button class="reset-filters-btn" type="button" @click="resetFilters">
              Resetează filtrele
            </button>
          </div>
        </aside>

        <div class="products-content">
          <div class="results-bar">
            <p>{{ displayedProducts.length }} produse</p>
          </div>

          <div v-if="!displayedProducts.length" class="state">
            Nu exista produse pentru filtrele selectate.
          </div>

          <div v-else class="products-grid">
            <article
              v-for="product in displayedProducts"
              :key="product.id"
              v-memo="[product.id, product.finalPrice]"
              class="product-card"
            >
              <RouterLink
                :to="{ name: 'product-detail', params: { slug: product.slug } }"
                class="card-link"
              >
                <div class="product-image-wrap">
                  <img
                    :src="product.image_url || fallbackImage"
                    :alt="product.name"
                    class="product-image"
                    loading="lazy"
                  />
                </div>

                <div class="card-body">
                  <h3>{{ product.name }}</h3>

                  <div v-if="product.hasPromo" class="promo-badge">
                    {{ product.promoLabel }}
                  </div>

                  <div class="meta-list">
                    <span v-if="product.type">{{ formatLabel(product.type) }}</span>
                    <span v-if="product.style">{{ formatLabel(product.style) }}</span>
                    <span v-if="product.color">{{ formatLabel(product.color) }}</span>
                  </div>

                  <div class="price-block">
                    <p v-if="product.hasPromo" class="old-price">{{ product.oldPrice }} RON</p>
                    <p class="price">{{ product.finalPrice }} RON</p>
                  </div>
                </div>
              </RouterLink>

              <div class="card-actions">
                <button
                  class="add-to-cart-btn"
                  type="button"
                  @click.stop="addProductToCart(product)"
                >
                  Adaugă în coș
                </button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { getProductPromoData } from '@/utils/promotions'

const productsStore = useProductsStore()
const authStore = useAuthStore()
const cartStore = useCartStore()
const route = useRoute()
const router = useRouter()

const fallbackImage =
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80'

const searchTerm = ref('')
const selectedCategory = ref(route.query.category || '')
const selectedType = ref('')
const selectedStyle = ref('')
const selectedColor = ref('')
const onlyInStock = ref(false)
const priceRange = ref(500)

const userBirthDate = computed(() => authStore.user?.birth_date || null)

function normalizeValue(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

function formatLabel(value) {
  const text = String(value || '').trim()
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

const normalizedProducts = computed(() => {
  return (productsStore.products || []).map((product) =>
    getProductPromoData(product, userBirthDate.value),
  )
})

const categories = computed(() => {
  const map = new Map()

  for (const product of productsStore.products || []) {
    const category = product.categories

    if (category?.slug && category?.name && !map.has(category.slug)) {
      map.set(category.slug, {
        slug: category.slug,
        name: category.name,
      })
    }
  }

  return Array.from(map.values())
})

const types = [
  { value: 'buchet', label: 'Buchet' },
  { value: 'aranjament', label: 'Aranjament' },
  { value: 'planta', label: 'Planta' },
  { value: 'cadou', label: 'Cadou' },
  { value: 'accesoriu', label: 'Accesoriu' },
]

const styles = [
  { value: 'romantic', label: 'Romantic' },
  { value: 'elegant', label: 'Elegant' },
  { value: 'modern', label: 'Modern' },
  { value: 'rustic', label: 'Rustic' },
  { value: 'delicat', label: 'Delicat' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'festiv', label: 'Festiv' },
]

const colors = [
  { value: 'rosu', label: 'Roșu' },
  { value: 'roz', label: 'Roz' },
  { value: 'alb', label: 'Alb' },
  { value: 'galben', label: 'Galben' },
  { value: 'mov', label: 'Mov' },
  { value: 'albastru', label: 'Albastru' },
  { value: 'verde', label: 'Verde' },
  { value: 'crem', label: 'Crem' },
  { value: 'multicolor', label: 'Multicolor' },
  { value: 'pastel', label: 'Pastel' },
  { value: 'blush', label: 'Blush' },
  { value: 'bordo', label: 'Bordo' },
  { value: 'transparent', label: 'Transparent' },
  { value: 'lemn', label: 'Lemn' },
]

const colorMap = {
  rosu: '#ef4444',
  roz: '#f472b6',
  alb: '#ffffff',
  galben: '#facc15',
  mov: '#a855f7',
  albastru: '#3b82f6',
  verde: '#22c55e',
  crem: '#f5e6c8',
  multicolor: 'linear-gradient(45deg, #ef4444, #facc15, #22c55e, #3b82f6)',
  pastel: '#fde68a',
  blush: '#fda4af',
  bordo: '#7f1d1d',
  transparent: 'repeating-linear-gradient(45deg, #e5e7eb 0 6px, #ffffff 6px 12px)',
  lemn: '#a16207',
}

const minAvailablePrice = computed(() => {
  const prices = normalizedProducts.value
    .map((product) => Number(product.finalPrice || 0))
    .filter((price) => price > 0)

  if (!prices.length) return 10

  return Math.floor(Math.min(...prices))
})

const maxAvailablePrice = computed(() => {
  const prices = normalizedProducts.value
    .map((product) => Number(product.finalPrice || 0))
    .filter((price) => price > 0)

  if (!prices.length) return 500

  return Math.ceil(Math.max(...prices))
})

const rangePercent = computed(() => {
  const min = Number(minAvailablePrice.value)
  const max = Number(maxAvailablePrice.value)
  const current = Number(priceRange.value)

  if (max <= min) return 100

  return ((current - min) / (max - min)) * 100
})

const rangeStyle = computed(() => {
  return {
    background: `linear-gradient(to right, #16a34a 0%, #16a34a ${rangePercent.value}%, #3f3f46 ${rangePercent.value}%, #3f3f46 100%)`,
  }
})

const displayedProducts = computed(() => {
  let filtered = normalizedProducts.value

  if (selectedCategory.value) {
    filtered = filtered.filter((product) => product.categories?.slug === selectedCategory.value)
  }

  if (selectedType.value) {
    filtered = filtered.filter(
      (product) => normalizeValue(product.type) === normalizeValue(selectedType.value),
    )
  }

  if (selectedStyle.value) {
    filtered = filtered.filter(
      (product) => normalizeValue(product.style) === normalizeValue(selectedStyle.value),
    )
  }

  if (selectedColor.value) {
    filtered = filtered.filter(
      (product) => normalizeValue(product.color) === normalizeValue(selectedColor.value),
    )
  }

  if (onlyInStock.value) {
    filtered = filtered.filter((product) => Number(product.stock || 0) > 0)
  }

  if (searchTerm.value.trim()) {
    const term = normalizeValue(searchTerm.value)

    filtered = filtered.filter((product) => {
      return [product.name, product.description, product.type, product.style, product.color]
        .filter(Boolean)
        .some((value) => normalizeValue(value).includes(term))
    })
  }

  filtered = filtered.filter(
    (product) => Number(product.finalPrice || 0) <= Number(priceRange.value),
  )

  return filtered
})

function addProductToCart(product) {
  cartStore.addToCart(product)
}

function resetFilters() {
  searchTerm.value = ''
  selectedCategory.value = route.query.category || ''
  selectedType.value = ''
  selectedStyle.value = ''
  selectedColor.value = ''
  onlyInStock.value = false
  priceRange.value = maxAvailablePrice.value
}

watch(
  () => route.query.category,
  (newCategory) => {
    selectedCategory.value = newCategory || ''
  },
)

watch(selectedCategory, (value) => {
  router.replace({
    query: {
      ...route.query,
      category: value || undefined,
    },
  })
})

watch(
  [minAvailablePrice, maxAvailablePrice],
  ([minPrice, maxPrice]) => {
    if (priceRange.value < minPrice || priceRange.value > maxPrice) {
      priceRange.value = maxPrice
    }
  },
  { immediate: true },
)

onMounted(() => {
  productsStore.fetchProducts()
})
</script>

<style scoped>
.products-page {
  padding: 40px 0;
  background: #fffaf7;
  min-height: calc(100vh - 80px);
}

.container {
  width: min(1280px, calc(100% - 32px));
  margin: 0 auto;
}

.state {
  padding: 40px;
  text-align: center;
  color: #7a716b;
}

.state.error {
  color: #d9534f;
}

.products-layout {
  display: grid;
  grid-template-columns: 290px 1fr;
  gap: 28px;
  align-items: start;
}

.filters-sidebar {
  position: sticky;
  top: 24px;
}

.filters-card {
  background: #ffffff;
  border: 1px solid #f1e6e1;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(160, 120, 120, 0.08);
}

.search-input {
  width: 100%;
  height: 46px;
  border: 1px solid #ddd2cd;
  border-radius: 12px;
  padding: 0 14px;
  font-size: 14px;
  color: #5a514d;
  outline: none;
  margin-bottom: 22px;
  background: #fff;
}

.search-input::placeholder {
  color: #aaa09a;
}

.filters-card h2 {
  margin: 0;
  font-size: 20px;
  color: #2f2926;
}

.divider {
  width: 100%;
  height: 1px;
  background: #2f2926;
  margin: 14px 0 18px;
}

.filter-group + .filter-group {
  margin-top: 28px;
}

.filter-group h3 {
  margin: 0 0 16px;
  font-size: 16px;
  color: #2f2926;
  line-height: 1.4;
}

.radio-option,
.checkbox-option {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  font-size: 16px;
  color: #3d3835;
  cursor: pointer;
}

.radio-option input[type='radio'] {
  accent-color: #db4d72;
  width: 18px;
  height: 18px;
  margin: 0;
}

.checkbox-option input[type='checkbox'] {
  accent-color: #16a34a;
  width: 18px;
  height: 18px;
  margin: 0;
}

.price-highlight {
  color: #16a34a;
  font-weight: 700;
}

.range-wrap {
  display: flex;
  align-items: center;
  min-height: 32px;
}

.price-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  outline: none;
  cursor: pointer;
}

.price-range::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 999px;
  background: transparent;
}

.price-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #16a34a;
  border: none;
  margin-top: -6px;
  cursor: pointer;
}

.price-range::-moz-range-track {
  height: 6px;
  border-radius: 999px;
  background: transparent;
}

.price-range::-moz-range-progress {
  height: 6px;
  border-radius: 999px;
  background: #16a34a;
}

.price-range::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #16a34a;
  border: none;
  cursor: pointer;
}

.price-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #667085;
}

.reset-filters-btn {
  width: 100%;
  margin-top: 10px;
  border: 1px solid #ead7d1;
  border-radius: 12px;
  padding: 12px 14px;
  background: #fff7f5;
  color: #6b5f5b;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.reset-filters-btn:hover {
  background: #fdf0ec;
}

.products-content {
  min-width: 0;
}

.results-bar {
  margin-bottom: 18px;
}

.results-bar p {
  margin: 0;
  color: #7a716b;
  font-weight: 600;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}

.product-card {
  background: #ffffff;
  border: 1px solid #f1e6e1;
  border-radius: 20px;
  overflow: hidden;
  transition: 0.2s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(160, 120, 120, 0.1);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.product-image-wrap {
  aspect-ratio: 1 / 1;
  background: #fdf1f4;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.card-body {
  padding: 16px;
}

.card-body h3 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #5a514d;
  min-height: 48px;
  line-height: 1.35;
}

.meta-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.meta-list span {
  padding: 4px 8px;
  border-radius: 999px;
  background: #f8efec;
  color: #8a6b66;
  font-size: 12px;
  font-weight: 600;
}

.promo-badge {
  display: inline-block;
  margin-bottom: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #ffe3eb;
  color: #b85c77;
  font-size: 12px;
  font-weight: 700;
}

.price-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.old-price {
  margin: 0;
  color: #a79a95;
  text-decoration: line-through;
  font-size: 14px;
}

.price {
  margin: 0;
  color: #c48797;
  font-weight: 700;
  font-size: 18px;
}

.card-actions {
  padding: 0 16px 16px;
  margin-top: auto;
}

.add-to-cart-btn {
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 12px 14px;
  background: #d6436e;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.add-to-cart-btn:hover {
  background: #bf3a61;
}

.color-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.color-option {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
  padding: 0;
  background: transparent;
}

.color-option:hover {
  transform: scale(1.08);
}

.color-option.active {
  border-color: #111;
}

.color-swatch {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid #ddd;
}

.color-option.reset {
  background: #f3f4f6;
  font-size: 16px;
  font-weight: bold;
}

@media (max-width: 1100px) {
  .products-layout {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: static;
  }

  .products-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
