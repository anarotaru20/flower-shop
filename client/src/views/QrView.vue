<template>
  <div class="qr-page">
    <div class="qr-card">
      <div v-if="loading" class="qr-state">
        <p>Se încarcă...</p>
      </div>

      <div v-else-if="error" class="qr-state qr-error">
        <h1>QR invalid</h1>
        <p>{{ error }}</p>
      </div>

      <div v-else-if="qr" class="qr-content">
        <span class="eyebrow">Bloomera</span>

        <h1>
          {{ qr.products?.length ? 'Ghidul plantelor tale' : 'Mesajul tau' }}
        </h1>

        <div v-if="qr.message" class="message-box">
          <h2>Mesaj pentru tine</h2>
          <p>{{ qr.message }}</p>
        </div>

        <div v-if="qr.products?.length" class="products-list">
          <div v-for="product in qr.products" :key="product.id" class="product-card">
            <h2 class="product-title">{{ product.name }}</h2>

            <div v-if="product.care_instructions" class="care-box">
              <h3>Ghid de îngrijire</h3>
              <p>{{ product.care_instructions }}</p>
            </div>
          </div>
        </div>

        <div v-else class="empty-products">
          <p>Nu exista produse eligibile pentru ghid de ingrijire in aceasta comanda.</p>
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
    console.log('QR data:', data)
  } catch (err) {
    console.log('QR fetch error:', err)
  }
})
</script>

<style scoped>
.qr-page {
  min-height: 100vh;
  padding: 32px 16px;
  background: linear-gradient(180deg, #fffaf5 0%, #fff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-card {
  width: 100%;
  max-width: 860px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.qr-state {
  padding: 48px 24px;
  text-align: center;
}

.qr-error h1 {
  margin: 0 0 12px;
  font-size: 30px;
  color: #b42318;
}

.qr-error p {
  margin: 0;
  color: #666;
}

.qr-content {
  padding: 28px;
}

.eyebrow {
  display: inline-block;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #c26d52;
}

h1 {
  margin: 0 0 20px;
  font-size: 34px;
  line-height: 1.15;
  color: #1f2937;
}

.message-box {
  padding: 18px;
  border-radius: 18px;
  margin-top: 16px;
  background: #fff3ee;
  margin-bottom: 20px;
}

.message-box h2,
.care-box h3,
.product-title {
  margin: 0 0 10px;
  color: #1f2937;
}

.products-list {
  display: grid;
  gap: 20px;
}

.product-card {
  padding: 18px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid #eef0f2;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
}

.plant-image {
  width: 100%;
  height: 260px;
  object-fit: cover;
  border-radius: 18px;
  margin-bottom: 16px;
}

.product-title {
  font-size: 28px;
  margin-bottom: 14px;
}

.care-box {
  padding: 18px;
  border-radius: 18px;
  background: #f5f8f2;
}

.empty-products {
  padding: 18px;
  border-radius: 18px;
  background: #f9fafb;
}

p {
  margin: 0;
  line-height: 1.7;
  color: #4b5563;
  white-space: pre-line;
}

@media (max-width: 640px) {
  .qr-page {
    padding: 20px 12px;
  }

  .qr-content {
    padding: 20px;
  }

  .plant-image {
    height: 220px;
  }

  h1 {
    font-size: 28px;
  }

  .product-title {
    font-size: 22px;
  }
}
</style>
