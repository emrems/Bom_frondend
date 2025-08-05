<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-image-section">
        <img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1887&auto=format&fit=crop" alt="Kuyumcu Vitrini">
        <div class="image-overlay">
          <h2>Yeni Bir Parıltıya Merhaba Deyin</h2>
          <p>Ayrıcalıklı dünyamıza katılın ve size özel fırsatları keşfedin.</p>
        </div>
      </div>

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
              <label for="tcKimlikNo">TC Kimlik No</label>
              <input 
                type="text" 
                id="tcKimlikNo" 
                v-model="form.tcKimlikNo" 
                required
                pattern="[0-9]{11}"
                title="11 haneli TC kimlik numaranızı giriniz"
                @input="validateTC"
              >
              <small v-if="tcError" class="error-text">{{ tcError }}</small>
            </div>

            <div class="form-group">
              <label for="phoneNumber">Telefon Numarası</label>
              <input 
                type="tel" 
                id="phoneNumber" 
                v-model="form.phoneNumber" 
                required
                pattern="[0-9]{10}"
                title="10 haneli telefon numaranızı giriniz (örn: 5551234567)"
              >
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
            
            <!-- === YENİ EKLENEN KVKK ONAY KUTUSU === -->
            <div class="form-group kvkk-group">
              <input type="checkbox" id="kvkk" v-model="form.kvkkAccepted">
              <label for="kvkk" class="kvkk-label">
                <router-link to="/kvkk-aydinlatma-metni" target="_blank">KVKK Aydınlatma Metni</router-link>'ni okudum, kabul ediyorum.
              </label>
            </div>
            <!-- === KVKK BİTİŞ === -->
            
            <div v-if="error" class="error-message">
              <i class="fas fa-exclamation-circle"></i> {{ error }}
            </div>
             <div v-if="successMessage" class="success-message">
              <i class="fas fa-check-circle"></i> {{ successMessage }}
            </div>

            <!-- === KAYIT OL BUTONU GÜNCELLENDİ === -->
            <button type="submit" class="btn-register" :disabled="isLoading || tcError || !form.kvkkAccepted">
              <span v-if="isLoading">
                <i class="fas fa-spinner fa-spin"></i> Hesap Oluşturuluyor...
              </span>
              <span v-else>
                <i class="fas fa-user-plus"></i> Kayıt Ol
              </span>
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
import axios from 'axios';

export default {
  name: 'RegisterPage',
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        tcKimlikNo: '', 
        phoneNumber: '', 
        email: '',
        password: '',
        confirmPassword: '',
        kvkkAccepted: false // === YENİ EKLENDİ ===
      },
      isLoading: false,
      error: null,
      successMessage: null,
      tcError: null 
    };
  },
  methods: {
    validateTC() {
      const tcNo = this.form.tcKimlikNo;
      this.tcError = null;

      if (!tcNo) {
        return false;
      }
      
      if (tcNo.length !== 11 || !/^[0-9]+$/.test(tcNo)) {
        this.tcError = "TC Kimlik No 11 haneli rakamlardan oluşmalıdır.";
        return false;
      }

      if (tcNo[0] === '0') {
          this.tcError = "TC Kimlik Numarası '0' ile başlayamaz.";
          return false;
      }

      const digits = tcNo.split('').map(Number);
      
      const sumOdd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
      const sumEven = digits[1] + digits[3] + digits[5] + digits[7];
      const calculatedTenthDigit = (sumOdd * 7 - sumEven) % 10;

      if (calculatedTenthDigit !== digits[9]) {
        this.tcError = "Geçersiz TC Kimlik Numarası.";
        return false;
      }

      const sumFirstTen = digits.slice(0, 10).reduce((acc, val) => acc + val, 0); 
      const calculatedEleventhDigit = sumFirstTen % 10;
      
      if (calculatedEleventhDigit !== digits[10]) {
        this.tcError = "Geçersiz TC Kimlik Numarası.";
        return false;
      }
      
      this.tcError = null; 
      return true;
    },

    async handleRegister() {
      // === YENİ EKLENEN KVKK KONTROLÜ ===
      if (!this.form.kvkkAccepted) {
        this.error = 'Devam etmek için KVKK Aydınlatma Metni\'ni kabul etmelisiniz.';
        return;
      }

      if (this.form.password !== this.form.confirmPassword) {
        this.error = 'Şifreler uyuşmuyor. Lütfen kontrol edin.';
        return;
      }

      if (!this.validateTC()) {
        this.error = this.tcError || 'Lütfen geçerli bir TC kimlik numarası giriniz.';
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.successMessage = null;

      try {
        const API_BASE_URL = 'http://localhost:5294/api'; 

        const response = await axios.post(`${API_BASE_URL}/Auth/Register`, {
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          email: this.form.email,
          password: this.form.password,
          confirmPassword: this.form.confirmPassword,
          tcKimlikNo: this.form.tcKimlikNo, 
          phoneNumber: this.form.phoneNumber 
        });

        this.successMessage = response.data.message || 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...';

        setTimeout(() => {
          this.$router.push('/login');
        }, 3000);

      } catch (err) {
        if (err.response) {
          if (err.response.data.errors) {
            this.error = Object.values(err.response.data.errors).flat().join('\n');
          } else {
            this.error = err.response.data.message || 'Kayıt sırasında bir hata oluştu.';
          }
        } else {
          this.error = 'Sunucuyla bağlantı kurulamadı veya beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        }
        console.error('Kayıt hatası:', err);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
/* Font Awesome ikonları için */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Segoe+UI:wght@400;500;600;700&display=swap');


.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
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
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5); 
}
.image-overlay p {
  font-size: 1.1rem;
  max-width: 80%;
  line-height: 1.6;
}

/* Sağ Taraf: Form */
.register-form-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-color: #fcfcfc; 
}
.form-wrapper {
  width: 100%;
  max-width: 450px; 
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
  font-size: 1.8rem; 
  margin-bottom: 1.5rem;
  color: #D4AF37; 
}
.form-header h1 {
  font-size: 2.2rem; 
  margin-bottom: 0.5rem;
  color: #343a40; 
}
.form-header p {
  color: #6c757d; 
  font-size: 0.95rem;
}

/* Form Elemanları */
.form-row {
  display: flex;
  gap: 15px; 
}
.form-group {
  margin-bottom: 1rem; 
  flex: 1;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500; 
  color: #495057; 
  font-size: 0.9rem;
}
.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ced4da; 
  border-radius: 8px; 
  font-size: 1rem;
  background-color: #ffffff; 
  transition: all 0.3s ease;
  color: #343a40; 
}
.form-group input:focus {
  outline: none;
  border-color: #D4AF37; 
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
}

/* === YENİ KVKK GRUBU İÇİN STİLLER === */
.kvkk-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 1rem; /* Butonla arasını açmak için */
  margin-bottom: 1.5rem; /* Hata mesajıyla arasını açmak için */
}
.kvkk-group input[type="checkbox"] {
  width: auto;
  flex-shrink: 0;
  margin-top: -2px; /* Dikeyde hizalamak için küçük ayar */
}
.kvkk-label {
  font-size: 0.85rem;
  color: #495057;
  font-weight: 400;
  margin-bottom: 0; /* Üstteki label'dan gelen boşluğu sıfırla */
}
.kvkk-label a {
  color: #D4AF37;
  text-decoration: none;
  font-weight: 600;
}
.kvkk-label a:hover {
  text-decoration: underline;
}
/* === KVKK STİLLERİ BİTİŞ === */


