<template>
  <div class="register-page">
    <div class="register-container">
      <!-- SOL TARAF: GÖRSEL BÖLÜMÜ -->
      <div class="register-image-section">
        <img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1887&auto=format&fit=crop" alt="Kuyumcu Vitrini">
        <div class="image-overlay">
          <h2>Yeni Bir Parıltıya Merhaba Deyin</h2>
          <p>Ayrıcalıklı dünyamıza katılın ve size özel fırsatları keşfedin.</p>
        </div>
      </div>

      <!-- SAĞ TARAF: KAYIT FORMU -->
      <div class="register-form-section">
        <div class="form-wrapper">
          <div class="form-header">
            <router-link to="/" class="logo-link">
              <h3>Altın Kuyumcu</h3>
            </router-link>
            <h1>Hesap Oluştur</h1>
            <p>Başlamak için bilgilerinizi doldurun.</p>
          </div>
          
          <form @submit.prevent="handleRegister">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">Adınız</label>
                <input type="text" id="firstName" v-model="form.firstName" required>
              </div>
              <div class="form-group">
                <label for="lastName">Soyadınız</label>
                <input type="text" id="lastName" v-model="form.lastName" required>
              </div>
            </div>
            <div class="form-group">
              <label for="email">E-posta Adresi</label>
              <input type="email" id="email" v-model="form.email" required>
            </div>
            <div class="form-group">
              <label for="password">Şifre</label>
              <input type="password" id="password" v-model="form.password" required>
            </div>
            <div class="form-group">
              <label for="confirmPassword">Şifre Tekrar</label>
              <input type="password" id="confirmPassword" v-model="form.confirmPassword" required>
            </div>
            
            <!-- Hata ve Başarı Mesajları -->
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
             <div v-if="successMessage" class="success-message">
              {{ successMessage }}
            </div>

            <button type="submit" class="btn-register" :disabled="isLoading">
              <span v-if="isLoading">Hesap Oluşturuluyor...</span>
              <span v-else>Kayıt Ol</span>
            </button>
          </form>

          <div class="login-link">
            <p>Zaten bir hesabınız var mı? <router-link to="/login">Giriş Yapın</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterPage',
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      isLoading: false,
      error: null,
      successMessage: null
    };
  },
  methods: {
    async handleRegister() {
      // Önce şifrelerin eşleşip eşleşmediğini kontrol et
      if (this.form.password !== this.form.confirmPassword) {
        this.error = 'Şifreler uyuşmuyor. Lütfen kontrol edin.';
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.successMessage = null;

      try {
        const API_BASE_URL = 'https://localhost:7001/api'; // Port numarasını kendi projenize göre güncelleyin.

        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: this.form.firstName,
            lastName: this.form.lastName,
            email: this.form.email,
            password: this.form.password,
            confirmPassword: this.form.confirmPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Kayıt sırasında bir hata oluştu.');
        }

        // Başarılı kayıt mesajını göster
        this.successMessage = data.message + ' Giriş sayfasına yönlendiriliyorsunuz...';

        // 3 saniye sonra kullanıcıyı login sayfasına yönlendir
        setTimeout(() => {
          this.$router.push('/login');
        }, 3000);

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
/* Login sayfasıyla büyük ölçüde aynı stiller kullanılarak marka bütünlüğü sağlandı */
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
}

.register-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Sol Taraf: Görsel */
.register-image-section {
  flex: 1;
  position: relative;
  min-height: 300px;
}
.register-image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.image-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2));
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40px;
}
.image-overlay h2 {
  font-family: 'Cinzel', serif;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.image-overlay p {
  font-size: 1.1rem;
  max-width: 80%;
}

/* Sağ Taraf: Form */
.register-form-section {
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
.form-row {
  display: flex;
  gap: 1rem;
}
.form-group {
  margin-bottom: 1.5rem;
  flex: 1;
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
.btn-register {
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
.btn-register:hover:not(:disabled) {
  background-color: #333;
}
.btn-register:disabled {
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

/* Giriş Linki */
.login-link {
  text-align: center;
  margin-top: 2rem;
  color: #666;
}
.login-link a {
  color: #D4AF37;
  font-weight: 600;
  text-decoration: none;
}

/* Mobil Uyum */
@media (min-width: 992px) {
  .register-container {
    flex-direction: row;
    min-height: 700px;
  }
}
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>
