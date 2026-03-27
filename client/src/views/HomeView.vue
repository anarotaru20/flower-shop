<template>
  <div class="home">
    <section class="hero-elegant">
      <div class="container hero-elegant-grid">
        <div class="hero-elegant-main">
          <div class="hero-content-wrap">
            <span class="hero-kicker">Estetica Emoției — Est. 2026</span>
            <h1>Flori care spun <br /><span class="italic-serif">ceea ce simți</span></h1>
            <p class="hero-elegant-description">
              Arta florală redefinește momentele tale. Descoperă colecții exclusiviste, create
              pentru a transforma simplele gesturi în amintiri prețioase.
            </p>

            <div class="hero-elegant-actions">
              <RouterLink to="/products" class="btn btn-premium-solid"
                >Explorează Colecția</RouterLink
              >
              <button class="btn btn-premium-outline" @click="quizDialog = true">
                Găsește Buchetul Ideal
              </button>
            </div>
          </div>

          <div class="hero-footer-promos">
            <div class="mini-promo">
              <span class="label">Privilegiu</span>
              <p>Reduceri exclusive sezoniere</p>
            </div>
            <div class="mini-promo">
              <span class="label">Welcome</span>
              <p>25 lei cadou la prima comandă</p>
            </div>
          </div>
        </div>

        <div class="hero-elegant-side">
          <div class="hero-editorial-card">
            <div class="card-inner">
              <span class="editorial-label">Curatoriat</span>
              <h3>Ediție <br />Limitată</h3>
              <p>Inspirate de grădinile aristocrate europene.</p>
            </div>
          </div>

          <button class="hero-quiz-card" @click="quizDialog = true">
            <span class="editorial-label">Personal Shopper</span>
            <h3>Consiliere Florală</h3>
            <p>Răspunde la câteva întrebări pentru o recomandare adaptată stilului tău.</p>
            <span class="hero-quiz-link">Începe experiența —</span>
          </button>
        </div>
      </div>

      <div class="container">
        <div class="hero-info-strip">
          <div class="hero-info-item">
            <span class="info-num">01</span>
            <div class="info-text">
              <strong>Design de Autor</strong>
              <span>Piese unice de artă florală</span>
            </div>
          </div>
          <div class="hero-info-item">
            <span class="info-num">02</span>
            <div class="info-text">
              <strong>Livrare Premium</strong>
              <span>Ambalaj de lux și transport dedicat</span>
            </div>
          </div>
          <div class="hero-info-item">
            <span class="info-num">03</span>
            <div class="info-text">
              <strong>Prospețime</strong>
              <span>Selectate manual în fiecare dimineață</span>
            </div>
          </div>
        </div>
      </div>
    </section>

