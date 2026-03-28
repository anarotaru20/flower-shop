<template>
  <section class="pagina-detaliu-produs">
    <div class="container">
      <div v-if="productLoading" class="stare">Se încarcă produsul...</div>
      <div v-else-if="productsStore.error" class="stare eroare">
        {{ productsStore.error }}
      </div>

      <div v-else-if="!productsStore.product" class="stare">Produsul nu a fost găsit.</div>

      <div v-else class="detaliu-produs">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <RouterLink to="/" class="breadcrumb-link">Acasă</RouterLink>
          <span class="breadcrumb-separator">></span>

          <RouterLink :to="breadcrumbCategoryLink" class="breadcrumb-link">
            {{ categoryDisplayName }}
          </RouterLink>

          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">{{ promoProduct.name }}</span>
        </nav>

        <div class="continut-produs">
          <div class="zona-imagine">
            <div v-if="promoProduct.hasPromo" class="badge-promo">
              {{ promoProduct.promoLabel }}
            </div>

            <div class="card-imagine" @mousemove="handleImageMove" @mouseleave="resetImageMove">
              <img
                v-if="productImage"
                :src="getOptimizedImage(productImage, 900)"
                :alt="promoProduct.name"
                class="imagine-produs"
                :style="imageStyle"
                loading="eager"
                decoding="async"
                @load="imageLoaded = true"
              />

              <div v-else class="placeholder-imagine">🌸</div>
            </div>
          </div>

          <div class="zona-info">
            <p class="categorie">{{ categoryDisplayName }}</p>

            <h1 class="titlu-produs">{{ promoProduct.name }}</h1>

            <div class="review-box">
              <div class="review-stars" :aria-label="`Rating ${reviewData.rating} din 5`">
                <span
                  v-for="star in 5"
                  :key="star"
                  :class="['star', { active: star <= reviewData.fullStars }]"
                >
                  ★
                </span>
              </div>
              <span class="review-rating">{{ reviewData.rating }}</span>
              <span class="review-count">({{ reviewData.count }} review-uri)</span>
            </div>

            <div class="pret-box">
              <p v-if="promoProduct.hasPromo" class="pret-vechi">
                {{ formatPrice(promoProduct.oldPrice) }}
              </p>
              <p class="pret-final">{{ formatPrice(promoProduct.finalPrice) }}</p>
            </div>

            <div class="info-linie">
              <span class="info-label">Disponibilitate</span>
              <span :class="['info-stock', promoProduct.stock > 0 ? 'in-stock' : 'out-of-stock']">
                {{ promoProduct.stock > 0 ? `${promoProduct.stock} în stoc` : 'Indisponibil' }}
              </span>
            </div>

            <div class="cantitate-box">
              <div class="cantitate-control">
                <button
                  type="button"
                  class="cantitate-btn"
                  :disabled="quantity <= 1"
                  @click="decreaseQuantity"
                >
                  −
                </button>

                <span class="cantitate-valoare">{{ quantity }}</span>

                <button
                  type="button"
                  class="cantitate-btn"
                  :disabled="promoProduct.stock <= 0 || quantity >= promoProduct.stock"
                  @click="increaseQuantity"
                >
                  +
                </button>
              </div>
            </div>

            <div class="descriere-card">
              <button
                type="button"
                class="accordion-trigger"
                @click="descriptionOpen = !descriptionOpen"
              >
                <span>Descriere</span>
                <span class="accordion-icon" :class="{ open: descriptionOpen }">⌄</span>
              </button>

              <transition name="accordion">
                <div v-if="descriptionOpen" class="accordion-content">
                  <p class="descriere">
                    {{ promoProduct.description || 'Fără descriere disponibilă.' }}
                  </p>
                </div>
              </transition>
            </div>

            <div class="descriere-card">
              <button type="button" class="accordion-trigger" @click="careOpen = !careOpen">
                <span>Ghid de îngrijire</span>
                <span class="accordion-icon" :class="{ open: careOpen }">⌄</span>
              </button>

              <transition name="accordion">
                <div v-if="careOpen" class="accordion-content">
                  <p class="descriere">
                    {{
                      promoProduct.care_instructions ||
                      productsStore.product?.care_instructions ||
                      'Nu există încă instrucțiuni de îngrijire pentru acest produs.'
                    }}
                  </p>
                </div>
              </transition>
            </div>

            <div class="actiuni">
              <RouterLink to="/products" class="buton-secundar">← Înapoi la shop </RouterLink>

              <button
                class="buton-principal"
                :disabled="promoProduct.stock <= 0"
                @click="addSelectedQuantityToCart"
              >
                Adaugă în coș
              </button>
            </div>
          </div>
        </div>

        <section v-if="relatedProducts.length" class="sectiune-recomandari">
          <div class="sectiune-header">
            <div>
              <p class="sectiune-eyebrow">Recomandări</p>
              <h2>S-ar putea să îți placă și</h2>
            </div>

            <div class="carousel-actions">
              <button type="button" class="carousel-btn" @click="scrollRelated('left')">←</button>
              <button type="button" class="carousel-btn" @click="scrollRelated('right')">→</button>
            </div>
          </div>

          <div ref="relatedTrack" class="related-track">
            <article
              v-for="item in relatedProducts"
              :key="item.id"
              class="related-card"
              @click="goToProduct(item.slug)"
            >
              <div class="related-image-wrap">
                <img
                  v-if="item.image_url"
                  :src="getOptimizedImage(item.image_url, 420)"
                  :alt="item.name"
                  class="related-image"
                  loading="lazy"
                  decoding="async"
                />
                <div v-else class="related-placeholder">🌸</div>
              </div>

              <div class="related-content">
                <p class="related-category">
                  {{ item.categories?.name || categoryDisplayName }}
                </p>

                <h3 class="related-title">{{ item.name }}</h3>

                <div class="related-reviews">
                  <span class="related-stars">
                    <span
                      v-for="star in 5"
                      :key="`${item.id}-${star}`"
                      :class="['star', { active: star <= getRelatedReview(item).fullStars }]"
                    >
                      ★
                    </span>
                  </span>
                  <span class="related-rating">{{ getRelatedReview(item).rating }}</span>
                </div>

                <p class="related-price">
                  {{ formatPrice(getRelatedPrice(item).finalPrice) }}
                </p>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { getProductPromoData } from '@/utils/promotions'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const relatedTrack = ref(null)