.btn-register {
  width: 100%;
  padding: 14px 20px; 
  background-color: #D4AF37; 
  color: #fff;
  border: none;
  border-radius: 8px; 
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease; 
  margin-top: 1rem; 
  display: flex; 
  align-items: center;
  justify-content: center;
}
.btn-register:hover:not(:disabled) {
  background-color: #c09a25; 
  transform: translateY(-2px); 
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.btn-register:disabled {
  background-color: #e6d8b6; 
  cursor: not-allowed;
}

/* Yeni Hata Mesajı Stili (TC için) */
.error-text {
  color: #dc3545; 
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: block;
}

/* Hata ve Başarı Mesajları */
.error-message, .success-message {
  border: 1px solid;
  padding: 12px 15px; 
  border-radius: 8px; 
  text-align: left; 
  margin-top: 0; /* Butonla arasındaki boşluğu sıfırla, KVKK grubundan alsın */
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  display: flex; 
  align-items: center;
  gap: 10px; 
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

/* Font Awesome ikonları için stil */
.error-message i, .success-message i, .btn-register i {
  margin-right: 8px; 
  font-size: 1rem;
}
.btn-register i {
  margin-right: 10px;
}

/* Giriş Linki */
.login-link {
  text-align: center;
  margin-top: 2rem;
  color: #6c757d; 
  font-size: 0.95rem;
}
.login-link a {
  color: #D4AF37; 
  font-weight: 600;
  text-decoration: none;
}
.login-link a:hover {
  text-decoration: underline; 
}

/* Mobil Uyum */
@media (min-width: 992px) {
  .register-container {
    flex-direction: row; 
    min-height: 700px; 
  }
}
@media (max-width: 991px) { 
  .register-container {
    flex-direction: column; 
  }
  .register-image-section {
    min-height: 250px; 
  }
  .image-overlay {
    padding: 30px;
  }
  .image-overlay h2 {
    font-size: 2rem;
  }
  .image-overlay p {
    font-size: 1rem;
  }
  .register-form-section {
    padding: 30px;
  }
  .form-header {
    margin-bottom: 2rem;
  }
}

@media (max-width: 576px) { 
  .form-row {
    flex-direction: column; 
    gap: 0; 
  }
  .form-group {
    margin-bottom: 1rem; 
  }
  .register-page {
    padding: 10px;
  }
  .register-form-section {
    padding: 20px;
  }
  .form-header h1 {
    font-size: 1.8rem;
  }
  .form-header h3 {
    font-size: 1.4rem;
  }
}
</style>