<v-dialog v-model="quizResultsDialog" max-width="980">
  <v-card class="quiz-results-dialog" elevation="0">
    <v-card-title class="quiz-results-title">
      Recomandări personalizate
    </v-card-title>

    <v-card-text class="quiz-results-body">
      <p class="quiz-results-subtitle">
        Am ales câteva produse pe baza răspunsurilor tale.
      </p>

      <div v-if="quizResults.length" class="quiz-results-grid">
        <article
          v-for="product in quizResults"
          :key="product.id"
          class="quiz-result-card"
          @click="goToProduct(product.slug)"
        >
          <img :src="product.image_url" :alt="product.name" class="quiz-result-image" />

          <div class="quiz-result-content">
            <h3>{{ product.name }}</h3>
            <p class="quiz-result-price">{{ formatPrice(product.price) }}</p>
            <button type="button" class="btn-text-link">
              Vezi produsul —
            </button>
          </div>
        </article>
      </div>

      <div v-else class="quiz-empty">
        Nu am găsit recomandări potrivite momentan.
      </div>
    </v-card-text>

    <v-card-actions class="quiz-results-actions">
      <v-spacer />
      <v-btn variant="text" @click="quizResultsDialog = false">
        Închide
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

    <section class="products-showcase">
      <div class="container">
        <div class="section-head section-head-row">
          <div>
            <span class="section-label">Signature Collection</span>
            <h2>Cele mai iubite creații</h2>
          </div>
          <div class="showcase-actions">
            <RouterLink to="/products" class="section-link">Vezi tot catalogul —</RouterLink>
          </div>
        </div>

        <div class="products-carousel-wrap">
          <button class="carousel-floating left" type="button" @click="scrollCarousel('left')">
            ‹
          </button>

          <div ref="carouselTrack" class="products-carousel">
            <article v-for="product in featuredProducts" :key="product.id" class="product-card">
              <RouterLink :to="`/products/${product.slug}`" class="product-image-wrap">
                <img :src="product.image_url" :alt="product.name" class="product-image" />
              </RouterLink>

              <div class="product-card-content">
                <p class="product-category">{{ product.categories?.name || 'Bloomera' }}</p>
                <RouterLink :to="`/products/${product.slug}`" class="product-title">
                  {{ product.name }}
                </RouterLink>
                <p class="product-price">{{ formatPrice(product.price) }}</p>
              </div>
            </article>
          </div>

          <button class="carousel-floating right" type="button" @click="scrollCarousel('right')">
            ›
          </button>
        </div>
      </div>
    </section>

    <section class="benefits">
      <div class="container">
        <div class="benefit-grid">
          <div class="benefit-item">
            <div class="icon-wrap">🌷</div>
            <h3>Design Modern</h3>
            <p>Stil delicat, romantic și actual, creat să impresioneze fără a fi ostentativ.</p>
          </div>
          <div class="benefit-item">
            <div class="icon-wrap">💌</div>
            <h3>Cadoul Perfect</h3>
            <p>Experiență de achiziție simplificată pentru cadouri care transmit emoție pură.</p>
          </div>
          <div class="benefit-item">
            <div class="icon-wrap">✨</div>
            <h3>Atmosferă Premium</h3>
            <p>Un univers digital construit pentru inspirație, eleganță și rafinament feminin.</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="home-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <h3 class="footer-logo">
            <span class="brand-pink">bloom</span><span class="brand-green">era</span>
          </h3>
          <p class="description">
            Flori, buchete și aranjamente create cu grijă pentru momente speciale, surprize delicate
            și gesturi care rămân în suflet.
          </p>
        </div>

        <div class="footer-column">
          <h4>Informații utile</h4>
          <RouterLink to="/products">Produse</RouterLink>
          <RouterLink to="/register">Creează cont</RouterLink>
          <RouterLink to="/login">Login</RouterLink>
        </div>

        <div class="footer-column">
          <h4>Contact & program</h4>
          <span>📞 0712 345 678</span>
          <span>✉️ contact@bloomera.ro</span>
          <span>📍 București, România</span>
          <div class="footer-program">
            <strong>Program Suport:</strong>
            <span>Luni - Vineri: 09:00 - 18:00</span>
          </div>
        </div>

        <div class="footer-column">
          <h4>Legal</h4>
          <a href="https://anpc.ro/" target="_blank">A.N.P.C.</a>
          <a href="https://www.anaf.ro/..." target="_blank">A.N.A.F.</a>
        </div>
      </div>
    </footer>

    <HomeQuizDialog v-model="quizDialog" @complete="handleQuizComplete" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import HomeQuizDialog from '@/components/home/HomeQuizDialog.vue'
import { useProductsStore } from '@/stores/products'

const router = useRouter()
const productsStore = useProductsStore()
const quizDialog = ref(false)
const quizResultsDialog = ref(false)
const quizResults = ref([])
const carouselTrack = ref(null)

const featuredProducts = computed(() => {
  return [...(productsStore.products || [])]
    .filter((product) => Number(product.stock || 0) > 0)
    .slice(0, 10)
})

function formatPrice(value) {
  return `${Number(value || 0).toFixed(2)} Lei`
}

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

function includesAny(text, values = []) {
  const normalizedText = normalizeText(text)
  return values.some((value) => normalizedText.includes(normalizeText(value)))
}

