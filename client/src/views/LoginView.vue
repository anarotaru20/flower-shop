<template>
  <section class="auth-page">
    <div class="auth-background">
      <span class="blob blob-1"></span>
      <span class="blob blob-2"></span>
      <span class="blob blob-3"></span>
    </div>

    <div class="auth-layout">
      <div class="auth-hero">
        <h1 class="hero-title">
          <span class="hero-brand">
            <span class="hero-brand-bloom">bloom</span><span class="hero-brand-era">era</span>
          </span>
          <span class="hero-motto">momente care rămân.</span>
        </h1>

        <p class="hero-description">
          Bine ai revenit în universul Bloomera — locul în care florile însoțesc gesturile frumoase,
          surprizele delicate și amintirile care merită păstrate.
        </p>

        <div class="hero-chips">
          <div class="hero-chip chip-1">💐 buchete alese cu grijă</div>
          <div class="hero-chip chip-2">✨ momente speciale</div>
          <div class="hero-chip chip-3">🤍 gesturi care contează</div>
        </div>
      </div>

      <div class="auth-card-wrap">
        <div class="auth-card">
          <p class="auth-badge">Bine ai revenit</p>
          <h2>Autentificare</h2>
          <p class="auth-subtitle">Continuă experiența ta florală</p>

          <form class="auth-form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="introdu emailul tau"
                v-model.trim="form.email"
              />
            </div>

            <div class="form-group">
              <label for="password">Parola</label>
              <div class="input-wrapper">
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="introdu parola"
                  v-model="form.password"
                />
                <button type="button" class="eye" @click="showPassword = !showPassword">
                  <v-icon size="20">
                    {{ showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline' }}
                  </v-icon>
                </button>
              </div>
            </div>

            <button type="submit" class="auth-button">
              {{ auth.loading ? 'Se procesează...' : 'Autentificare' }}
            </button>
          </form>

          <p v-if="loginError" class="message error">{{ loginError }}</p>
          <p v-if="loginSuccess" class="message success">{{ loginSuccess }}</p>

          <div class="auth-links">
            <button type="button" class="text-link forgot-link" @click="openForgotDialog">
              Ai uitat parola?
            </button>

            <RouterLink to="/register" class="register-link"
              >Nu ai cont? Înregistrează-te</RouterLink
            >
            <RouterLink to="/" class="back-home">← Înapoi la magazin</RouterLink>
          </div>
        </div>
      </div>
    </div>

    <Transition name="modal-fade">
      <div v-if="forgotDialog" class="modal-overlay" @click.self="closeForgotDialog">
        <div class="modal-card">
          <button type="button" class="modal-close" @click="closeForgotDialog" aria-label="Închide">
            <v-icon size="20">mdi-close</v-icon>
          </button>

          <p class="modal-badge">Resetare parolă</p>
          <h3>Ai uitat parola?</h3>
          <p class="modal-subtitle">
            Introdu emailul asociat contului tău și îți trimitem pașii pentru resetarea parolei.
          </p>

          <form class="modal-form" @submit.prevent="handleForgotSubmit">
            <div class="form-group">
              <label for="forgot-email">Email</label>
              <input
                id="forgot-email"
                type="email"
                placeholder="introdu emailul tau"
                v-model.trim="forgotForm.email"
              />
            </div>

            <button type="submit" class="auth-button modal-button">
              {{ auth.loading ? 'Se procesează...' : 'Trimite email' }}
            </button>
          </form>

          <p v-if="forgotError" class="message error">{{ forgotError }}</p>
          <p v-if="forgotSuccess" class="message success">{{ forgotSuccess }}</p>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = ref({
  email: '',
  password: '',
})

const forgotForm = ref({
  email: '',
})

const showPassword = ref(false)
const forgotDialog = ref(false)

const loginError = ref('')
const loginSuccess = ref('')
const forgotError = ref('')
const forgotSuccess = ref('')

onMounted(() => {
  clearAllMessages()

  if (route.query.expired) {
    loginError.value = 'Sesiunea a expirat. Te rugăm să te autentifici din nou.'
  }
})

function clearAllMessages() {
  auth.clearMessages()
  loginError.value = ''
  loginSuccess.value = ''
  forgotError.value = ''
  forgotSuccess.value = ''
}

function clearLoginMessages() {
  auth.clearMessages()
  loginError.value = ''
  loginSuccess.value = ''
}

function clearForgotMessages() {
  auth.clearMessages()
  forgotError.value = ''
  forgotSuccess.value = ''
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function openForgotDialog() {
  clearForgotMessages()
  forgotForm.value.email = form.value.email || ''
  forgotDialog.value = true
}

function closeForgotDialog() {
  forgotDialog.value = false
  clearForgotMessages()
  forgotForm.value = {
    email: '',
  }
}

async function handleSubmit() {
  clearLoginMessages()

  if (!form.value.email) {
    loginError.value = 'Te rugăm să introduci adresa de email.'
    return
  }

  if (!isValidEmail(form.value.email)) {
    loginError.value = 'Te rugăm să introduci o adresă de email validă.'
    return
  }

  if (!form.value.password) {
    loginError.value = 'Te rugăm să introduci parola.'
    return
  }

  if (form.value.password.length < 6) {
    loginError.value = 'Parola trebuie să aibă cel puțin 6 caractere.'
    return
  }

  try {
    await auth.login(form.value)

    loginSuccess.value = 'Te-ai autentificat cu succes.'

    form.value = {
      email: '',
      password: '',
    }

    router.push('/')
  } catch (e) {
    loginError.value = 'Email sau parolă incorectă.'
  }
}

async function handleForgotSubmit() {
  clearForgotMessages()

  if (!forgotForm.value.email) {
    forgotError.value = 'Te rugăm să introduci adresa de email.'
    return
  }

  if (!isValidEmail(forgotForm.value.email)) {
    forgotError.value = 'Te rugăm să introduci o adresă de email validă.'
    return
  }

  try {
    await auth.sendForgotPassword(forgotForm.value)

    forgotSuccess.value = 'Emailul pentru resetarea parolei a fost trimis.'

    forgotForm.value = {
      email: '',
    }
  } catch (e) {
    forgotError.value = 'Nu am putut trimite emailul. Încearcă din nou.'
  }
}
</script>

<style scoped>
.auth-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #fffaf7 0%, #fdf3ee 40%, #fffaf7 100%);
  overflow: hidden;
}

.auth-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(10px);
  opacity: 0.45;
  animation: floatBlob 10s ease-in-out infinite;
}

.blob-1 {
  width: 320px;
  height: 320px;
  top: -70px;
  left: -70px;
  background: radial-gradient(circle, rgba(210, 180, 160, 0.35), transparent 70%);
}

.blob-2 {
  width: 360px;
  height: 360px;
  right: -100px;
  top: 100px;
  background: radial-gradient(circle, rgba(184, 150, 132, 0.22), transparent 70%);
  animation-delay: 1.5s;
}

.blob-3 {
  width: 280px;
  height: 280px;
  bottom: -80px;
  left: 35%;
  background: radial-gradient(circle, rgba(229, 201, 187, 0.28), transparent 70%);
  animation-delay: 3s;
}

.auth-layout {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1280px;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: center;
  gap: 56px;
}

.auth-hero {
  padding: 30px 10px;
  animation: fadeSlideLeft 0.9s ease;
}

.hero-title {
  margin: 0 0 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hero-brand {
  display: block;
  font-size: clamp(48px, 6vw, 82px);
  line-height: 0.98;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.hero-brand-bloom {
  color: #c72c48;
}

.hero-brand-era {
  color: #4c3a32;
}

.hero-motto {
  display: block;
  font-size: clamp(28px, 3.2vw, 46px);
  line-height: 1.05;
  font-weight: 700;
  color: #9a6f58;
  letter-spacing: -0.03em;
  font-family: Georgia, 'Times New Roman', Times, serif;
  opacity: 0.9;
}

.hero-description {
  max-width: 560px;
  margin: 0 0 30px;
  font-size: 17px;
  line-height: 1.85;
  color: #756962;
}

.hero-chips {
  padding-top: 5px;
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}

.hero-chips::-webkit-scrollbar {
  display: none;
}

.hero-chip {
  flex: 0 0 auto;
  padding: 12px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(199, 186, 179, 0.9);
  color: #5f4a42;
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  white-space: nowrap;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  animation: chipFloat 4s ease-in-out infinite;
}

.chip-2 {
  animation-delay: 0.8s;
}

.chip-3 {
  animation-delay: 1.6s;
}

.hero-chip:hover {
  transform: translateY(-3px);
  box-shadow: 0 3px 5px rgba(124, 99, 87, 0.14);
}

.auth-card-wrap {
  display: flex;
  justify-content: center;
  animation: fadeSlideRight 0.9s ease;
}

.auth-card {
  width: 100%;
  max-width: 540px;
  padding: 40px 42px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.696);
  border: 1px solid rgba(236, 224, 217, 0.95);
  box-shadow: 0 25px 55px rgba(111, 83, 67, 0.12);
  backdrop-filter: blur(16px);
  text-align: center;
}

.auth-badge {
  margin: 0 0 10px;
  color: #a06d57;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.auth-card h2 {
  margin: 0 0 12px;
  color: #4c3a32;
  font-size: 36px;
}

.auth-subtitle {
  margin: 0 auto 28px;
  max-width: 380px;
  color: #7a6e67;
  line-height: 1.7;
  font-size: 15px;
  opacity: 0.8;
}

.auth-form,
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #574741;
}

.form-group input {
  width: 100%;
  height: 54px;
  padding: 0 16px;
  border-radius: 16px;
  border: 1px solid #e8dcd5;
  background: rgba(255, 252, 250, 0.95);
  color: #4f3d34;
  font-size: 15px;
  outline: none;
  transition: all 0.25s ease;
}

.form-group input::placeholder {
  color: #b09f95;
}

.form-group input:focus {
  border-color: #b2856d;
  box-shadow: 0 0 0 4px rgba(178, 133, 109, 0.12);
  transform: translateY(-1px);
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  padding-right: 52px;
}

.eye {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  opacity: 0.75;
  transition: all 0.2s ease;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8f7a70;
  padding: 0;
}

.eye:hover {
  opacity: 1;
  transform: translateY(-50%) scale(1.05);
  color: #4c3a32;
}

.auth-button {
  height: 56px;
  border: none;
  border-radius: 50px;
  margin-top: 15px;
  margin-bottom: 10px;
  background: #4c3a32;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  box-shadow: 0 16px 30px rgba(106, 74, 60, 0.22);
  transition: all 0.25s ease;
}

.auth-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 34px rgba(106, 74, 60, 0.28);
}

