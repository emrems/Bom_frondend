<template>
  <div class="login-page">
    <div class="login-container">
      <!-- SOL TARAF: GÖRSEL BÖLÜMÜ -->
      <div class="login-image-section">
        <img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1887&auto=format&fit=crop" alt="Kuyumcu Atölyesi">
        <div class="image-overlay">
          <h2>Zarafetin ve Güvenin Adresi</h2>
          <p>En değerli anlarınız için en özel tasarımlar.</p>
        </div>
      </div>

      <!-- SAĞ TARAF: GİRİŞ FORMU -->
      <div class="login-form-section">
        <div class="form-wrapper">
          <div class="form-header">
            <router-link to="/" class="logo-link">
              <!-- Sitenizin logosu veya adı buraya gelebilir -->
              <h3>Altın Kuyumcu</h3>
            </router-link>
            <h1>Giriş Yap</h1>
            <p>Hesabınıza erişmek için bilgilerinizi girin.</p>
          </div>
          
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="email">E-posta Adresi</label>
              <input type="email" id="email" v-model="email" required placeholder="ornek@email.com">
            </div>
            <div class="form-group">
              <label for="password">Şifre</label>
              <input type="password" id="password" v-model="password" required placeholder="••••••••">
            </div>
            
            <!-- Hata Mesajı Alanı -->
            <div v-if="error" class="error-message">
              {{ error }}
            </div>

            <div class="form-actions">
                <router-link to="/forgot-password" class="forgot-password">Şifremi Unuttum</router-link>
            </div>
            
            <button type="submit" class="btn-login" :disabled="isLoading">
              <span v-if="isLoading">Giriş Yapılıyor...</span>
              <span v-else>Giriş Yap</span>
            </button>
          </form>

          <div class="register-link">
            <p>Hesabınız yok mu? <router-link to="/register">Hemen Kayıt Olun</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      isLoading: false,
      error: null
    };
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.error = null;

      try {
        // API Base URL'ini projenizin yapısına göre bir environment dosyasından almak en iyisidir.
        const API_BASE_URL = 'https://localhost:7001/api'; // Port numarasını kendi projenize göre güncelleyin.

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // API'den gelen hata mesajını kullanıyoruz, yoksa genel bir mesaj gösteriyoruz.
          throw new Error(data.message || 'E-posta veya şifre hatalı.');
        }

        // Başarılı girişte token'ı localStorage'a kaydediyoruz.
        localStorage.setItem('authToken', data.token);

        // Kullanıcıyı anasayfaya yönlendiriyoruz.
        this.$router.push('/');

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
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  min-height: 700px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Sol Taraf: Görsel */
.login-image-section {
  flex: 1;
  position: relative;
  display: none; /* Mobilde gizle */
}
.login-image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2));
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40px;
}
.image-overlay h2 {
  font-family: 'Cinzel', serif; /* Şık bir serif font */
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.image-overlay p {
  font-size: 1.1rem;
  max-width: 80%;
}

/* Sağ Taraf: Form */
.login-form-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}
.form-wrapper {
  width: 100%;
  max-width: 400px;
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
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}
.forgot-password {
  color: #D4AF37;
  text-decoration: none;
  font-size: 0.9rem;
}
.btn-login {
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
}
.btn-login:hover:not(:disabled) {
  background-color: #333;
}
.btn-login:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Hata Mesajı */
.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  margin-bottom: 1.5rem;
}

/* Kayıt Linki */
.register-link {
  text-align: center;
  margin-top: 2rem;
  color: #666;
}
.register-link a {
  color: #D4AF37;
  font-weight: 600;
  text-decoration: none;
}

/* Mobil Uyum */
@media (min-width: 992px) {
  .login-image-section {
    display: flex; /* Sadece büyük ekranlarda göster */
  }
}
@media (max-width: 768px) {
  .login-container {
    min-height: auto;
    flex-direction: column;
  }
  .login-form-section {
    padding: 30px 20px;
  }
}
</style>