function scoreQuizProduct(product, result) {
  let score = 0

  const name = normalizeText(product.name)
  const description = normalizeText(product.description)
  const color = normalizeText(product.color)
  const style = normalizeText(product.style)
  const type = normalizeText(product.type)
  const categoryName = normalizeText(product.categories?.name)
  const categorySlug = normalizeText(product.categories?.slug)
  const searchableText = `${name} ${description} ${color} ${style} ${type} ${categoryName} ${categorySlug}`

  const productPrice = Number(product.price || 0)
  const budgetMin = Number(result.budget_min || 0)
  const budgetMax = Number(result.budget_max || 0)

  if (Number(product.stock || 0) > 0) {
    score += 25
  } else {
    score -= 1000
  }

  if (productPrice >= budgetMin && productPrice <= budgetMax) {
    score += 35
  } else if (productPrice >= budgetMin - 20 && productPrice <= budgetMax + 20) {
    score += 15
  }

  if (result.preferred_colors?.length) {
    if (includesAny(color, result.preferred_colors)) score += 35
    else if (includesAny(searchableText, result.preferred_colors)) score += 20
  }

  if (result.preferred_style) {
    if (style === normalizeText(result.preferred_style)) score += 30
    else if (searchableText.includes(normalizeText(result.preferred_style))) score += 15
  }

  if (result.preferred_product_type) {
    const preferredType = normalizeText(result.preferred_product_type)

    if (type === preferredType) score += 40
    else if (searchableText.includes(preferredType)) score += 20

    if (preferredType === 'flower box' && searchableText.includes('box')) score += 20
    if (preferredType === 'cadou floral' && searchableText.includes('cadou')) score += 20
    if (
      preferredType === 'planta' &&
      (categorySlug.includes('plante') || categoryName.includes('plante'))
    )
      score += 20
    if (
      preferredType === 'buchet' &&
      (categorySlug.includes('buchete') || categoryName.includes('buchete'))
    )
      score += 20
  }

  return score
}

function handleQuizComplete(result) {
  const products = productsStore.products || []

  quizResults.value = products
    .map((product) => ({ ...product, score: scoreQuizProduct(product, result) }))
    .filter((product) => product.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)

  quizResultsDialog.value = true
}

function goToProduct(slug) {
  quizResultsDialog.value = false
  router.push(`/products/${slug}`)
}

function scrollCarousel(direction) {
  if (!carouselTrack.value) return

  const container = carouselTrack.value
  const scrollAmount = container.clientWidth * 0.85

  container.scrollBy({
    left: direction === 'right' ? scrollAmount : -scrollAmount,
    behavior: 'smooth',
  })
}

