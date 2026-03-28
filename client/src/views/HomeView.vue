<template>
  <div class="home">
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-main">
          <span class="hero-kicker">Bloomera Collection — Est. 2026</span>

          <h1 class="hero-title">
            Flori care transformă
            <span class="hero-title-accent">gesturile simple în amintiri</span>
          </h1>

          <p class="hero-description">
            Descoperă buchete, plante și aranjamente create cu grijă pentru zile speciale, surprize
            delicate și momente care merită păstrate.
          </p>

          <div class="hero-actions">
            <RouterLink to="/products" class="btn btn-solid">Explorează colecția</RouterLink>
            <button class="btn btn-outline" @click="quizDialog = true">Fă testul floral</button>
          </div>

          <div class="hero-benefits">
            <div class="hero-benefit">
              <strong>Livrare premium</strong>
              <span>Ambalare atentă și prezentare elegantă</span>
            </div>
            <div class="hero-benefit">
              <strong>Cadouri memorabile</strong>
              <span>Produse alese pentru emoție, nu doar pentru aspect</span>
            </div>
            <div class="hero-benefit">
              <strong>Selecție fresh</strong>
              <span>Produse în stoc, pregătite pentru comenzi rapide</span>
            </div>
          </div>
        </div>

        <div class="hero-side">
          <article class="hero-editorial-card">
            <span class="editorial-badge">Colecție nouă</span>
            <h2>Eleganță florală pentru fiecare ocazie</h2>
            <p>De la buchete romantice la plante decorative și aranjamente cu aer sofisticat.</p>
            <RouterLink to="/products" class="editorial-link">Vezi selecția —</RouterLink>
          </article>

          <button class="hero-quiz-card" @click="quizDialog = true">
            <span class="editorial-badge">Personalizare</span>
            <h3>Nu știi ce să alegi?</h3>
            <p>Răspunde la câteva întrebări și primești recomandări potrivite stilului tău.</p>
            <span class="hero-quiz-link">Începe testul —</span>
          </button>
        </div>
      </div>
    </section>

    <section class="feature-strip">
      <div class="container feature-strip-grid">
        <div class="feature-strip-item">
          <span class="feature-icon">💐</span>
          <div>
            <strong>Buchete atent curate</strong>
            <p>Design floral modern și feminin</p>
          </div>
        </div>

        <div class="feature-strip-item">
          <span class="feature-icon">🚚</span>
          <div>
            <strong>Livrare rapidă</strong>
            <p>Experiență simplă, de la alegere la comandă</p>
          </div>
        </div>

        <div class="feature-strip-item">
          <span class="feature-icon">🎁</span>
          <div>
            <strong>Perfect pentru cadou</strong>
            <p>Gesturi care arată bine și se simt bine</p>
          </div>
        </div>

        <div class="feature-strip-item">
          <span class="feature-icon">✨</span>
          <div>
            <strong>Aspect premium</strong>
            <p>Un shop floral elegant și ușor de parcurs</p>
          </div>
        </div>
      </div>
    </section>

    <section v-if="categoryHighlights.length" class="categories-section">
      <div class="container">
        <div class="section-head section-head-row">
          <div>
            <span class="section-label">Shop by category</span>
            <h2>Alege după ceea ce cauți</h2>
          </div>

          <RouterLink to="/products" class="section-link">Vezi toate produsele —</RouterLink>
        </div>

        <div class="categories-grid">
          <RouterLink
            v-for="category in categoryHighlights"
            :key="category.slug"
            :to="`/products?category=${category.slug}`"
            class="category-card"
          >
            <div class="category-image-wrap">
              <img
                v-if="category.image"
                :src="getOptimizedImage(category.image, 700)"
                :alt="category.name"
                class="category-image"
                loading="lazy"
                decoding="async"
              />
              <div v-else class="category-placeholder">🌸</div>
            </div>

            <div class="category-overlay">
              <p class="category-count">{{ category.count }} produse</p>
              <h3>{{ category.name }}</h3>
              <span class="category-link-text">Descoperă categoria —</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="products-showcase">
      <div class="container">
        <div class="section-head section-head-row">
          <div>
            <span class="section-label">Best sellers</span>
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
                <img
                  :src="getOptimizedImage(product.image_url, 520)"
                  :alt="product.name"
                  class="product-image"
                  loading="lazy"
                  decoding="async"
                />
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

    <section class="quiz-cta">
      <div class="container">
        <div class="quiz-cta-card">
          <div class="quiz-cta-content">
            <span class="section-label">Quiz Bloomera</span>
            <h2>Găsește recomandarea potrivită în câteva răspunsuri</h2>
            <p>
              Dacă nu ești sigură ce produs se potrivește momentului, stilului sau bugetului tău,
              testul floral te ajută să alegi mai repede.
            </p>
          </div>

          <div class="quiz-cta-actions">
            <button class="btn btn-solid" @click="quizDialog = true">Începe testul</button>
            <RouterLink to="/products" class="btn btn-outline">Vezi produsele</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="benefits">
      <div class="container">
        <div class="section-head benefits-head">
          <div>
            <span class="section-label">De ce Bloomera</span>
            <h2>Un shop floral gândit să fie simplu, elegant și memorabil</h2>
          </div>
        </div>

        <div class="benefit-grid">
          <div class="benefit-item">
            <div class="icon-wrap">🌷</div>
            <h3>Design modern</h3>
            <p>Stil delicat, romantic și actual, creat să impresioneze fără să fie încărcat.</p>
          </div>

          <div class="benefit-item">
            <div class="icon-wrap">💌</div>
            <h3>Cadoul perfect</h3>
            <p>Experiență de cumpărare clară pentru gesturi care transmit emoție reală.</p>
          </div>

          <div class="benefit-item">
            <div class="icon-wrap">✨</div>
            <h3>Atmosferă premium</h3>
            <p>Un univers digital construit pentru inspirație, rafinament și alegeri rapide.</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="home-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <h3 class="footer-logo">
            <span class="brand-pink">bloom</span>
            <span class="brand-green">era</span>
          </h3>
          <p class="description">
            Flori, buchete și aranjamente create cu grijă pentru momente speciale, surprize delicate
            și gesturi care rămân în suflet.
          </p>
        </div>

        <div class="footer-column">
          <h4>Informații utile</h4>
          <button type="button" class="footer-link-btn" @click="aboutDialog = true">
            Despre noi
          </button>
          <button type="button" class="footer-link-btn" @click="contactDialog = true">
            Contact & Suport
          </button>
          <button type="button" class="footer-link-btn" @click="termsDialog = true">
            Termeni & Condiții
          </button>
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
          <a href="https://anpc.ro/" target="_blank" rel="noopener noreferrer">A.N.P.C.</a>
          <a href="https://www.anaf.ro/" target="_blank" rel="noopener noreferrer">A.N.A.F.</a>
        </div>
      </div>
    </footer>

    <v-dialog v-model="aboutDialog" max-width="920">
      <v-card class="info-dialog" elevation="0">
        <div class="info-dialog-header">
          <div>
            <p class="info-dialog-kicker">Bloomera</p>
            <h2>Povestea noastră</h2>
          </div>

          <button type="button" class="dialog-close-btn" @click="aboutDialog = false">
            <v-icon size="20">mdi-close</v-icon>
          </button>
        </div>

        <div class="info-dialog-body story-dialog-body">
          <div class="story-block">
            <p>
              Bloomera a apărut dintr-o idee simplă: florile nu sunt doar un cadou frumos, ci o
              formă sinceră de a spune ceea ce uneori nu încape în cuvinte. Un buchet poate însoți o
              declarație, o iertare, o revedere sau o zi în care cineva are nevoie de puțină lumină.
            </p>

            <p>
              Ne-am dorit să construim un spațiu în care eleganța să fie ușor de ales, iar
              experiența de cumpărare să fie caldă, clară și memorabilă. De aceea, fiecare colecție
              Bloomera este gândită cu atenție la detalii, la cromatică, la emoția pe care o
              transmite și la felul în care ajunge la destinatar.
            </p>

            <p>
              Pentru noi, frumusețea înseamnă echilibru: prospețime, rafinament și grijă. Fie că
              alegi un buchet romantic, o plantă de interior sau un aranjament pentru o ocazie
              specială, vrem ca produsul să spună o poveste și să lase în urmă o amintire.
            </p>

            <p>
              Bloomera înseamnă gesturi delicate, surprize create cu suflet și produse alese pentru
              a transforma momentele obișnuite în clipe care rămân.
            </p>
          </div>
        </div>

        <div class="info-dialog-actions">
          <v-spacer />
          <v-btn class="close-btn" variant="text" @click="aboutDialog = false">Închide</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="contactDialog" max-width="1100">
      <v-card class="info-dialog contact-dialog" elevation="0">
        <div class="info-dialog-header">
          <div>
            <p class="info-dialog-kicker">Bloomera</p>
            <h2>Contact & Suport</h2>
          </div>

          <button type="button" class="dialog-close-btn" @click="contactDialog = false">
            <v-icon size="20">mdi-close</v-icon>
          </button>
        </div>

        <div class="info-dialog-body">
          <div class="contact-layout">
            <div class="contact-form-card">
              <h3>Trimite-ne un mesaj</h3>

              <div class="contact-field">
                <label>Numele tău</label>
                <input v-model="contactForm.name" type="text" placeholder="Ex: Ion Popescu" />
              </div>

              <div class="contact-field">
                <label>Email</label>
                <input v-model="contactForm.email" type="email" placeholder="adresa@email.com" />
              </div>

              <div class="contact-field">
                <label>Mesajul tău</label>
                <textarea
                  v-model="contactForm.message"
                  rows="5"
                  placeholder="Cu ce te putem ajuta?"
                ></textarea>
              </div>

              <button type="button" class="contact-submit-btn" @click="submitContactForm">
                Trimite Mesajul
              </button>
            </div>

            <div class="contact-info-side">
              <div class="contact-info-card">
                <h3>Informații Contact</h3>

                <div class="contact-info-list">
                  <div class="contact-info-item">
                    <span class="contact-info-icon">📞</span>
                    <span>0712 345 678</span>
                  </div>

                  <div class="contact-info-item">
                    <span class="contact-info-icon">✉️</span>
                    <span>contact@bloomera.ro</span>
                  </div>

                  <div class="contact-info-item">
                    <span class="contact-info-icon">📍</span>
                    <span>str. Florilor, nr. 14, Bucuresti, Romania</span>
                  </div>
                </div>
              </div>

              <div class="contact-schedule-card">
                <h3>Program de funcționare</h3>

                <div class="schedule-row">
                  <span>Luni - Vineri:</span>
                  <strong>09:00 - 18:00</strong>
                </div>

                <div class="schedule-row">
                  <span>Sâmbătă:</span>
                  <strong>10:00 - 14:00</strong>
                </div>

                <div class="schedule-row closed">
                  <span>Duminică:</span>
                  <strong>Închis</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="info-dialog-actions">
          <v-spacer />
          <v-btn class="close-btn" variant="text" @click="contactDialog = false">Închide</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="termsDialog" max-width="960">
      <v-card class="info-dialog" elevation="0">
        <div class="info-dialog-header">
          <div>
            <p class="info-dialog-kicker">Bloomera</p>
            <h2>Termeni & Condiții</h2>
          </div>

          <button type="button" class="dialog-close-btn" @click="termsDialog = false">
            <v-icon size="20">mdi-close</v-icon>
          </button>
        </div>

        <div class="info-dialog-body terms-dialog-body">
          <div class="terms-section">
            <h3 class="terms-title">1. Informații generale</h3>
            <p>
              Prin utilizarea site-ului Bloomera și plasarea unei comenzi, confirmi că ai citit și
              ai înțeles termenii de utilizare ai platformei. Ne rezervăm dreptul de a actualiza
              informațiile afișate, produsele, prețurile și politicile comerciale ori de câte ori
              este necesar.
            </p>
          </div>

          <div class="terms-section">
            <h3 class="terms-title">2. Produse și disponibilitate</h3>
            <p>
              Toate produsele sunt prezentate cât mai fidel posibil. Pot exista mici diferențe de
              nuanță, volum sau aspect, în funcție de sezonalitate, disponibilitatea florilor sau
              materialelor decorative. Comenzile se procesează în limita stocului disponibil.
            </p>
          </div>

          <div class="terms-section">
            <h3 class="terms-title">3. Comenzi și livrare</h3>
            <p>
              După confirmarea comenzii, vei primi informațiile relevante pentru procesare și
              livrare. Termenele de livrare pot varia în funcție de intervalul ales, adresă și
              volumul comenzilor. Bloomera depune toate eforturile pentru ca produsele să ajungă în
              cele mai bune condiții.
            </p>
          </div>

          <div class="terms-section">
            <h3 class="terms-title">4. Plată</h3>
            <p>
              Plata poate fi efectuată prin metodele disponibile pe site la momentul plasării
              comenzii. Prețurile afișate sunt exprimate în lei și pot fi actualizate fără o
              notificare prealabilă, fără a afecta comenzile deja confirmate.
            </p>
          </div>

          <div class="terms-section">
            <h3 class="terms-title">5. Suport clienți</h3>
            <p>
              Pentru întrebări, clarificări sau solicitări legate de comenzi, ne poți contacta prin
              formularul de suport sau prin datele de contact afișate în site. Vom încerca să
              răspundem în cel mai scurt timp posibil, în programul de lucru afișat.
            </p>
          </div>
        </div>

        <div class="info-dialog-actions">
          <v-spacer />
          <v-btn class="close-btn" variant="text" @click="termsDialog = false">Închide</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="quizResultsDialog" max-width="980">
      <v-card class="quiz-results-dialog" elevation="0">
        <v-card-title class="quiz-results-title">Recomandări personalizate</v-card-title>

        <v-card-text class="quiz-results-body">
          <p class="quiz-results-subtitle">Am ales câteva produse pe baza răspunsurilor tale.</p>

          <div v-if="quizResults.length" class="quiz-results-list">
            <article
              v-for="product in quizResults"
              :key="product.id"
              class="quiz-result-row"
              @click="goToProduct(product.slug)"
            >
              <img
                :src="getOptimizedImage(product.image_url, 220)"
                :alt="product.name"
                class="quiz-result-image"
                loading="lazy"
                decoding="async"
              />

              <div class="quiz-result-content">
                <span class="quiz-result-name">{{ product.name }}</span>
                <p class="quiz-result-price">{{ formatPrice(product.price) }}</p>
              </div>

              <button type="button" class="btn-text-link">Vezi produs →</button>
            </article>
          </div>

          <div v-else class="quiz-empty">Nu am găsit recomandări potrivite momentan.</div>
        </v-card-text>

        <v-card-actions class="quiz-results-actions">
          <v-spacer />
          <v-btn class="close-btn" variant="text" @click="quizResultsDialog = false">
            Închide
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
const aboutDialog = ref(false)
const contactDialog = ref(false)
const termsDialog = ref(false)
const quizResults = ref([])
const carouselTrack = ref(null)