const quantity = ref(1)
const descriptionOpen = ref(false)
const careOpen = ref(false)
const imageOffsetX = ref(0)
const imageOffsetY = ref(0)
const imageScale = ref(1)
const productLoading = ref(true)
const imageLoaded = ref(false)

const userBirthDate = computed(() => authStore.user?.birth_date || null)
function getOptimizedImage(url, width = 900) {
  if (!url) return ''

  if (url.includes('unsplash.com')) {
    return `${url}${url.includes('?') ? '&' : '?'}auto=format&fit=crop&w=${width}&q=75`
  }

  return url
}

const promoProduct = computed(() => {
  if (!productsStore.product) return null
  return getProductPromoData(productsStore.product, userBirthDate.value)
})

const productImage = computed(() => {
  return promoProduct.value?.image_url || productsStore.product?.image_url || ''
})

const categoryDisplayName = computed(() => {
  return (
    productsStore.product?.categories?.name ||
    promoProduct.value?.categories?.name ||
    promoProduct.value?.category_name ||
    'Categorie'
  )
})

const currentCategoryId = computed(() => {
  return productsStore.product?.category_id || promoProduct.value?.category_id || null
})

const breadcrumbCategoryLink = computed(() => {
  const slug =
    productsStore.product?.categories?.slug ||
    promoProduct.value?.categories?.slug ||
    promoProduct.value?.category_slug

  return slug ? `/products?category=${slug}` : '/products'
})

const imageStyle = computed(() => {
  return {
    transform: `translate(${imageOffsetX.value}px, ${imageOffsetY.value}px) scale(${imageScale.value})`,
  }
})

function getSeed(value) {
  const text = String(value || 'produs')
  let hash = 0

  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i)
    hash |= 0
  }

  return Math.abs(hash)
}