.auth-links {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.auth-links a,
.text-link {
  color: #8f5f6b;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
}

.auth-links a:hover,
.text-link:hover {
  color: #c72c48;
  transform: translateX(3px);
}

.auth-links .register-link {
  color: #c72c48;
}

.auth-links .register-link:hover {
  color: #c72c48;
}

.message {
  font-weight: 600;
  text-align: center;
}

.error {
  color: #c72c48;
  background: none;
  border: none;
}

.success {
  color: #4caf50;
  background: none;
  border: none;
}
s .auth-links .back-home {
  font-size: 14px;
  color: #a08c83;
  text-decoration: none;
  transition: all 0.2s ease;
}

.back-home:hover {
  color: #c72c48;
  transform: translateX(-2px);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(76, 58, 50, 0.28);
  backdrop-filter: blur(8px);
}

.modal-card {
  position: relative;
  width: 100%;
  max-width: 500px;
  padding: 34px 32px 30px;
  border-radius: 28px;
  background: rgba(255, 250, 247, 0.96);
  border: 1px solid rgba(236, 224, 217, 0.95);
  box-shadow: 0 28px 60px rgba(88, 64, 54, 0.18);
  text-align: center;
  animation: modalPop 0.22s ease;
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  color: #7a6e67;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;
}

.modal-close:hover {
  transform: scale(1.04);
  color: #4c3a32;
  background: #ffffff;
}

.modal-badge {
  margin: 0 0 10px;
  color: #a06d57;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.modal-card h3 {
  margin: 0 0 12px;
  color: #4c3a32;
  font-size: 32px;
}

.modal-subtitle {
  margin: 0 auto 24px;
  max-width: 390px;
  color: #7a6e67;
  line-height: 1.7;
  font-size: 15px;
}

.modal-button {
  margin-top: 8px;
  margin-bottom: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.22s ease;
}

.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card {
  transition:
    transform 0.22s ease,
    opacity 0.22s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-card,
.modal-fade-leave-to .modal-card {
  transform: translateY(10px) scale(0.98);
  opacity: 0;
}

@keyframes floatBlob {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-16px) translateX(10px);
  }
}

