<template>
  <section class="auth-page">
    <div class="auth-card">
      <p class="auth-badge">Bloomera</p>
      <h1>Creeaza un cont</h1>

      <p class="auth-subtitle">
        Fă-ți cont și comandă mai ușor buchete, aranjamente și surprize florale pentru cei dragi.
      </p>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="first_name">Prenume</label>
          <input id="first_name" type="text" placeholder="prenume" v-model="form.first_name" />
        </div>

        <div class="form-group">
          <label for="last_name">Nume</label>
          <input id="last_name" type="text" placeholder="nume" v-model="form.last_name" />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" placeholder="email" v-model="form.email" />
        </div>

        <div class="form-group">
          <label for="password">Parola</label>
          <div class="input-wrapper">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="parola"
              v-model="form.password"
            />
            <span class="eye" @click="showPassword = !showPassword">
              {{ showPassword ? '🙈' : '👁️' }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="confirm_password">Confirmă parola</label>
          <div class="input-wrapper">
            <input
              id="confirm_password"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="confirma parola"
              v-model="form.confirm_password"
            />
            <span class="eye" @click="showConfirmPassword = !showConfirmPassword">
              {{ showConfirmPassword ? '🙈' : '👁️' }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="birth_date">Data nasterii</label>
          <input id="birth_date" type="date" v-model="form.birth_date" />
        </div>

        <div class="form-group">
          <label for="username">Username (optional)</label>
          <input id="username" type="text" placeholder="username" v-model="form.username" />
        </div>

        <div class="form-group">
          <label for="address">Adresa (optional)</label>
          <input id="address" type="text" placeholder="adresa" v-model="form.address" />
        </div>

        <button type="submit" class="auth-button">
          {{ auth.loading ? 'Se proceseaza...' : 'Register' }}
        </button>
      </form>

      <!-- mesaje -->
      <p v-if="auth.error" class="error">{{ auth.error }}</p>
      <p v-if="auth.successMessage" class="success">
        {{ auth.successMessage }}
      </p>

      <div class="auth-links">
        <RouterLink to="/login">Ai deja cont? Logheaza-te</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const showPassword = ref(false)
const showConfirmPassword = ref(false)

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

async function handleSubmit() {
  auth.clearMessages()

  if (form.value.password !== form.value.confirm_password) {
    auth.error = 'Parolele nu coincid.'
    return
  }

  try {
    const payload = { ...form.value }
    delete payload.confirm_password

    await auth.register(payload)

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
  } catch (e) {}
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
</style>
