<template>
  <div class="qr-page">
    <div class="qr-shell">
      <div class="qr-card">
        <div v-if="loading" class="qr-state">
          <div class="state-icon">⏳</div>
          <p>Se încarcă...</p>
        </div>

        <div v-else-if="error" class="qr-state qr-error">
          <div class="state-icon">⚠️</div>
          <h1>QR invalid</h1>
          <p>{{ error }}</p>
        </div>

        <div v-else-if="qr" class="qr-content">
          <div class="header">
            <span class="brand-pink">bloom</span>
            <span class="brand-green">era</span>
          </div>

          <div v-if="qr.message" class="message-box">
            <div class="section-head">
              <h2>Mesaj pentru tine</h2>
            </div>
            <p>{{ qr.message }}</p>
          </div>

          <div v-if="qr.products?.length" class="products-list">
            <div v-for="product in qr.products" :key="product.id" class="product-card">
              <div class="care-box section-head">
                <h3>Ghid de îngrijire</h3>
              </div>
              <div class="product-top">
                <div>
                  <h2 class="product-title">{{ product.name }}</h2>
                </div>
              </div>

              <div v-if="product.care_instructions" class="care-box">
                <p>{{ product.care_instructions }}</p>
              </div>
            </div>
          </div>

          <div v-else class="empty-products">
            <h2>Nu există produse eligibile</h2>
            <p>Nu există produse eligibile pentru ghid de îngrijire în această comandă.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQrStore } from '@/stores/qr'

const route = useRoute()
const qrStore = useQrStore()

const { qr, loading, error } = storeToRefs(qrStore)

const token = computed(() => route.params.token)

onMounted(async () => {
  qrStore.clearQr()

  try {
    const data = await qrStore.fetchQrByToken(token.value)
  } catch (err) {
    console.log('QR fetch error:', err)
  }
})
</script>

<style scoped>
.qr-page {
  min-height: 100vh;
  padding: 40px 16px;
  background:
    radial-gradient(circle at top left, rgba(199, 44, 72, 0.08), transparent 28%),
    radial-gradient(circle at bottom right, rgba(194, 109, 82, 0.08), transparent 24%),
    linear-gradient(180deg, #fffaf6 0%, #fffdfb 100%);
}

.qr-shell {
  max-width: 980px;
  margin: 0 auto;
}

.qr-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(230, 231, 235, 0.9);
  border-radius: 28px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.qr-state {
  padding: 72px 24px;
  text-align: center;
}

.state-icon {
  font-size: 34px;
  margin-bottom: 14px;
}

.qr-error h1 {
  margin: 0 0 12px;
  font-size: 30px;
  color: #b42318;
}

.qr-error p {
  margin: 0;
  color: #667085;
}

.qr-content {
  padding: 40px;
}

.header {
  font-size: 42px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  letter-spacing: -0.03em;
}

.brand-pink {
  color: #c72c48;
}

.brand-green {
  color: #4c3a32;
}

.info-top {
  text-align: center;
  padding: 8px 0 28px;
  border-bottom: 1px solid #f0e7e2;
  margin-bottom: 28px;
}

.info-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 14px;
  border-radius: 999px;
  background: #fff1eb;
  color: #b85f46;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.03em;
  margin-bottom: 16px;
}

.page-title {
  margin: 0 0 12px;
  font-size: 38px;
  line-height: 1.1;
  color: #1f2937;
  letter-spacing: -0.03em;
}

.page-subtitle {
  max-width: 620px;
  margin: 0 auto;
  font-size: 16px;
  color: #6b7280;
  line-height: 1.7;
}

.message-box,
.product-card,
.empty-products {
  border-radius: 22px;
  border: 1px solid #efe7e2;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.message-box {
  padding: 24px;
  margin-bottom: 24px;
  background: linear-gradient(180deg, #fff6f1 0%, #fffaf7 100%);
}

.products-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.product-card {
  padding: 18px;
  border-radius: 18px;
  border: 3px solid #e8c6c6;
  box-shadow: none;
  transition: 0.2s ease;
}

.product-card:hover {
  border-color: #b9364e;
}

.product-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #3a3a3a;
}

.care-box {
  margin-top: 10px;
}

.care-box h3 {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b5f5f;
  margin-bottom: 6px;
}

.care-box p {
  font-size: 15px;
  color: #4b5563;
  line-height: 1.6;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1e6e1;
  gap: 10px;
  margin-bottom: 12px;
}

.section-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(180deg, #c72c48 0%, #d88b72 100%);
  flex-shrink: 0;
}

.message-box h2,
.care-box h3 {
  margin: 0;
  font-size: 18px;
  color: #1f2937;
}

.empty-products {
  padding: 24px;
  background: #fcfcfd;
}

.empty-products h2 {
  margin: 0 0 10px;
  font-size: 22px;
  color: #1f2937;
}

p {
  margin: 0;
  line-height: 1.8;
  color: #4b5563;
  white-space: pre-line;
}

@media (max-width: 640px) {
  .products-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .qr-page {
    padding: 20px 12px;
  }

  .qr-content {
    padding: 22px;
  }

  .header {
    font-size: 34px;
    margin-bottom: 20px;
  }

  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 15px;
  }

  .product-title {
    font-size: 22px;
  }

  .message-box,
  .product-card,
  .empty-products {
    border-radius: 18px;
  }
}
</style>