onMounted(async () => {
  if (!productsStore.products?.length) await productsStore.fetchProducts()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;600&display=swap');

/* CONFIGURAȚIE GENERALĂ */
.home {
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
  background: #fff;
}

h1,
h2,
h3,
.product-title,
.footer-logo {
  font-family: 'Playfair Display', serif;
  font-weight: 400;
}

.container {
  width: min(1400px, calc(100% - 60px));
  margin: 0 auto;
}

/* BUTOANE PREMIUM */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  padding: 0 40px;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 2px;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  border-radius: 0;
  cursor: pointer;
}

.btn-premium-solid {
  background: #1a1715;
  color: white;
  border: 1px solid #1a1715;
}

.btn-premium-solid:hover {
  background: #c72c48; /* Noul roz la hover */
  border-color: #c72c48;
  transform: translateY(-2px);
}

.btn-premium-outline {
  background: transparent;
  color: #1a1715;
  border: 1px solid #1a1715;
}

.btn-premium-outline:hover {
  color: #c72c48;
  border-color: #c72c48;
}

/* HERO SECTION */
.hero-elegant {
  padding: 30px 0 60px;
}
.hero-elegant-grid {
  display: grid;
  grid-template-columns: 1.4fr 0.6fr;
  gap: 20px;
  margin-bottom: 20px;
}

.hero-elegant-main {
  background: #f4ebe8;
  padding: 120px 80px 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 650px;
  border: 1px solid #eee;
}

.hero-kicker {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: #c72c48; /* Contrast ridicat */
  margin-bottom: 25px;
  display: block;
}

.hero-elegant-main h1 {
  font-size: clamp(54px, 7vw, 92px);
  line-height: 0.95;
  margin: 0 0 30px;
}

.italic-serif {
  font-style: italic;
  color: #c72c48; /* Accent roz */
}

.hero-elegant-description {
  font-size: 19px;
  line-height: 1.7;
  color: #444;
  max-width: 480px;
  font-weight: 300;
}

.hero-elegant-actions {
  display: flex;
  gap: 20px;
  margin-top: 40px;
}

.hero-footer-promos {
  display: flex;
  gap: 40px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 40px;
}

.mini-promo .label {
  font-size: 10px;
  text-transform: uppercase;
  color: #c72c48;
  letter-spacing: 1px;
}
.mini-promo p {
  font-size: 14px;
  margin: 5px 0 0;
  font-weight: 500;
}

/* SIDE CARDS */
.hero-elegant-side {
  display: grid;
  gap: 20px;
}
.hero-editorial-card {
  background: #1a1715;
  color: white;
  padding: 50px;
  display: flex;
  align-items: center;
}
.hero-editorial-card h3 {
  font-size: 36px;
  line-height: 1.1;
  margin: 20px 0;
}
.hero-editorial-card p {
  opacity: 0.7;
  font-weight: 300;
}

.hero-quiz-card {
  background: #fff;
  border: 1px solid #eee;
  padding: 50px;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.3s;
}
.hero-quiz-card:hover {
  border-color: #c72c48;
}

.hero-quiz-link {
  display: block;
  margin-top: 30px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #c72c48;
}

/* INFO STRIP */
.hero-info-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 50px 0;
  border-bottom: 1px solid #eee;
}
.hero-info-item {
  display: flex;
  align-items: center;
  padding: 0 40px;
}
.hero-info-item:not(:last-child) {
  border-right: 1px solid #eee;
}
.info-num {
  font-family: 'Playfair Display', serif;
  font-size: 42px;
  color: #e5d6d9;
  margin-right: 30px;
}

/* CARUSEL PRODUSE - PERFORMANȚĂ MAXIMĂ */
.products-showcase {
  padding: 100px 0;
  background: #fff;
  position: relative;
}
.section-head-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 50px;
}
.section-label {
  font-size: 12px;
  letter-spacing: 3px;
  color: #c72c48;
  text-transform: uppercase;
  margin-bottom: 15px;
  display: block;
}
.section-head h2 {
  font-size: 48px;
  margin: 0;
}
.section-link {
  text-decoration: none;
  color: #1a1715;
  font-weight: 600;
  border-bottom: 1px solid #1a1715;
  padding-bottom: 5px;
  transition:
    color 0.3s,
    border-color 0.3s;
}
.section-link:hover {
  color: #c72c48;
  border-color: #c72c48;
}

.products-carousel-wrap {
  position: relative;
}

.products-carousel {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc((100% - 75px) / 4);
  gap: 25px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  padding-bottom: 20px;
  scrollbar-width: none;
  will-change: scroll-position; /* Optimizare scroll */
  -webkit-overflow-scrolling: touch;
}
.products-carousel::-webkit-scrollbar {
  display: none;
}

.product-card {
  scroll-snap-align: start;
  transition: transform 0.4s;
  will-change: transform;
  transform: translateZ(0); /* Forțează GPU */
}
.product-image-wrap {
  display: block;
  aspect-ratio: 1 / 1.35;
  background: #f9f9f9;
  overflow: hidden;
  position: relative;
}
.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.2s cubic-bezier(0.19, 1, 0.22, 1);
}
.product-card:hover .product-image {
  transform: scale(1.08);
}

.product-card-content {
  padding: 25px 0;
}
.product-category {
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 10px;
}
.product-title {
  font-size: 22px;
  text-decoration: none;
  color: #1a1715;
  margin-bottom: 10px;
  display: block;
  transition: color 0.3s;
}
.product-title:hover {
  color: #c72c48;
}
.product-price {
  font-size: 17px;
  font-weight: 300;
  color: #1a1715;
}

