<template>
  <section class="auth-page">
    <div class="auth-background">
      <span class="blob blob-1"></span>
      <span class="blob blob-2"></span>
      <span class="blob blob-3"></span>
    </div>

    <div class="auth-layout">
      <div class="auth-card-wrap">
        <div class="auth-card">
          <p class="auth-badge">Esti nou?</p>
          <h1>Creează emoții</h1>
          <p class="auth-subtitle">Momente de neuitat</p>

          <form class="auth-form" @submit.prevent="handleSubmit">
            <div class="form-row three-cols">
              <div class="form-group">
                <label for="first_name">Prenume</label>
                <input
                  id="first_name"
                  type="text"
                  placeholder="ex. Ion"
                  v-model="form.first_name"
                />
              </div>

              <div class="form-group">
                <label for="last_name">Nume</label>
                <input
                  id="last_name"
                  type="text"
                  placeholder="ex. Popescu"
                  v-model="form.last_name"
                />
              </div>

              <div class="form-group">
                <label for="birth_date">Data nașterii</label>

                <v-menu
                  v-model="birthDateMenu"
                  :close-on-content-click="false"
                  location="bottom"
                  offset="10"
                >
                  <template #activator="{ props }">
                    <div class="date-display" v-bind="props">
                      <span :class="form.birth_date ? 'date-value' : 'date-placeholder'">
                        {{
                          form.birth_date
                            ? formatBirthDate(form.birth_date)
                            : 'Selectează data'
                        }}
                      </span>

                      <button type="button" class="date-trigger">
                        <v-icon size="20">mdi-calendar-month-outline</v-icon>
                      </button>
                    </div>
                  </template>

                  <div class="birth-date-menu-card">
                    <v-date-picker
                      v-model="form.birth_date"
                      hide-header
                      :max="maxBirthDate"
                      show-adjacent-months
                    />
                  </div>
                </v-menu>
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="ex. ion.popescu@gmail.com"
                v-model="form.email"
              />
              <p v-if="form.email && !fieldStates.email" class="error-text">
                Introdu o adresă de email validă.
              </p>
            </div>

            <div class="form-row two-cols">
              <div class="form-group">
                <label for="password">Parolă</label>
                <div class="input-wrapper">
                  <input
                    id="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Parolă"
                    v-model="form.password"
                  />
                  <button type="button" class="eye" @click="showPassword = !showPassword">
                    <v-icon size="20">
                      {{ showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline' }}
                    </v-icon>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label for="confirm_password">Confirmă parola</label>
                <div class="input-wrapper">
                  <input
                    id="confirm_password"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="Confirmă parola"
                    v-model="form.confirm_password"
                  />
                  <button
                    type="button"
                    class="eye"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <v-icon size="20">
                      {{ showConfirmPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline' }}
                    </v-icon>
                  </button>
                </div>
              </div>
            </div>

            <div class="password-rules">
              <p :class="passwordChecks.length ? 'valid-text' : 'neutral-text'">
                • minim 8 caractere
              </p>
              <p :class="passwordChecks.uppercase ? 'valid-text' : 'neutral-text'">
                • cel puțin o literă mare
              </p>
              <p :class="passwordChecks.number ? 'valid-text' : 'neutral-text'">
                • cel puțin o cifră
              </p>
              <p :class="passwordChecks.special ? 'valid-text' : 'neutral-text'">
                • cel puțin un caracter special
              </p>
            </div>

            <p
              v-if="form.confirm_password && !passwordsMatch"
              class="error-text password-match-error"
            >
              Confirmarea parolei nu coincide.
            </p>

            <button type="submit" class="auth-button" :disabled="!canSubmit">
              {{ auth.loading ? 'Se procesează...' : 'Creează cont' }}
            </button>
          </form>

          <p v-if="auth.error" class="error">{{ auth.error }}</p>

          <div class="auth-links">
            <RouterLink to="/login" class="auth-login-link">Ai deja cont? Autentifică-te</RouterLink>
            <RouterLink to="/" class="back-home">← Înapoi la magazin</RouterLink>
          </div>
        </div>
      </div>

      <div class="auth-hero">
        <h2 class="hero-title">
          <span class="hero-brand">
            <span class="hero-brand-bloom">bloom</span><span class="hero-brand-era">era</span>
          </span>
          <span class="hero-motto">gesturi frumoase încep cu un cont.</span>
        </h2>

        <p class="hero-description">
          Creează-ți contul pentru a salva preferințele tale, a comanda mai ușor și a transforma
          fiecare surpriză florală într-o experiență mai personală.
        </p>

        <div class="hero-chips">
          <div class="hero-chip chip-1">💐 comenzi mai rapide</div>
          <div class="hero-chip chip-2">✨ preferințe salvate</div>
          <div class="hero-chip chip-3">🤍 momente care rămân</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const birthDateMenu = ref(false)

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirm_password: '',
  birth_date: '',
  username: '',
  address: '',
})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const maxBirthDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const passwordChecks = computed(() => ({
  length: form.value.password.length >= 8,
  uppercase: /[A-ZĂÂÎȘȚ]/.test(form.value.password),
  number: /\d/.test(form.value.password),
  special: /[^A-Za-zĂÂÎȘȚăâîșț0-9]/.test(form.value.password),
}))

const passwordsMatch = computed(() => {
  return form.value.password === form.value.confirm_password
})

const isPasswordValid = computed(() => {
  return (
    passwordChecks.value.length &&
    passwordChecks.value.uppercase &&
    passwordChecks.value.number &&
    passwordChecks.value.special
  )
})

const fieldStates = computed(() => {
  const birthDateValid = form.value.birth_date
    ? new Date(form.value.birth_date) < new Date()
    : false

  return {
    first_name: form.value.first_name.trim().length >= 2,
    last_name: form.value.last_name.trim().length >= 2,
    email: emailRegex.test(form.value.email),
    birth_date: birthDateValid,
    username:
      !form.value.username ||
      (/^\S{3,}$/.test(form.value.username) && form.value.username.trim().length >= 3),
  }
})

const canSubmit = computed(() => {
  return Boolean(
    fieldStates.value.email &&
      fieldStates.value.birth_date &&
      isPasswordValid.value &&
      passwordsMatch.value &&
      !auth.loading,
  )
})

function formatBirthDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleDateString('ro-RO')
}

async function handleSubmit() {
  auth.clearMessages()

  if (!fieldStates.value.email) {
    auth.error = 'Introdu o adresă de email validă.'
    return
  }

  if (!form.value.password || !form.value.confirm_password) {
    auth.error = 'Completează parola și confirmarea parolei.'
    return
  }

  if (!passwordChecks.value.length) {
    auth.error = 'Parola trebuie să aibă minim 8 caractere.'
    return
  }

  if (!passwordChecks.value.uppercase) {
    auth.error = 'Parola trebuie să conțină cel puțin o literă mare.'
    return
  }

  if (!passwordChecks.value.number) {
    auth.error = 'Parola trebuie să conțină cel puțin o cifră.'
    return
  }

  if (!passwordChecks.value.special) {
    auth.error = 'Parola trebuie să conțină cel puțin un caracter special.'
    return
  }

  if (!passwordsMatch.value) {
    auth.error = 'Confirmarea parolei nu coincide.'
    return
  }

  if (!fieldStates.value.birth_date) {
    auth.error = 'Alege o dată a nașterii validă.'
    return
  }

  if (!fieldStates.value.username) {
    auth.error = 'Username-ul trebuie să aibă minim 3 caractere și fără spații.'
    return
  }

  try {
    const payload = { ...form.value }
    delete payload.confirm_password

    await auth.register(payload)

    auth.successMessage = ''

    form.value = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
      birth_date: '',
      username: '',
      address: '',
    }

    router.push('/')
  } catch (e) {}
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
  max-width: 1360px;
  display: grid;
  grid-template-columns: 1.12fr 0.88fr;
  align-items: center;
  gap: 44px;
}

