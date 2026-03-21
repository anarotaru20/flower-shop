<template>
  <div class="stripe-wrap">
    <div v-if="loading" class="text-body-2 mb-3">Se initializeaza plata...</div>

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-3">
      {{ errorMessage }}
    </v-alert>

    <div ref="paymentElementRef" class="payment-element" v-show="!errorMessage"></div>

    <v-alert v-if="submitError" type="error" variant="tonal" class="mt-3">
      {{ submitError }}
    </v-alert>

    <v-btn
      v-if="!loading && !errorMessage"
      color="primary"
      class="mt-4"
      :loading="confirming"
      @click="handlePay"
    >
      Plateste cu cardul
    </v-btn>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import { createPaymentIntent, confirmOrderPayment } from '@/services/payments'

const props = defineProps({
  orderId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['paid'])

const paymentElementRef = ref(null)
const loading = ref(true)
const confirming = ref(false)
const errorMessage = ref('')
const submitError = ref('')

let stripe = null
let elements = null
let paymentElement = null

onMounted(async () => {
  try {
    stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

    if (!stripe) {
      throw new Error('Stripe nu s-a initializat corect')
    }

    const { clientSecret } = await createPaymentIntent(props.orderId)

    loading.value = false
    await nextTick()

    if (!paymentElementRef.value) {
      throw new Error('Containerul Stripe nu a fost gasit')
    }

    elements = stripe.elements({ clientSecret })
    paymentElement = elements.create('payment')
    paymentElement.mount(paymentElementRef.value)
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      'Nu s-a putut initializa formularul de plata.'
  } finally {
    loading.value = false
  }
})

async function handlePay() {
  if (!stripe || !elements) return

  confirming.value = true
  submitError.value = ''

  try {
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (error) {
      submitError.value = error.message || 'Plata a esuat.'
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      await confirmOrderPayment(props.orderId)
      emit('paid')
      return
    }

    submitError.value = 'Plata nu a fost finalizata.'
  } catch (error) {
    submitError.value = error.message || 'Plata a esuat.'
  } finally {
    confirming.value = false
  }
}
</script>

<style scoped>
.payment-element {
  padding: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #fff;
  min-height: 70px;
}
</style>