const reviewData = computed(() => {
  const source =
    productsStore.product?.id || productsStore.product?.slug || promoProduct.value?.name || 'produs'

  const seed = getSeed(source)
  const rating = (4 + (seed % 10) / 10).toFixed(1)
  const count = 12 + (seed % 189)

  return {
    rating,
    count,
    fullStars: Math.round(Number(rating)),
  }
})

const relatedProducts = computed(() => {
  const allProducts = Array.isArray(productsStore.products) ? productsStore.products : []
  const currentId = productsStore.product?.id

  return allProducts
    .filter((item) => item?.id !== currentId)
    .filter((item) => {
      const itemCategoryId = item?.category_id || item?.categories?.id || null
      return currentCategoryId.value ? itemCategoryId === currentCategoryId.value : true
    })
    .slice(0, 12)
})

function getRelatedReview(product) {
  const source = product?.id || product?.slug || product?.name || 'produs'
  const seed = getSeed(source)
  const rating = (4 + (seed % 10) / 10).toFixed(1)

  return {
    rating,
    fullStars: Math.round(Number(rating)),
  }
}

function getRelatedPrice(product) {
  return getProductPromoData(product, userBirthDate.value)
}

function formatPrice(value) {
  const number = Number(value || 0)
  return `${number.toFixed(2)} lei`
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

function increaseQuantity() {
  if (promoProduct.value?.stock > 0 && quantity.value < promoProduct.value.stock) {
    quantity.value++
  }
}

function addSelectedQuantityToCart() {
  if (!promoProduct.value || promoProduct.value.stock <= 0) return

  for (let i = 0; i < quantity.value; i++) {
    cartStore.addToCart(promoProduct.value)
  }
}

function resetQuantity() {
  quantity.value = 1
}

function handleImageMove(event) {
  const element = event.currentTarget
  const rect = element.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height
  const moveX = (x - 0.5) * -40
  const moveY = (y - 0.5) * -40

  imageOffsetX.value = moveX
  imageOffsetY.value = moveY
  imageScale.value = 1.35
}
function resetImageMove() {
  imageOffsetX.value = 0
  imageOffsetY.value = 0
  imageScale.value = 1
}

function scrollRelated(direction) {
  if (!relatedTrack.value) return

  const amount = 320

  relatedTrack.value.scrollBy({
    left: direction === 'right' ? amount : -amount,
    behavior: 'smooth',
  })
}

async function fetchRelatedProducts() {
  if (typeof productsStore.fetchProducts === 'function') {
    await productsStore.fetchProducts()
  }
}

function goToProduct(slug) {
  if (!slug) return
  router.push(`/products/${slug}`)
}

onMounted(async () => {
  productLoading.value = true
  await productsStore.fetchProductBySlug(route.params.slug)
  productLoading.value = false
  fetchRelatedProducts()
  await nextTick()
})

watch(
  () => route.params.slug,
  async (newSlug) => {
    if (newSlug) {
      resetQuantity()
      resetImageMove()
      productLoading.value = true
      await productsStore.fetchProductBySlug(newSlug)
      productLoading.value = false
      fetchRelatedProducts()
    }
  },
)

watch(
  () => promoProduct.value?.stock,
  (stock) => {
    if (!stock || stock < 1) {
      quantity.value = 1
      return
    }

    if (quantity.value > stock) {
      quantity.value = stock
    }
  },
)
</script>

<style scoped>
.pagina-detaliu-produs {
  padding: 32px 0 56px;
  min-height: calc(100vh - 80px);
}

.container {
  width: min(1240px, calc(100% - 32px));
  margin: 0 auto;
}

.stare {
  padding: 56px 20px;
  text-align: center;
  color: #7a716b;
  font-size: 16px;
}

.stare.eroare {
  color: #d9534f;
}

.detaliu-produs {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 14px 18px;
  border: 1px solid #eee2dc;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  font-size: 14px;
}

.breadcrumb-link {
  color: #8f5f6b;
  text-decoration: none;
  font-weight: 600;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  color: #b9aaa3;
}

.breadcrumb-current {
  color: #5a514d;
  font-weight: 700;
}

.continut-produs {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 28px;
  align-items: start;
}
.zona-imagine,
.zona-info {
  min-width: 0;
}

.zona-info {
  border: 3px solid #eddeda !important;
}

.zona-imagine {
  display: block;
}

.card-imagine {
  position: relative;
  overflow: hidden;
  flex: 1;
  aspect-ratio: 4 / 5;
  width: 100%;
  border-radius: 30px;
  border: 2px solid #eddeda;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.4)), #f8eeef;
  box-shadow: 0 18px 50px rgba(94, 72, 78, 0.08);
  cursor: zoom-in;
  width: 100%;
  height: 600px;
  border-radius: 30px;
  overflow: hidden;
}

.imagine-produs {
  width: 100%;
  height: 100%;
  min-height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.16s ease-out;
  will-change: transform;
  transform-origin: center center;
  backface-visibility: hidden;
}
.placeholder-imagine {
  min-height: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 96px;
  color: #b88593;
}

.badge-promo {
  display: inline-flex;
  align-items: center;
  margin-bottom: 14px;
  padding: 8px 14px;
  border-radius: 999px;
  background: #ffe4ec;
  color: #b85c77;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  align-self: flex-start;
}

.zona-info {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid #eee2dc;
  border-radius: 30px;
  padding: 34px;
  box-shadow: 0 18px 50px rgba(94, 72, 78, 0.08);
}

.categorie {
  margin: 0 0 10px;
  color: #b57789;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}

.titlu-produs {
  margin: 0 0 14px;
  color: #4f4743;
  font-size: clamp(28px, 3vw, 42px);
  line-height: 1.15;
}

.review-box {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 22px;
}

.review-stars {
  display: flex;
  gap: 4px;
}

.star {
  color: #ddd1cc;
  font-size: 18px;
  line-height: 1;
}

.star.active {
  color: #f2b94b;
}

.review-rating {
  font-weight: 800;
  color: #5a514d;
}

.review-count {
  color: #8a807a;
  font-size: 14px;
}

.pret-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
}

.pret-vechi {
  margin: 0;
  color: #a89b95;
  text-decoration: line-through;
  font-size: 16px;
}

.pret-final {
  margin: 0;
  font-size: clamp(28px, 3vw, 34px);
  font-weight: 800;
  text-shadow:
    0.3px 0 currentColor,
    -0.3px 0 currentColor;
  color: #b9364e;
  display: flex;
  justify-content: flex-end;
}

.info-linie {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-top: 1px solid #eee5e1;
}

.info-label {
  color: #7a706b;
  font-size: 14px;
  font-weight: 700;
}

.info-stock,
.info-text {
  text-align: right;
  font-size: 14px;
  font-weight: 700;
}

.info-text {
  color: #5a514d;
}

.in-stock {
  color: #3f9a53;
}

.out-of-stock {
  color: #d9534f;
}

.cantitate-box {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 18px 0 8px;
}

.cantitate-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cantitate-btn {
  width: 42px;
  height: 42px;
  border: 1px solid #d8ddd7;
  border-radius: 10px;
  background: #fff;
  color: #b9364e;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cantitate-btn:disabled {
  color: #bdbdbd;
  cursor: not-allowed;
}

.cantitate-valoare {
  min-width: 38px;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #d8ddd7;
  border-radius: 8px;
  background: #fff;
  color: #4f4743;
  font-size: 20px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.descriere-card {
  border-top: 1px solid #eee5e1;
}

.accordion-trigger {
  width: 100%;
  padding: 20px 0;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  color: #4f4743;
  font-size: 18px;
  font-weight: 700;
  text-align: left;
}

.accordion-icon {
  font-size: 20px;
  color: #8f5f6b;
  transition: transform 0.25s ease;
}

.accordion-icon.open {
  transform: rotate(180deg);
}

.accordion-content {
  padding: 0 0 20px;
}

.descriere {
  margin: 0;
  color: #756b66;
  line-height: 1.8;
  font-size: 15px;
}

.actiuni {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.buton-principal,
.buton-secundar {
  min-height: 52px;
  padding: 0 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.buton-principal {
  flex: 1 1 260px;
  border: none;
  background: #b9364e;
  color: white;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(196, 131, 149, 0.25);
}

.buton-principal:hover:not(:disabled),
.buton-secundar:hover {
  transform: translateY(-1px);
}

.buton-principal:disabled {
  background: #d8cdd1;
  cursor: not-allowed;
  box-shadow: none;
}

.buton-secundar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-weight: 700;
  color: #b9364e;
}

.sectiune-recomandari {
  margin-top: 28px;
  padding-top: 12px;
}

.sectiune-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.sectiune-eyebrow {
  margin: 0 0 6px;
  color: #b57789;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.sectiune-header h2 {
  margin: 0;
  color: #4f4743;
  font-size: clamp(24px, 3vw, 34px);
}

.carousel-actions {
  display: flex;
  gap: 10px;
}

.carousel-btn {
  width: 44px;
  height: 44px;
  border: 1px solid #eadad5;
  border-radius: 999px;
  background: #fff;
  color: #b9364e;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(94, 72, 78, 0.06);
}

.related-track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(240px, 280px);
  gap: 18px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  padding-bottom: 12px;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
  will-change: scroll-position;
}

.related-track::-webkit-scrollbar {
  height: 8px;
}

.related-track::-webkit-scrollbar-thumb {
  background: #d8c3ca;
  border-radius: 999px;
}

.related-card {
  border: 1px solid #eee2dc;
  border-radius: 24px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(94, 72, 78, 0.06);
  cursor: pointer;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
  contain: layout paint;
}

.related-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 50px rgba(94, 72, 78, 0.1);
}

.related-image-wrap {
  height: 220px;
  overflow: hidden;
  background: #f8eeef;
}

.related-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.22s ease;
  will-change: transform;
  backface-visibility: hidden;
}