.auth-card-wrap {
  display: flex;
  justify-content: center;
  animation: fadeSlideLeft 0.9s ease;
}

.auth-card {
  width: 100%;
  max-width: 780px;
  padding: 42px 46px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.72);
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

.auth-card h1 {
  margin: 0 0 12px;
  color: #4c3a32;
  font-size: 38px;
  line-height: 1.1;
}

.auth-subtitle {
  margin: 0 auto 28px;
  max-width: 520px;
  color: #7a6e67;
  line-height: 1.7;
  font-size: 15px;
  opacity: 0.84;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row.two-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.form-row.three-cols {
  display: grid;
  grid-template-columns: 1fr 1fr 1.15fr;
  gap: 18px;
  align-items: end;
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
  height: 56px;
  padding: 0 16px;
  border-radius: 18px;
  border: 1px solid #e8dcd5;
  background: rgba(255, 252, 250, 0.95);
  color: #4f3d34;
  font-size: 15px;
  outline: none;
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease,
    background 0.25s ease;
}

.form-group input::placeholder {
  color: #b09f95;
}

.form-group input:focus {
  border-color: #b2856d;
  box-shadow: 0 0 0 4px rgba(178, 133, 109, 0.12);
  transform: translateY(-1px);
  background: #fff;
}

.date-display {
  width: 100%;
  min-height: 56px;
  padding: 0 14px 0 18px;
  border-radius: 18px;
  border: 1px solid #e8dcd5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.date-display:hover {
  border-color: #d8c0b3;
}

.date-display:focus-within,
.date-display:active {
  border-color: #b2856d;
  box-shadow: 0 0 0 4px rgba(178, 133, 109, 0.12);
  transform: translateY(-1px);
}

.date-placeholder {
  color: #b09f95;
  font-size: 15px;
}

.date-value {
  color: #4f3d34;
  font-size: 15px;
  font-weight: 500;
}

.date-trigger {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #f5e6df 0%, #f1d8ce 100%);
  color: #8a5f4b;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  box-shadow: 0 8px 18px rgba(149, 109, 89, 0.14);
}

.birth-date-menu-card {
  border-radius: 22px;
  overflow: hidden;
  background: #fffaf8;
  box-shadow: 0 20px 40px rgba(96, 69, 56, 0.16);
  border: 1px solid rgba(236, 224, 217, 0.95);
}

:deep(.v-date-picker) {
  width: 320px;
  background: #fffaf8;
  color: #4c3a32;
}

:deep(.v-picker-title) {
  display: none;
}

:deep(.v-date-picker-header) {
  padding: 14px 16px 8px;
}

:deep(.v-date-picker-month) {
  padding: 0 12px 12px;
}

:deep(.v-date-picker-controls) {
  padding-inline: 4px;
}

:deep(.v-btn) {
  text-transform: none;
}

:deep(.v-date-picker-month__day .v-btn) {
  border-radius: 14px;
}

:deep(.v-date-picker-month__day--selected .v-btn) {
  background: #c72c48 !important;
  color: #fff !important;
}

:deep(.v-date-picker-month__weekday) {
  color: #8a776e;
  font-weight: 700;
  font-size: 12px;
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
  transition:
    transform 0.2s ease,
    opacity 0.2s ease,
    color 0.2s ease;
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

.password-rules {
  margin-top: -2px;
  padding: 6px 2px 0;
  text-align: left;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 24px;
}

.password-rules p {
  margin: 0;
  line-height: 1.7;
  font-size: 14px;
  font-weight: 600;
}

.neutral-text {
  color: #9f9087;
}

.valid-text {
  color: #4caf50;
}

.error-text {
  color: #d9534f;
  font-size: 13px;
  font-weight: 700;
}

.password-match-error {
  margin: -10px 0 0;
  text-align: left;
}

.auth-button {
  height: 56px;
  border: none;
  border-radius: 10px;
  margin-top: 8px;
  background: #4c3a32;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  box-shadow: 0 16px 30px rgba(106, 74, 60, 0.22);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    opacity 0.25s ease;
}

.auth-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 34px rgba(106, 74, 60, 0.28);
}

.auth-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 10px 20px rgba(106, 74, 60, 0.12);
}

