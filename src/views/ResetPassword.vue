<template>
  <div class="reset-password-page">
    <div class="form-container">
      <h2>Şifrenizi Sıfırlayın</h2>

      <!-- Token kontrolü tamamlandıysa ve token yoksa mesaj göster -->
      <p v-if="isRouteChecked && !token">Geçersiz veya eksik şifre sıfırlama linki.</p>

      <!-- Token kontrolü tamamlandıysa ve token varsa form göster -->
      <form v-if="isRouteChecked && token" @submit.prevent="handleResetPassword">
        <div class="form-group">
          <label for="password">Yeni Şifre</label>
          <input type="password" id="password" v-model="form.password" required>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Yeni Şifre (Tekrar)</label>
          <input type="password" id="confirmPassword" v-model="form.confirmPassword" required>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <button type="submit" :disabled="isLoading">
          <span v-if="isLoading">İşleniyor...</span>
          <span v-else>Şifreyi Sıfırla</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ResetPassword',
  data() {
    return {
      form: {
        password: '',
        confirmPassword: ''
      },
      token: null,
      isRouteChecked: false,  // ✅ Token kontrolü tamamlandı mı?
      isLoading: false,
      error: null,
      successMessage: null,
    };
  },
  created() {
    const tokenFromUrl = this.$route.query.token;
    if (tokenFromUrl) {
      this.token = tokenFromUrl;
    }
    this.isRouteChecked = true; // ✅ Token kontrolü yapıldı
  },
  methods: {
    async handleResetPassword() {
      this.error = null;
      this.successMessage = null;

      if (this.form.password !== this.form.confirmPassword) {
        this.error = 'Şifreler uyuşmuyor. Lütfen kontrol edin.';
        return;
      }
      if (this.form.password.length < 6) { 
        this.error = 'Şifreniz en az 6 karakter olmalıdır.';
        return;
      }

      this.isLoading = true;

      try {
        const API_BASE_URL = 'https://localhost:7135/api';
        await axios.post(`${API_BASE_URL}/Auth/reset-password`, {
          token: this.token,
          password: this.form.password,
          confirmPassword: this.form.confirmPassword,
        });

        this.successMessage = 'Şifreniz başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...';
        this.token = null;

        setTimeout(() => {
          this.$router.push('/login');
        }, 3000);

      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          this.error = err.response.data.message; 
        } else {
          this.error = 'Şifre sıfırlanırken bir hata oluştu. Token geçersiz veya süresi dolmuş olabilir.';
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.reset-password-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f8f9fa;
}
.form-container {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}
h2 {
  text-align: center;
  margin-bottom: 2rem;
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ced4da;
  border-radius: 8px;
}
button {
  width: 100%;
  padding: 14px;
  background-color: #D4AF37;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
}
button:disabled {
  background-color: #e6d8b6;
  cursor: not-allowed;
}
.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}
.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}
</style>
