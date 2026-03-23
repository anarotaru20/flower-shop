<template>
  <section class="auth-page">
    <div class="auth-background">
      <span class="blob blob-1"></span>
      <span class="blob blob-2"></span>
      <span class="blob blob-3"></span>
    </div>

    <div class="auth-card-wrap">
      <div class="auth-card">
        <template v-if="!resetCompleted">
          <div class="icon-top">
            <v-icon size="28">mdi-lock-reset</v-icon>
          </div>

          <p class="auth-badge">Creează o parolă nouă</p>
          <p class="auth-subtitle">
            Alege o parolă sigură pentru contul tău și confirm-o pentru a continua.
          </p>

          <form class="auth-form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="password">Parolă nouă</label>
              <div class="input-wrapper">
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Parola nouă"
                  v-model="form.password"
                />
                <button type="button" class="eye" @click="showPassword = !showPassword">
                  <v-icon size="20">
                    {{ showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline' }}
                  </v-icon>
                </button>
              </div>
            </div>

            <div class="password-rules">
              <p :class="{ valid: validations.length }">• minim 8 caractere</p>
              <p :class="{ valid: validations.uppercase }">• cel puțin o literă mare</p>
              <p :class="{ valid: validations.special }">• cel puțin un caracter special</p>
              <p :class="{ valid: validations.number }">• cel puțin o cifră</p>
            </div>

            <div class="form-group">
              <label for="confirm_password">Confirmă parola</label>
              <div class="input-wrapper">
                <input
                  id="confirm_password"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Confirmă parola nouă"
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

            <p v-if="form.confirm_password && !passwordsMatch" class="error inline-error">
              Parolele nu coincid.
            </p>

            <button type="submit" class="auth-button" :disabled="!canSubmit">
              {{ auth.loading ? 'Se procesează...' : 'Resetează parola' }}
            </button>
          </form>

          <p v-if="auth.error" class="error">{{ auth.error }}</p>
          <p v-if="auth.successMessage" class="success">{{ auth.successMessage }}</p>

          <div class="auth-links">
            <RouterLink to="/login">Înapoi la autentificare</RouterLink>
            <RouterLink to="/" class="back-home">← Înapoi la magazin</RouterLink>
          </div>
        </template>

        <template v-else>
          <div class="success-state">
            <div class="success-icon">
              <v-icon size="34">mdi-check</v-icon>
            </div>

            <p class="auth-badge">Bloomera</p>
            <h2>Parola a fost actualizată</h2>
            <p class="auth-subtitle success-subtitle">
              Totul este pregătit. Te redirecționăm către autentificare.
            </p>

            <RouterLink to="/login" class="auth-button success-button-link">
              Mergi la autentificare
            </RouterLink>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const accessToken = ref('')
const refreshToken = ref('')
const resetCompleted = ref(false)

const form = ref({
  password: '',
  confirm_password: '',
})

const validations = computed(() => ({
  length: form.value.password.length >= 8,
  uppercase: /[A-ZĂÂÎȘȚ]/.test(form.value.password),
  lowercase: /[a-zăâîșț]/.test(form.value.password),
  number: /\d/.test(form.value.password),
  special: /[^A-Za-zĂÂÎȘȚăâîșț0-9]/.test(form.value.password),
}))

const passwordsMatch = computed(() => {
  return form.value.password === form.value.confirm_password
})

const isPasswordValid = computed(() => {
  return (
    validations.value.length &&
    validations.value.uppercase &&
    validations.value.lowercase &&
    validations.value.number &&
    validations.value.special
  )
})

const hasValidSessionTokens = computed(() => {
  return Boolean(accessToken.value && refreshToken.value)
})

const canSubmit = computed(() => {
  return Boolean(
    form.value.password &&
      form.value.confirm_password &&
      isPasswordValid.value &&
      passwordsMatch.value &&
      hasValidSessionTokens.value &&
      !auth.loading
  )
})

onMounted(async () => {
  auth.clearMessages()

  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash

  const hashParams = new URLSearchParams(hash)

  accessToken.value =
    hashParams.get('access_token') ||
    route.query.access_token ||
    route.query.token ||
    ''

  refreshToken.value =
    hashParams.get('refresh_token') ||
    route.query.refresh_token ||
    ''

  if (!accessToken.value || !refreshToken.value) {
    auth.error = 'Linkul de resetare este invalid, expirat sau incomplet.'
    return
  }

  const { error } = await supabase.auth.setSession({
    access_token: accessToken.value,
    refresh_token: refreshToken.value,
  })

  if (error) {
    auth.error = 'Nu am putut inițializa sesiunea de resetare. Te rugăm să soliciți un nou email.'
  }
})

async function handleSubmit() {
  auth.clearMessages()

  if (!form.value.password || !form.value.confirm_password) {
    auth.error = 'Completează ambele câmpuri.'
    return
  }

  if (!validations.value.length) {
    auth.error = 'Parola trebuie să aibă cel puțin 8 caractere.'
    return
  }

  if (!validations.value.uppercase) {
    auth.error = 'Parola trebuie să conțină cel puțin o literă mare.'
    return
  }

  if (!validations.value.lowercase) {
    auth.error = 'Parola trebuie să conțină cel puțin o literă mică.'
    return
  }

  if (!validations.value.number) {
    auth.error = 'Parola trebuie să conțină cel puțin o cifră.'
    return
  }

  if (!validations.value.special) {
    auth.error = 'Parola trebuie să conțină cel puțin un caracter special.'
    return
  }

  if (!passwordsMatch.value) {
    auth.error = 'Parolele nu coincid.'
    return
  }

  if (!hasValidSessionTokens.value) {
    auth.error = 'Linkul de resetare este invalid sau expirat.'
    return
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: form.value.password,
    })

    if (error) {
      auth.error = mapResetError(error.message)
      return
    }

    auth.successMessage = 'Parola a fost resetată cu succes.'
    resetCompleted.value = true

    form.value = {
      password: '',
      confirm_password: '',
    }

    setTimeout(() => {
      router.push('/login')
    }, 1800)
  } catch (e) {
    auth.error = 'Nu am putut reseta parola. Te rugăm să încerci din nou.'
  }
}