.auth-links {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.auth-links .auth-login-link {
  color: #c72c48;
}

.auth-links a {
  color: #8f5f6b;
  text-decoration: none;
  font-weight: 600;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.auth-links a:hover {
  color: #c72c48;
  transform: translateX(3px);
}

.back-home {
  font-size: 13px;
  color: #a08c83 !important;
}

.back-home:hover {
  color: #c72c48 !important;
  transform: translateX(-2px) !important;
}

.error {
  color: #d9534f;
  margin-top: 12px;
  font-size: 14px;
  font-weight: 700;
}

.auth-hero {
  padding: 30px 10px;
  animation: fadeSlideRight 0.9s ease;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  margin: 0 0 22px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(181, 154, 139, 0.28);
  color: #8a5f4b;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  box-shadow: 0 8px 24px rgba(120, 92, 78, 0.08);
  width: fit-content;
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
  font-size: clamp(24px, 3vw, 42px);
  line-height: 1.08;
  font-weight: 700;
  color: #9a6f58;
  letter-spacing: -0.03em;
  font-family: Georgia, 'Times New Roman', Times, serif;
  opacity: 0.92;
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

@media (max-width: 1200px) {
  .form-row.three-cols {
    grid-template-columns: 1fr 1fr;
  }

  .form-row.three-cols .form-group:last-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 1024px) {
  .auth-layout {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .auth-card {
    max-width: 100%;
  }

  .auth-hero {
    text-align: center;
    order: -1;
  }

  .hero-badge {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-chips {
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

  .auth-card h1 {
    font-size: 30px;
  }

  .auth-subtitle {
    max-width: 100%;
    margin-bottom: 24px;
  }

  .auth-form {
    gap: 20px;
  }

  .form-row.two-cols,
  .form-row.three-cols {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .form-row.three-cols .form-group:last-child {
    grid-column: auto;
  }

  .form-group input,
  .date-display {
    min-height: 52px;
    font-size: 14px;
  }

  .password-rules {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .auth-button {
    height: 54px;
    margin-top: 8px;
  }

  .auth-links {
    gap: 14px;
    margin-top: 20px;
  }

  :deep(.v-date-picker) {
    width: 100%;
    min-width: 280px;
  }
}
</style>