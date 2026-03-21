<template>
  <section class="auth-page">
    <div class="auth-card">
      <p class="auth-badge">Bloomera</p>
      <h1>Reseteaza parola</h1>
      <p class="auth-subtitle">Introdu noua parolă pentru contul tău.</p>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="password">Parola noua</label>
          <div class="input-wrapper">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="introdu parola noua"
              v-model="form.password"
            />
            <span class="eye" @click="showPassword = !showPassword">
              {{ showPassword ? '🙈' : '👁️' }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="confirm_password">Confirma parola</label>
          <div class="input-wrapper">
            <input
              id="confirm_password"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="confirma parola noua"
              v-model="form.confirm_password"
            />
            <span class="eye" @click="showConfirmPassword = !showConfirmPassword">
              {{ showConfirmPassword ? '🙈' : '👁️' }}
            </span>
          </div>
        </div>

        <button type="submit" class="auth-button">
          {{ auth.loading ? 'Se proceseaza...' : 'Reseteaza parola' }}
        </button>
      </form>

      <p v-if="auth.error" class="error">{{ auth.error }}</p>
      <p v-if="auth.successMessage" class="success">{{ auth.successMessage }}</p>

      <div class="auth-links">
        <RouterLink to="/login">Inapoi la login</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const auth = useAuthStore()

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const accessToken = ref('')
const refreshToken = ref('')

const form = ref({
  password: '',
  confirm_password: '',
})

onMounted(async () => {
  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash

  const params = new URLSearchParams(hash)

  accessToken.value = params.get('access_token') || ''
  refreshToken.value = params.get('refresh_token') || ''

  if (accessToken.value && refreshToken.value) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken.value,
      refresh_token: refreshToken.value,
    })

    if (error) {
      auth.error = error.message || 'Nu s-a putut initializa sesiunea de resetare.'
    }
  }
})

async function handleSubmit() {
  auth.clearMessages()

  if (!form.value.password || !form.value.confirm_password) {
    auth.error = 'Completeaza ambele campuri.'
    return
  }

  if (form.value.password !== form.value.confirm_password) {
    auth.error = 'Parolele nu coincid.'
    return
  }

  if (!accessToken.value || !refreshToken.value) {
    auth.error = 'Linkul de resetare este invalid sau incomplet.'
    return
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: form.value.password,
    })

    if (error) {
      auth.error = error.message || 'Nu s-a putut reseta parola.'
      return
    }

    auth.successMessage = 'Parola a fost resetata cu succes.'

    form.value = {
      password: '',
      confirm_password: '',
    }

    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (e) {
    auth.error = 'Nu s-a putut reseta parola.'
  }
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  background: #fffaf7;
}

.auth-card {
  width: 100%;
  max-width: 460px;
  background: #ffffff;
  border: 1px solid #f1e6e1;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 18px 40px rgba(160, 120, 120, 0.08);
}

.auth-badge {
  margin: 0 0 10px;
  color: #c48797;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.auth-card h1 {
  margin: 0 0 10px;
  color: #5a514d;
}

.auth-subtitle {
  margin: 0 0 24px;
  color: #7a716b;
  line-height: 1.6;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #5a514d;
}

.form-group input {
  height: 48px;
  border: 1px solid #eadcd6;
  border-radius: 14px;
  padding: 0 14px;
  font-size: 15px;
  outline: none;
}

.form-group input:focus {
  border-color: #dba4b2;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding-right: 40px;
}

.eye {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 16px;
  opacity: 0.7;
}

.eye:hover {
  opacity: 1;
}

.auth-button {
  height: 48px;
  border: none;
  border-radius: 999px;
  background: #dba4b2;
  color: white;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.auth-links {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.auth-links a {
  color: #8f5f6b;
  text-decoration: none;
  font-weight: 600;
}

.error {
  color: #d9534f;
  margin-top: 10px;
  font-size: 14px;
}

.success {
  color: #4caf50;
  margin-top: 10px;
  font-size: 14px;
}
</style>