.related-card:hover .related-image {
  transform: scale(1.08);
}

.related-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  color: #b88593;
}

.related-content {
  padding: 16px;
}

.related-category {
  margin: 0 0 6px;
  color: #b57789;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.related-title {
  margin: 0 0 10px;
  color: #4f4743;
  font-size: 18px;
  line-height: 1.35;
}

.related-reviews {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.related-stars {
  display: flex;
  gap: 3px;
}

.related-rating {
  color: #6f6661;
  font-size: 14px;
  font-weight: 700;
}

.related-price {
  margin: 0;
  color: #b9364e;
  font-size: 20px;
  font-weight: 800;
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 300px;
}

@media (max-width: 1100px) {
  .continut-produs {
    grid-template-columns: 1fr;
  }

  .card-imagine {
    min-height: 460px;
    max-height: 460px;
  }

  .imagine-produs,
  .placeholder-imagine {
    min-height: 460px;
  }
}

@media (max-width: 700px) {
  .pagina-detaliu-produs {
    padding: 20px 0 40px;
  }

  .container {
    width: min(100%, calc(100% - 20px));
  }

  .breadcrumb {
    padding: 12px 14px;
    border-radius: 16px;
    font-size: 13px;
  }

  .zona-info {
    padding: 22px 18px;
    border-radius: 24px;
  }

  .card-imagine {
    border-radius: 24px;
    min-height: 320px;
    max-height: 320px;
  }

  .imagine-produs,
  .placeholder-imagine {
    min-height: 320px;
  }

  .placeholder-imagine {
    font-size: 72px;
  }

  .titlu-produs {
    font-size: 28px;
  }

  .pret-final {
    font-size: 28px;
  }

  .info-linie,
  .cantitate-box {
    flex-direction: column;
    align-items: flex-start;
  }

  .info-stock,
  .info-text {
    text-align: left;
  }

  .cantitate-control {
    width: 100%;
    justify-content: flex-start;
  }

  .actiuni {
    flex-direction: column;
  }

  .buton-principal,
  .buton-secundar {
    width: 100%;
    max-height: 60px;
  }

  .sectiune-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .related-track {
    grid-auto-columns: minmax(220px, 82vw);
  }
}
</style>