function mapResetError(message) {
  const text = String(message || '').toLowerCase()

  if (text.includes('same password')) {
    return 'Noua parolă trebuie să fie diferită de parola actuală.'
  }

  if (text.includes('session') || text.includes('token') || text.includes('expired')) {
    return 'Linkul de resetare este invalid sau a expirat. Solicită un nou email.'
  }

  if (text.includes('network') || text.includes('fetch')) {
    return 'A apărut o problemă de conexiune. Verifică internetul și încearcă din nou.'
  }

  return 'Nu am putut reseta parola. Te rugăm să încerci din nou.'
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

.auth-card-wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: center;
}

.auth-card {
  width: 100%;
  max-width: 640px;
  padding: 42px 48px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(236, 224, 217, 0.95);
  box-shadow: 0 30px 60px rgba(111, 83, 67, 0.12);
  backdrop-filter: blur(16px);
  text-align: center;
}

.icon-top {
  width: 52px;
  height: 52px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: rgba(199, 44, 72, 0.08);
  color: #c72c48;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-badge {
  margin: 0 0 10px;
  color: #4c3a32;
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.auth-card h1,
.auth-card h2 {
  margin: 0 0 12px;
  color: #4c3a32;
  font-size: 40px;
  line-height: 1.14;
}

.auth-subtitle {
  margin: 0 auto 28px;
  max-width: 460px;
  color: #7a6e67;
  line-height: 1.7;
  font-size: 15px;
  opacity: 0.84;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
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

.password-rules {
  text-align: left;
  display: grid;
  grid-template-columns: 2fr 2fr;
  gap: 1px;
  padding: 3px 20px ;
}

.password-rules p {
  margin: 0;
  font-size: 13px;
  color: #8e7b72;
  line-height: 1.7;
}

.password-rules p.valid {
  color: #4caf50;
  font-weight: 600;
}

.auth-button,
.success-button-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 50px;
  margin-top: 10px;
  background: #4c3a32;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  box-shadow: 0 16px 30px rgba(106, 74, 60, 0.22);
  transition: all 0.25s ease;
  text-decoration: none;
}

.auth-button:hover,
.success-button-link:hover {
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

.auth-links a {
  color: #8f5f6b;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
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
  color: #c72c48;
  font-weight: 600;
  margin-top: 12px;
  font-size: 14px;
}

.inline-error {
  margin-top: -8px;
  text-align: left;
}

.success {
  color: #4caf50;
  font-weight: 600;
  margin-top: 12px;
  font-size: 14px;
}

.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-icon {
  width: 72px;
  height: 72px;
  margin-bottom: 18px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(76, 175, 80, 0.12);
  color: #4caf50;
}

.success-subtitle {
  margin-bottom: 24px;
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

@media (max-width: 720px) {
  .auth-page {
    padding: 20px 12px;
    min-height: 100dvh;
  }

  .auth-card {
    max-width: 100%;
    padding: 28px 20px;
    border-radius: 24px;
    box-shadow: 0 18px 36px rgba(111, 83, 67, 0.1);
  }

  .auth-card h1,
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

  .auth-button,
  .success-button-link {
    height: 54px;
    margin-top: 8px;
  }

  .auth-links {
    gap: 14px;
    margin-top: 20px;
  }

  .password-rules {
    padding: 12px 14px;
  }
}
</style>
