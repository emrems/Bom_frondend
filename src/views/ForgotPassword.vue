<template>
  <div class="forgot-password-page">
    <div class="form-container">
      <div class="form-wrapper">
        <div class="form-header">
          <router-link to="/" class="logo-link">
            <h3>Altın Kuyumcu</h3>
          </router-link>
          <h1>Şifremi Unuttum</h1>
          <p>Hesabınıza kayıtlı e-posta adresini girin. Size şifrenizi sıfırlamanız için bir bağlantı göndereceğiz.</p>
        </div>
        
        <form @submit.prevent="handlePasswordReset">
          <div class="form-group">
            <label for="email">E-posta Adresi</label>
            <input type="email" id="email" v-model="email" required placeholder="ornek@email.com">
          </div>
          
          <!-- Hata ve Başarı Mesajları -->
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
           <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>

          <button type="submit" class="btn-submit" :disabled="isLoading">
            <span v-if="isLoading">Gönderiliyor...</span>
            <span v-else>Sıfırlama Bağlantısı Gönder</span>
          </button>
        </form>

        <div class="back-to-login-link">
          <router-link to="/login">Giriş Sayfasına Geri Dön</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPasswordPage',
  data() {
    return {
      email: '',
      isLoading: false,
      error: null,
      successMessage: null
    };
  },
  methods: {
    async handlePasswordReset() {
      this.isLoading = true;
      this.error = null;
      this.successMessage = null;

      // --- ÖNEMLİ NOT ---
      // API sözleşmenizde şifre sıfırlama için bir endpoint belirtilmemiş.
      // Aşağıdaki kod, backend'e `POST /api/auth/forgot-password` gibi bir endpoint
      // eklendiğini varsayarak yazılmıştır.
      // Bu özelliği eklemesi için backend ekibinizle konuşmanız gerekmektedir.

      try {
        const API_BASE_URL = 'https://localhost:7001/api'; // Port numarasını kendi projenize göre güncelleyin.

        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Bir hata oluştu. Lütfen e-posta adresinizi kontrol edin.');
        }

        this.successMessage = 'Şifre sıfırlama bağlantısı e-posta adresinize gönderilmiştir. Lütfen gelen kutunuzu kontrol edin.';
        this.email = ''; // Formu temizle

      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.forgot-password-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
}

.form-container {
  width: 100%;
  max-width: 500px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.form-wrapper {
  width: 100%;
}

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.form-header .logo-link {
  text-decoration: none;
  color: #1a1a1a;
}

.form-header h3 {
  font-family: 'Cinzel', serif;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: #666;
  line-height: 1.6;
}

/* Form Elemanları */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  color: #1a1a1a; /* YAZI RENGİ SİYAH YAPILDI */
}

.form-group input:focus {
  outline: none;
  border-color: #D4AF37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
}

.btn-submit {
  width: 100%;
  padding: 15px;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
}

.btn-submit:hover:not(:disabled) {
  background-color: #333;
}

.btn-submit:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Hata ve Başarı Mesajları */
.error-message, .success-message {
  border: 1px solid;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  margin-bottom: 1.5rem;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border-color: #f5c6cb;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}

/* Giriş Sayfasına Geri Dön Linki */
.back-to-login-link {
  text-align: center;
  margin-top: 2rem;
}

.back-to-login-link a {
  color: #D4AF37;
  font-weight: 600;
  text-decoration: none;
}
</style>