const contactForm = ref({
  name: '',
  email: '',
  message: '',
})

const featuredProducts = computed(() => {
  return [...(productsStore.products || [])]
    .filter((product) => Number(product.stock || 0) > 0)
    .slice(0, 10)
})

const categoryHighlights = computed(() => {
  const grouped = new Map()

  for (const product of productsStore.products || []) {
    if (Number(product.stock || 0) <= 0) continue

    const slug = product.categories?.slug
    const name = product.categories?.name

    if (!slug || !name) continue

    if (!grouped.has(slug)) {
      grouped.set(slug, {
        slug,
        name,
        count: 0,
        image: product.image_url || '',
      })
    }

    grouped.get(slug).count += 1

    if (!grouped.get(slug).image && product.image_url) {
      grouped.get(slug).image = product.image_url
    }
  }

  return Array.from(grouped.values()).slice(0, 4)
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

function getOptimizedImage(url, width = 800) {
  if (!url) return ''

  if (url.includes('unsplash.com')) {
    return `${url}${url.includes('?') ? '&' : '?'}auto=format&fit=crop&w=${width}&q=75`
  }

  return url
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
    ) {
      score += 20
    }

    if (
      preferredType === 'buchet' &&
      (categorySlug.includes('buchete') || categoryName.includes('buchete'))
    ) {
      score += 20
    }
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

function submitContactForm() {
  contactForm.value = {
    name: '',
    email: '',
    message: '',
  }

  contactDialog.value = false
}

onMounted(async () => {
  if (!productsStore.products?.length) {
    await productsStore.fetchProducts()
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

.home {
  font-family: 'Inter', sans-serif;
  color: #1f1a17;
}

h1,
h2,
h3,
.product-title,
.footer-logo,
.hero-editorial-card h2,
.hero-quiz-card h3 {
  font-family: 'Playfair Display', serif;
  font-weight: 500;
}

.footer-logo {
  font-family:
    'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana,
    sans-serif;
  font-weight: 500;
}

.container {
  width: min(1360px, calc(100% - 40px));
  margin: 0 auto;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  padding: 0 28px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-solid {
  border: 1px solid #b9364e;
  background: #b9364e;
  color: #fff;
  box-shadow: 0 14px 30px rgba(185, 54, 78, 0.18);
}

.btn-solid:hover {
  background: #a62e45;
  border-color: #a62e45;
}

.btn-outline {
  border: 1px solid #decfcb;
  background: #fff;
  color: #3f3330;
}

.btn-outline:hover {
  border-color: #b9364e;
  color: #b9364e;
}

.hero {
  padding: 28px 0 32px;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
  gap: 22px;
}

.hero-main {
  min-height: 680px;
  padding: 72px;
  border-radius: 34px;
  background:
    linear-gradient(135deg, rgba(255, 250, 248, 0.92), rgba(248, 237, 233, 0.92)), #f5ebe8;
  border: 1px solid #efe2dd;
  box-shadow: 0 26px 70px rgba(116, 79, 67, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hero-kicker {
  display: inline-block;
  margin-bottom: 18px;
  color: #b9364e;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.hero-title {
  margin: 0;
  max-width: 760px;
  font-size: clamp(46px, 6vw, 86px);
  line-height: 0.95;
  letter-spacing: -0.04em;
  color: #2f2623;
}

.hero-title-accent {
  display: block;
  margin-top: 10px;
  color: #b9364e;
  font-style: italic;
}

.hero-description {
  margin: 26px 0 0;
  max-width: 560px;
  font-size: 18px;
  line-height: 1.8;
  color: #655a55;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 36px;
}

.hero-benefits {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 56px;
}

.hero-benefit {
  padding: 18px 18px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(237, 223, 217, 0.95);
  backdrop-filter: blur(8px);
}

.hero-benefit strong {
  display: block;
  margin-bottom: 6px;
  color: #342a27;
  font-size: 15px;
}

.hero-benefit span {
  color: #7b6f69;
  font-size: 14px;
  line-height: 1.5;
}

.hero-side {
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 22px;
}

.hero-editorial-card,
.hero-quiz-card {
  border-radius: 34px;
  overflow: hidden;
  position: relative;
}

.hero-editorial-card {
  min-height: 370px;
  padding: 40px;
  background:
    linear-gradient(180deg, rgba(35, 26, 23, 0.78), rgba(35, 26, 23, 0.88)),
    radial-gradient(circle at top right, rgba(199, 44, 72, 0.22), transparent 35%), #1d1715;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-shadow: 0 26px 70px rgba(50, 31, 26, 0.16);
}

.hero-editorial-card h2 {
  margin: 14px 0 14px;
  font-size: clamp(30px, 3vw, 42px);
  line-height: 1.08;
}

.hero-editorial-card p {
  margin: 0;
  max-width: 340px;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.7;
}

.editorial-badge {
  display: inline-flex;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: #f8d8df;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.editorial-link,
.hero-quiz-link {
  margin-top: 24px;
  display: inline-flex;
  color: #f8d8df;
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.hero-quiz-card {
  border: 1px solid #efe2dd;
  background: linear-gradient(180deg, #ffffff, #fff7f5);
  padding: 34px;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 18px 42px rgba(116, 79, 67, 0.08);
}

.hero-quiz-card:hover {
  transform: translateY(-2px);
  border-color: #d9b4bf;
  box-shadow: 0 24px 48px rgba(116, 79, 67, 0.12);
}

.hero-quiz-card h3 {
  margin: 14px 0 10px;
  color: #2f2623;
  font-size: 34px;
  line-height: 1.1;
}

.hero-quiz-card p {
  margin: 0;
  color: #706560;
  line-height: 1.7;
}

.hero-quiz-link {
  color: #b9364e;
}

.feature-strip {
  padding: 10px 0 26px;
}

.feature-strip-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.feature-strip-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 20px;
  border-radius: 22px;
  background: #fff;
  border: 1px solid #f1e6e1;
  box-shadow: 0 10px 30px rgba(116, 79, 67, 0.04);
}

.feature-icon {
  font-size: 24px;
  line-height: 1;
}

.feature-strip-item strong {
  display: block;
  margin-bottom: 4px;
  color: #342a27;
  font-size: 15px;
}

.feature-strip-item p {
  margin: 0;
  color: #7b6f69;
  font-size: 14px;
  line-height: 1.55;
}

.categories-section,
.products-showcase,
.quiz-cta,
.benefits {
  padding: 72px 0;
}

.section-head-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.section-label {
  display: inline-block;
  margin-bottom: 10px;
  color: #b9364e;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.section-head h2,
.benefits-head h2 {
  margin: 0;
  color: #2f2623;
  font-size: clamp(30px, 3vw, 48px);
  line-height: 1.08;
}

.section-link {
  text-decoration: none;
  color: #2f2623;
  font-weight: 700;
  border-bottom: 1px solid #2f2623;
  padding-bottom: 4px;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.section-link:hover {
  color: #b9364e;
  border-color: #b9364e;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.category-card {
  position: relative;
  min-height: 430px;
  border-radius: 28px;
  overflow: hidden;
  text-decoration: none;
  background: #f6efec;
  box-shadow: 0 20px 46px rgba(116, 79, 67, 0.08);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 28px 56px rgba(116, 79, 67, 0.12);
}

.category-image-wrap {
  position: absolute;
  inset: 0;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.8s ease;
}

.category-card:hover .category-image {
  transform: scale(1.05);
}

.category-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-size: 72px;
  color: #b88593;
}

.category-overlay {
  position: absolute;
  inset: auto 0 0 0;
  padding: 24px;
  background: linear-gradient(180deg, transparent, rgba(24, 18, 16, 0.78));
  color: #fff;
}

.category-count {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
}

.category-overlay h3 {
  margin: 0 0 8px;
  font-size: 30px;
  line-height: 1.1;
}

.category-link-text {
  font-size: 14px;
  font-weight: 700;
  color: #ffd7df;
}

.products-showcase {
  background: linear-gradient(180deg, #ffffff, #fffaf8);
}

.products-carousel-wrap {
  position: relative;
}

.products-carousel {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc((100% - 54px) / 4);
  gap: 18px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  padding-bottom: 12px;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  will-change: scroll-position;
}

.products-carousel::-webkit-scrollbar {
  display: none;
}

.product-card {
  scroll-snap-align: start;
  border-radius: 24px;
  background: #fff;
  border: 1px solid #f1e6e1;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  will-change: transform;
  transform: translateZ(0);
}

.product-card:hover {
  transform: translate3d(0, -4px, 0);
  box-shadow: 0 24px 50px rgba(116, 79, 67, 0.09);
}

.product-image-wrap {
  display: block;
  aspect-ratio: 1 / 1.18;
  background: #f8efef;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.product-card:hover .product-image {
  transform: scale(1.06);
}

.product-card-content {
  padding: 18px 18px 22px;
}

.product-category {
  margin: 0 0 8px;
  color: #a48d84;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.product-title {
  display: block;
  margin-bottom: 10px;
  text-decoration: none;
  color: #2f2623;
  font-size: 24px;
  line-height: 1.2;
  transition: color 0.2s ease;
}

.product-title:hover {
  color: #b9364e;
}

.product-price {
  margin: 0;
  color: #b9364e;
  font-size: 18px;
  font-weight: 700;
}

.carousel-floating {
  position: absolute;
  top: 40%;
  transform: translateY(-50%);
  width: 52px;
  height: 52px;
  border: 1px solid #efdeda;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  color: #b9364e;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 14px 30px rgba(116, 79, 67, 0.08);
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.carousel-floating:hover {
  background: #b9364e;
  color: #fff;
}

.carousel-floating.left {
  left: -18px;
}

.carousel-floating.right {
  right: -18px;
}

.quiz-cta-card {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) auto;
  align-items: center;
  gap: 24px;
  padding: 34px;
  border-radius: 30px;
  background:
    linear-gradient(135deg, rgba(255, 248, 250, 0.95), rgba(255, 241, 244, 0.98)), #fff4f6;
  border: 1px solid #f2dbe1;
  box-shadow: 0 22px 60px rgba(185, 54, 78, 0.08);
}

.quiz-cta-content h2 {
  margin: 0 0 12px;
  color: #2f2623;
  font-size: clamp(28px, 3vw, 42px);
  line-height: 1.1;
}

.quiz-cta-content p {
  margin: 0;
  max-width: 760px;
  color: #6f625d;
  line-height: 1.8;
  font-size: 16px;
}

.quiz-cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-end;
}

.benefits {
  padding-top: 20px;
}

.benefits-head {
  margin-bottom: 28px;
}

.benefit-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.benefit-item {
  padding: 28px 24px;
  border-radius: 26px;
  background: #fff;
  border: 1px solid #f1e6e1;
  box-shadow: 0 16px 36px rgba(116, 79, 67, 0.05);
  text-align: center;
}

.icon-wrap {
  font-size: 32px;
  margin-bottom: 16px;
}

.benefit-item h3 {
  margin: 0 0 12px;
  color: #2f2623;
  font-size: 26px;
}

.benefit-item p {
  margin: 0;
  color: #6f625d;
  line-height: 1.75;
}

.home-footer {
  background: linear-gradient(135deg, #fffaf7 0%, #fdf3ee 40%, #fffaf7 100%);
  color: #4c3a32;
  padding: 86px 0 56px;
  margin-top: 32px;
  border-top: 1px solid #f1e6e1;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 44px;
}

.footer-logo {
  margin: 0 0 18px;
  font-size: 42px;
  letter-spacing: -0.03em;
  font-weight: 600;
}

.brand-pink {
  color: #c72c48;
}

.brand-green {
  color: #4c3a32;
}

.footer-brand p {
  margin: 0;
  color: #7a6e67;
  font-size: 15px;
  line-height: 1.8;
}

.footer-column h4 {
  margin: 0 0 24px;
  color: #c72c48;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.footer-column a,
.footer-column span {
  display: block;
  margin-bottom: 14px;
  color: #6f625d;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.footer-column a:hover {
  color: #c72c48;
}

.footer-link-btn {
  display: block;
  margin-bottom: 14px;
  padding: 0;
  border: none;
  background: transparent;
  color: #6f625d;
  text-decoration: none;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: color 0.2s ease;
}

.footer-link-btn:hover {
  color: #c72c48;
}

.info-dialog {
  border-radius: 30px;
  overflow: hidden;
  background: #ffffff;
}

.info-dialog-header {
  padding: 26px 28px 14px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #f1e6e1;
}

.info-dialog-kicker {
  margin: 0 0 6px;
  color: #b9364e;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.info-dialog-header h2 {
  margin: 0;
  color: #2f2623;
  font-size: clamp(28px, 4vw, 44px);
  line-height: 1.05;
}

.dialog-close-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #eadbd7;
  border-radius: 999px;
  background: #fff;
  color: #6f625d;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.dialog-close-btn:hover {
  background: #fff3f6;
  border-color: #f0c7d1;
  color: #b9364e;
}

.info-dialog-body {
  padding: 24px 28px 8px;
}

.story-dialog-body,
.terms-dialog-body {
  max-height: 70vh;
  overflow-y: auto;
}

.story-block p,
.terms-section p {
  margin: 0 0 18px;
  color: #655a55;
  line-height: 1.9;
  font-size: 20px;
}

.terms-section + .terms-section {
  margin-top: 18px;
}

.terms-section h3 {
  margin: 0 0 10px;
  color: #2f2623;
  font-size: 22px;
}

.contact-layout {
  display: grid;
  grid-template-columns: 1fr 0.95fr;
  gap: 24px;
  align-items: start;
}

.contact-form-card,
.contact-info-card,
.contact-schedule-card {
  border-radius: 24px;
  border: 1px solid #ebe0db;
  box-shadow: 0 8px 24px rgba(116, 79, 67, 0.08);
}

.contact-form-card {
  background: #fff;
  padding: 30px;
}

.contact-form-card h3,
.contact-info-card h3,
.contact-schedule-card h3 {
  margin: 0 0 24px;
  color: #111827;
  font-size: 24px;
  font-family: 'Inter', sans-serif;
  font-weight: 800;
}

.contact-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 18px;
}

.contact-field label {
  color: #111827;
  font-size: 15px;
  font-weight: 700;
}

.contact-field input,
.contact-field textarea {
  width: 100%;
  border: 2px solid #d9dde3;
  border-radius: 12px;
  background: #fff;
  padding: 14px 14px;
  outline: none;
  color: #4b5563;
  font-size: 15px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.contact-field input:focus,
.contact-field textarea:focus {
  border-color: #b9364e;
  box-shadow: 0 0 0 4px rgba(185, 54, 78, 0.08);
}

.contact-submit-btn {
  width: 100%;
  min-height: 54px;
  border: none;
  border-radius: 14px;
  background: #b9364e;
  color: white;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.contact-submit-btn:hover {
  transform: translateY(-1px);
  background: #792332;
}

.contact-info-side {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.contact-info-card {
  background: #2f241f;
  padding: 30px;
  color: #fff;
}

.contact-info-card h3 {
  color: #fff;
  margin-bottom: 22px;
  padding-bottom: 18px;
  border-bottom: 1px solid #b9364e;
}

.contact-info-list {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.contact-info-item {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
}

.contact-info-icon {
  font-size: 26px;
  flex-shrink: 0;
}

.contact-schedule-card {
  background: #fff;
  padding: 28px 24px;
}

.schedule-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: #243b5d;
  font-size: 16px;
  font-weight: 700;
  padding: 8px 0;
}

.schedule-row.closed {
  color: #ff1d1d;
}

.info-dialog-actions,
.quiz-results-actions {
  padding: 0 24px 24px;
  margin-top: 20px;
}

.quiz-results-dialog {
  border-radius: 28px;
  overflow: hidden;
}

.quiz-results-title {
  font-size: 28px;
  font-family: 'Playfair Display', serif;
  padding: 24px 24px 8px;
  color: #b9364e;
  font-weight: 600;
}

.quiz-results-body {
  padding-top: 0;
}

.quiz-results-subtitle {
  color: #4c3a32;
  margin-bottom: 22px;
  line-height: 1.6;
}

.quiz-results-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 6px;
  padding-top: 10px;
}

.quiz-result-row {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid #eee;
  border-radius: 18px;
  padding: 10px 12px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  background: #fff;
}

.quiz-result-row:hover {
  border-color: #c72c48;
  transform: translateY(-2px);
  box-shadow: 0 14px 26px rgba(0, 0, 0, 0.06);
}

.quiz-result-image {
  width: 88px;
  height: 88px;
  object-fit: cover;
  border-radius: 14px;
  display: block;
  flex-shrink: 0;
}

.quiz-result-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.quiz-result-name {
  color: #1a1a1a;
  font-weight: 600;
  overflow-wrap: break-word;
}

.quiz-result-price {
  margin: 8px 0 0;
  font-size: 16px;
  font-weight: 700;
  color: #1a1715;
}

.btn-text-link {
  margin-left: auto;
  color: #c72c48;
  font-weight: 600;
  background: transparent;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
}

.quiz-empty {
  padding: 20px 0 8px;
  color: #6b7280;
}

.close-btn {
  border-radius: 8px;
  text-transform: none;
  font-weight: 700;
  color: #b9364e;
  border: 1px solid #f3c4cd;
  background: #fff1f4;
}

.terms-title {
  border-bottom: 1px solid #b9364e;
  padding-bottom: 10px;
}

@media (max-width: 1250px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .hero-main {
    min-height: auto;
  }

  .hero-side {
    grid-template-columns: 1fr 1fr;
  }

  .categories-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .products-carousel {
    grid-auto-columns: calc((100% - 18px) / 2);
  }

  .footer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .feature-strip-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .quiz-cta-card {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }

  .quiz-cta-actions {
    justify-content: flex-start;
  }

  .contact-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .container {
    width: min(100%, calc(100% - 24px));
  }

  .hero-main {
    padding: 34px 22px;
    border-radius: 28px;
  }

  .hero-benefits {
    grid-template-columns: 1fr;
  }

  .hero-side {
    grid-template-columns: 1fr;
  }

  .hero-editorial-card,
  .hero-quiz-card {
    border-radius: 28px;
  }

  .feature-strip-grid,
  .categories-grid,
  .benefit-grid,
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .products-carousel {
    grid-auto-columns: 84%;
  }

  .carousel-floating {
    display: none;
  }

  .section-head-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .quiz-result-row {
    align-items: flex-start;
  }

  .btn-text-link {
    margin-left: 0;
  }

  .info-dialog-header,
  .info-dialog-body,
  .info-dialog-actions {
    padding-left: 18px;
    padding-right: 18px;
  }

  .contact-form-card,
  .contact-info-card,
  .contact-schedule-card {
    padding: 22px 18px;
  }

  .contact-info-item {
    font-size: 16px;
  }

  .schedule-row {
    font-size: 15px;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 16px 0 20px;
  }

  .hero-title {
    font-size: 44px;
    line-height: 1;
  }

  .hero-description {
    font-size: 16px;
  }

  .hero-actions,
  .quiz-cta-actions {
    flex-direction: column;
    width: 100%;
  }

  .hero-actions .btn,
  .quiz-cta-actions .btn {
    width: 100%;
  }

  .hero-editorial-card {
    min-height: 300px;
    padding: 26px 22px;
  }

  .hero-quiz-card {
    padding: 26px 22px;
  }

  .category-card {
    min-height: 340px;
  }

  .quiz-cta-card {
    padding: 24px 20px;
    border-radius: 24px;
  }

  .quiz-result-row {
    flex-wrap: wrap;
  }

  .quiz-result-image {
    width: 72px;
    height: 72px;
  }

  .contact-info-item {
    align-items: flex-start;
  }

  .schedule-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
@media (max-width: 640px) {
  .contact-dialog {
    width: 100%;
    max-width: 100%;
    margin: 0;
    border-radius: 22px;
  }

  .contact-dialog .info-dialog-body {
    max-height: calc(100dvh - 180px);
    overflow-y: auto;
    padding-bottom: 16px;
  }

  .contact-layout {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .contact-form-card,
  .contact-info-card,
  .contact-schedule-card {
    width: 100%;
  }
}
</style>
