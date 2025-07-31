<template>
  <div class="user-profile-page">
    <div class="container">
      <div class="user-profile-card">
        <div class="profile-header">
          <i class="fas fa-user-circle profile-avatar"></i>
          <h2 class="profile-greeting">Hoş Geldiniz, {{ user ? user.firstName : 'Kullanıcı' }}!</h2>
        </div>

        <div v-if="loading" class="alert-message loading-status">
          <i class="fas fa-spinner fa-spin icon-spin"></i> Bilgileriniz yükleniyor...
        </div>

        <div v-if="error" class="alert-message error-status">
          <i class="fas fa-exclamation-triangle icon-alert"></i> {{ error }}
          <p v-if="error.includes('Yetkisiz erişim') || error.includes('Oturum süreniz doldu')" class="mt-2">
            <router-link to="/login" class="alert-action-link">Giriş sayfasına gitmek için tıklayın.</router-link>
          </p>
        </div>

        <div v-if="user" class="profile-details-section">
          <div class="detail-group">
            <span class="detail-label">Adınız Soyadınız</span>
            <p class="detail-value">{{ user.firstName }} {{ user.lastName }}</p>
          </div>

          <div class="detail-group">
            <span class="detail-label">E-posta Adresiniz</span>
            <p class="detail-value">{{ user.email }}</p>
          </div>

          <div class="detail-group" v-if="user.role">
            <span class="detail-label">Hesap Rolünüz</span>
            <p class="detail-value">{{ user.role }}</p>
          </div>

          <div class="profile-actions-section">
            <button @click="openEditProfileModal" class="app-button ">
              <i class="fas fa-edit icon-button"></i> Profili Düzenle
            </button>
            <button @click="changePassword" class="app-button secondary-button">
              <i class="fas fa-key icon-button"></i> Şifre Değiştir
            </button>
          </div>
        </div>
      </div>
    </div>

    <transition name="modal-fade">
      <div v-if="showEditProfileModal" class="modal-overlay" @click.self="closeEditProfileModal">
        <div class="modal-content">
          <button class="modal-close-button" @click="closeEditProfileModal">&times;</button>
          <h3>Profil Bilgilerini Düzenle</h3>
          <form @submit.prevent="submitProfileUpdate">
            <div class="form-group">
              <label for="firstName">Adınız</label>
              <input type="text" id="firstName" v-model="editProfileForm.firstName" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="lastName">Soyadınız</label>
              <input type="text" id="lastName" v-model="editProfileForm.lastName" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="phoneNumber">Telefon Numaranız (İsteğe Bağlı)</label>
              <input type="tel" id="phoneNumber" v-model="editProfileForm.phoneNumber" class="form-input">
            </div>
            <div class="modal-buttons">
              <button type="submit" class="app-button " :disabled="isUpdatingProfile">
                <i v-if="isUpdatingProfile" class="fas fa-spinner fa-spin icon-button"></i>
                <i v-else class="fas fa-save icon-button"></i>
                {{ isUpdatingProfile ? 'Kaydediliyor...' : 'Kaydet' }}
              </button>
              <button type="button" class="app-button secondary-button" @click="closeEditProfileModal" :disabled="isUpdatingProfile">
                İptal
              </button>
            </div>
            <div v-if="profileUpdateError" class="alert-message error-status modal-message">{{ profileUpdateError }}</div>
            <div v-if="profileUpdateSuccess" class="alert-message success-status modal-message">{{ profileUpdateSuccess }}</div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'UserProfile',
  data() {
    return {
      user: null,
      loading: false,
      error: null,
      apiBaseUrl: 'https://localhost:7135/api',
      
      showEditProfileModal: false,
      editProfileForm: {
        firstName: '',
        lastName: '',
        phoneNumber: ''
      },
      isUpdatingProfile: false,
      profileUpdateError: null,
      profileUpdateSuccess: null
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  watch: {
    isAuthenticated(newVal) {
      if (newVal) {
        this.fetchUserProfile();
      } else {
        this.user = null;
        this.error = 'Lütfen giriş yapın.'; 
      }
    }
  },
  methods: {
    ...mapActions(['logout']),

    async fetchUserProfile() {
      this.loading = true;
      this.error = null;
      try {
        if (!this.isAuthenticated) {
          this.error = 'Yetkisiz erişim. Lütfen giriş yapın.';
          if (this.$route.path !== '/login') { 
            this.$router.push('/login'); 
          }
          return;
        }

        const token = this.$store.state.token;

        const response = await axios.get(`${this.apiBaseUrl}/Auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.user = response.data;
        this.editProfileForm.firstName = this.user.firstName || '';
        this.editProfileForm.lastName = this.user.lastName || '';
        this.editProfileForm.phoneNumber = this.user.phoneNumber || '';
      } catch (err) {
        console.error('Kullanıcı bilgileri yüklenirken hata:', err);
        if (err.response && err.response.status === 401) {
          this.error = 'Oturum süreniz doldu veya yetkiniz yok. Lütfen tekrar giriş yapın.';
          this.logout(); 
          this.$router.push('/login');
        } else if (err.response && err.response.data && err.response.data.message) {
            this.error = err.response.data.message;
        } else {
          this.error = 'Kullanıcı bilgileri alınamadı. Lütfen daha sonra tekrar deneyin.';
        }
        this.user = null; 
      } finally {
        this.loading = false;
      }
    },
    
    openEditProfileModal() {
      if (this.user) {
        this.editProfileForm.firstName = this.user.firstName || '';
        this.editProfileForm.lastName = this.user.lastName || '';
        this.editProfileForm.phoneNumber = this.user.phoneNumber || '';
      }
      this.profileUpdateError = null; 
      this.profileUpdateSuccess = null; 
      this.showEditProfileModal = true;
    },
    closeEditProfileModal() {
      this.showEditProfileModal = false;
      this.profileUpdateError = null;
      this.profileUpdateSuccess = null;
    },
    async submitProfileUpdate() {
      this.isUpdatingProfile = true;
      this.profileUpdateError = null;
      this.profileUpdateSuccess = null;
      try {
        const token = this.$store.state.token;
        const payload = {
          firstName: this.editProfileForm.firstName,
          lastName: this.editProfileForm.lastName,
          phoneNumber: this.editProfileForm.phoneNumber
        };

        await axios.put(`${this.apiBaseUrl}/Auth/me`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        this.profileUpdateSuccess = 'Profiliniz başarıyla güncellendi!';
        await this.fetchUserProfile(); 
        setTimeout(() => {
          this.closeEditProfileModal(); 
        }, 1500); 
      } catch (err) {
        console.error('Profil güncellenirken hata:', err);
        if (err.response && err.response.data && err.response.data.message) {
          this.profileUpdateError = err.response.data.message;
        } else if (err.response && err.response.status === 401) {
          this.profileUpdateError = 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.';
          this.logout();
          this.$router.push('/login');
        } else {
          this.profileUpdateError = 'Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.';
        }
      } finally {
        this.isUpdatingProfile = false;
      }
    },

    changePassword() {
      alert('Şifre değiştirme özelliği yakında!'); 
    }
  },
  mounted() {
    this.fetchUserProfile();
  }
};
</script>

<style scoped>
/* Font Awesome ikonları için */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

/* CSS Variables */
:root {
  --primary-gold: #d4af37; /* Altın rengi */
  --dark-gold: #b8860b;   /* Koyu altın */
  --light-bg: #fdfdfd;    /* Çok açık gri arka plan */
  --medium-grey-border: #e0e0e0; /* Orta gri kenarlık */
  --dark-text: #333;      /* Koyu gri metin */
  --light-text: #666;     /* Açık gri metin */
  --success-color: #28a745; /* Yeşil */
  --error-color: #dc3545;   /* Kırmızı */
  --shadow-base: rgba(0, 0, 0, 0.1);
  --shadow-hover: rgba(0, 0, 0, 0.15);
  --transition-fast: 0.2s ease;
  --transition-medium: 0.3s ease;
}

/* Genel Kapsayıcı ve Arka Plan */
.user-profile-page {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* İçeriğin yukarıda başlamasını sağlar */
  min-height: calc(100vh - 80px); /* Header ve footer boşluğunu dikkate alır */
  padding: 60px 20px; /* Daha fazla padding */
  background: linear-gradient(to bottom right, var(--light-bg), #f0f2f5); /* Hafif degrade arka plan */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--dark-text);
}

.container {
  max-width: 1200px; /* Genişlik kontrolü */
  width: 100%;
  margin: 0 auto;
}

/* Profil Kartı */
.user-profile-card {
  background-color: #ffffff;
  border-radius: 16px; /* Daha yuvarlak köşeler */
  box-shadow: 0 15px 45px var(--shadow-base); /* Daha derin gölge */
  padding: 45px; /* Daha fazla iç boşluk */
  width: 100%;
  max-width: 650px; /* Daha geniş kart */
  margin: 0 auto; /* Ortala */
  text-align: center;
  border: 1px solid var(--medium-grey-border);
  overflow: hidden; /* İçerik taşmasını engelle */
}

/* Profil Başlık Bölümü */
.profile-header {
  margin-bottom: 40px; /* Daha fazla boşluk */
  border-bottom: 1px solid var(--medium-grey-border); /* Alt çizgi */
  padding-bottom: 30px;
}

.profile-avatar {
  font-size: 90px; /* Daha büyük ikon */
  color: var(--primary-gold);
  margin-bottom: 18px;
  transition: transform var(--transition-medium);
  display: block; /* Ortalamak için */
}

.profile-avatar:hover {
  transform: scale(1.08) rotate(5deg); /* Hafif dönüş ve büyüme */
}

.profile-greeting {
  font-size: 2.5rem; /* Daha büyük karşılama metni */
  color: var(--dark-text);
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.02em; /* Hafif sıkıştırma */
}

/* Alert Mesajları (Yükleme/Hata/Başarı) */
.alert-message {
  padding: 18px 25px; /* Daha büyük padding */
  border-radius: 10px; /* Daha yuvarlak köşeler */
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 12px; /* İkon ve metin arası boşluk */
  font-weight: 500;
  font-size: 1.1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  animation: fadeInDown 0.5s ease-out; /* Giriş animasyonu */
}
@keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

.loading-status {
  background-color: #e0f2f7; /* Açık mavi */
  color: #0288d1; /* Koyu mavi */
  border: 1px solid #b3e5fc;
}

.error-status {
  background-color: #ffebee; /* Açık kırmızı */
  color: var(--error-color);
  border: 1px solid #ef9a9a;
}

.success-status {
  background-color: #e8f5e9; /* Açık yeşil */
  color: var(--success-color);
  border: 1px solid #a5d6a7;
}

.icon-spin, .icon-alert, .icon-success {
  font-size: 1.4rem; /* İkon boyutu */
}

.alert-action-link {
  color: var(--error-color); /* Kırmızı link */
  font-weight: bold;
  text-decoration: underline;
  margin-left: 5px;
  transition: color var(--transition-fast);
}
.alert-action-link:hover {
  color: #c62828;
}

.modal-message { /* Modal içindeki mesajlar için ek stil */
    margin-top: 20px;
    margin-bottom: 0; /* Modal içinde alt boşluğu kaldır */
}

/* Profil Detayları Bölümü */
.profile-details-section {
  text-align: left;
  margin-top: 30px; /* Header ile boşluk */
}

.detail-group {
  margin-bottom: 25px; /* Detay grupları arası boşluk */
  padding-bottom: 20px;
  border-bottom: 1px dashed var(--medium-grey-border); /* Kesikli çizgi */
  transition: all var(--transition-fast);
}
.detail-group:hover {
    background-color: rgba(212, 175, 55, 0.03); /* Hafif hover efekti */
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 5px;
}
.detail-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.detail-label {
  display: block;
  font-size: 0.9rem; /* Biraz daha küçük etiket */
  color: var(--light-text);
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 0.05em; /* Daha geniş harf aralığı */
  text-transform: uppercase;
}

.detail-value {
  font-size: 1.25rem; /* Biraz daha küçük değer */
  color: var(--dark-text);
  font-weight: 700;
  margin: 0;
  word-break: break-all;
  line-height: 1.4;
}

/* Aksiyon Butonları */
.profile-actions-section {
  display: flex;
  flex-wrap: wrap; /* Mobil uyumluluk için */
  justify-content: center; /* Butonları ortala */
  gap: 20px; /* Butonlar arası boşluk */
  margin-top: 40px; /* Detaylar ile boşluk */
}

.app-button {
  padding: 15px 30px; /* Daha dolgun butonlar */
  border: none;
  border-radius: 10px; /* Daha yuvarlak köşeler */
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-decoration: none;
  /* Metin rengini burada daha net tanımlayalım */
}

.icon-button {
    font-size: 1.15em; /* İkonu metne göre boyutlandır */
}

.primary-button {
  background-color: var(--primary-gold);
  box-shadow: 0 6px 18px rgba(212, 175, 55, 0.35); /* Daha güçlü gölge */
  color: #fff; /* Altın buton için beyaz metin */
}
.primary-button:hover:not(:disabled) {
  background-color: var(--dark-gold);
  transform: translateY(-4px); 
  box-shadow: 0 10px 25px rgba(212, 175, 55, 0.45);
}
.primary-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
  color: #999; /* Disabled primary button için açık gri metin */
}

.secondary-button {
  background-color: #6c757d; /* Koyu gri buton */
  box-shadow: 0 6px 18px rgba(108, 117, 125, 0.25);
  color: #fff; /* Gri buton için beyaz metin */
}
.secondary-button:hover:not(:disabled) {
  background-color: #5a6268;
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(108, 117, 125, 0.35);
}
.secondary-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
  color: #999; /* Disabled secondary button için açık gri metin */
}

/* Modal Stilleri */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Daha koyu arka plan */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 35px; /* Daha fazla iç boşluk */
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4); /* Daha belirgin modal gölgesi */
  width: 95%; /* Mobilde daha geniş */
  max-width: 550px; /* Max genişlik */
  position: relative;
  text-align: left;
  animation: modalFadeIn 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); /* Yumuşak animasyon */
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(-50px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.4s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}


.modal-close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 32px; /* Daha büyük kapatma butonu */
  cursor: pointer;
  color: var(--light-text);
  transition: color var(--transition-fast);
}
.modal-close-button:hover {
  color: var(--dark-text);
}

.modal-content h3 {
  font-size: 2rem; /* Daha büyük başlık */
  color: var(--dark-text);
  margin-bottom: 30px;
  text-align: center;
  font-weight: 700;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.95rem;
  color: var(--light-text);
  margin-bottom: 8px;
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 13px 18px; /* Daha büyük inputlar */
  border: 1px solid var(--medium-grey-border);
  border-radius: 8px; /* Daha yuvarlak inputlar */
  font-size: 1.05rem;
  color: var(--dark-text);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  box-sizing: border-box;
}

.form-input:focus {
  border-color: var(--primary-gold);
  box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.25); /* Daha belirgin odak */
  outline: none;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px; /* Butonlar arası boşluk */
  margin-top: 30px;
}

.modal-content .app-button {
  width: auto; /* Otomatik genişlik */
  padding: 12px 25px;
  font-size: 1rem;
  margin: 0;
}

/* Responsive Ayarlamalar */
@media (max-width: 768px) {
  .user-profile-page {
    padding: 30px 15px;
  }
  .user-profile-card {
    padding: 30px 25px;
    border-radius: 12px;
  }
  .profile-greeting {
    font-size: 2rem;
  }
  .profile-avatar {
    font-size: 70px;
  }
  .detail-value {
    font-size: 1.15rem;
  }
  .app-button {
    font-size: 0.95rem;
    padding: 12px 20px;
  }
  .modal-content {
    padding: 30px 20px;
  }
  .modal-content h3 {
    font-size: 1.7rem;
  }
  .modal-buttons {
    flex-direction: column;
    align-items: stretch; /* Tam genişlikte olsunlar */
    gap: 10px;
  }
  .modal-content .app-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .user-profile-card {
    padding: 25px 15px;
  }
  .profile-greeting {
    font-size: 1.8rem;
  }
  .profile-avatar {
    font-size: 60px;
  }
  .detail-label {
    font-size: 0.8rem;
  }
  .detail-value {
    font-size: 1.05rem;
  }
  .app-button {
    font-size: 0.9rem;
    padding: 10px 15px;
  }
  
  .modal-content h3 {
    font-size: 1.5rem;
  }
}
</style>