/* BUTOANE CARUSEL */
.carousel-floating {
  position: absolute;
  top: 40%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  background: white;
  border: 1px solid #eee;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}
.carousel-floating:hover {
  background: #c72c48;
  color: white;
  border-color: #c72c48;
}
.carousel-floating.left {
  left: -28px;
}
.carousel-floating.right {
  right: -28px;
}

/* BENEFITS */
.benefit-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 60px;
  padding: 100px 0;
  border-top: 1px solid #eee;
}
.benefit-item {
  text-align: center;
}
.icon-wrap {
  font-size: 32px;
  margin-bottom: 25px;
}
.benefit-item h3 {
  font-size: 24px;
  margin-bottom: 15px;
}
.benefit-item p {
  color: #666;
  line-height: 1.7;
  font-weight: 300;
}

/* FOOTER */
.home-footer {
  background: #0f0e0d;
  /* background: linear-gradient(135deg, #fffaf7 0%, #fdf3ee 40%, #fffaf7 100%); */
  color: #fff;
  padding: 100px 0 60px;
  margin-top: 40px;
}
.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 80px;
}
.footer-logo {
  font-size: 38px;
  margin-bottom: 30px;
  letter-spacing: -1px;
}
.brand-pink {
  color: #c72c48;
} /* Noul roz vibrant */
.brand-green {
  color: #a4b494;
}
.footer-brand p {
  color: #888;
  font-size: 15px;
  line-height: 1.8;
}
.footer-column h4 {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #c72c48;
  margin-bottom: 35px;
}
.footer-column a,
.footer-column span {
  display: block;
  color: #aaa;
  text-decoration: none;
  margin-bottom: 15px;
  font-size: 14px;
  transition: color 0.3s;
}
.footer-column a:hover {
  color: #fff;
}
.quiz-results-dialog {
  border-radius: 28px;
  overflow: hidden;
}

.quiz-results-title {
  font-size: 28px;
  font-family: 'Playfair Display', serif;
  padding: 24px 24px 8px;
  color: #1a1715;
}

.quiz-results-body {
  padding-top: 0;
}

.quiz-results-subtitle {
  color: #6b7280;
  margin-bottom: 22px;
  line-height: 1.6;
}

.quiz-results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.quiz-result-card {
  border: 1px solid #eee;
  background: #fff;
  cursor: pointer;
  transition: 0.25s ease;
}

.quiz-result-card:hover {
  transform: translateY(-4px);
  border-color: #c72c48;
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.08);
}

.quiz-result-image {
  width: 100%;
  aspect-ratio: 1 / 1.15;
  object-fit: cover;
  display: block;
}

.quiz-result-content {
  padding: 16px;
}

.quiz-result-content h3 {
  font-size: 22px;
  margin: 0 0 10px;
  color: #1a1715;
}

.quiz-result-price {
  font-size: 16px;
  color: #1a1715;
  margin-bottom: 12px;
}

.btn-text-link {
  border: 0;
  background: transparent;
  padding: 0;
  color: #c72c48;
  font-weight: 600;
  cursor: pointer;
}

.quiz-results-actions {
  padding: 0 20px 20px;
}

.quiz-empty {
  padding: 20px 0 8px;
  color: #6b7280;
}

@media (max-width: 900px) {
  .quiz-results-grid {
    grid-template-columns: 1fr;
  }
}
/* RESPONSIVE */
@media (max-width: 1200px) {
  .products-carousel {
    grid-auto-columns: calc((100% - 50px) / 3);
  }
}
@media (max-width: 900px) {
  .hero-elegant-grid,
  .footer-grid,
  .hero-info-strip,
  .benefit-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .products-carousel {
    grid-auto-columns: 85%;
  }
  .carousel-floating {
    display: none;
  }
  .hero-elegant-main {
    padding: 60px 30px;
    min-height: auto;
  }
}
</style>