@keyframes chipFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes fadeSlideLeft {
  from {
    opacity: 0;
    transform: translateX(-28px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeSlideRight {
  from {
    opacity: 0;
    transform: translateX(28px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes modalPop {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 1024px) {
  .auth-layout {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .auth-hero {
    text-align: center;
    padding-bottom: 0;
  }

  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-chips {
    justify-content: center;
  }

  .auth-card-wrap {
    justify-content: center;
  }
}

@media (max-width: 720px) {
  .auth-page {
    padding: 20px 12px;
    min-height: 100dvh;
  }

  .auth-background,
  .auth-hero {
    display: none;
  }

  .auth-layout {
    max-width: 100%;
    grid-template-columns: 1fr;
    gap: 0;
  }

  .auth-card-wrap {
    width: 100%;
  }

  .auth-card {
    max-width: 100%;
    width: 100%;
    padding: 28px 20px;
    border-radius: 24px;
    box-shadow: 0 18px 36px rgba(111, 83, 67, 0.1);
  }

  .auth-card h2 {
    font-size: 30px;
  }

  .auth-subtitle {
    max-width: 100%;
    margin-bottom: 24px;
  }

  .auth-form {
    gap: 20px;
  }

  .form-group input {
    height: 52px;
    font-size: 14px;
  }

  .auth-button {
    height: 54px;
    margin-top: 8px;
    margin-bottom: 6px;
  }

  .auth-links {
    gap: 16px;
    margin-top: 20px;
  }

  .modal-overlay {
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .modal-card {
    max-width: 100%;
    width: 100%;
    border-radius: 24px;
    padding: 28px 18px 24px;
    max-height: calc(100dvh - 32px);
    overflow-y: auto;
  }

  .modal-card h3 {
    font-size: 28px;
  }

  .modal-subtitle {
    max-width: 100%;
    font-size: 14px;
  }

  .modal-form {
    gap: 20px;
  }

  .modal-close {
    top: 10px;
    right: 10px;
  }
}
</style>
