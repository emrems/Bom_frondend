<template>
  <div class="user-profile-wrapper">
    <div class="user-profile-card">
      <div class="profile-header">
        <i class="fas fa-user-circle profile-avatar"></i>
        <h2 class="profile-greeting">Hoş Geldiniz, {{ user ? user.firstName : 'Kullanıcı' }}!</h2>
      </div>

      <div v-if="loading" class="info-message loading-state">
        <i class="fas fa-spinner fa-spin"></i> Bilgileriniz yükleniyor...
      </div>

      <div v-if="error" class="info-message error-state">
        <i class="fas fa-exclamation-triangle"></i> {{ error }}
        <p v-if="error === 'Yetkisiz erişim. Lütfen giriş yapın.'">
          <router-link to="/login" class="action-link">Giriş sayfasına gitmek için tıklayın.</router-link>
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
          <button @click="openEditProfileModal" class="action-button primary-button">
            <i class="fas fa-key"></i> Profili Düzenle
          </button>
          <button @click="changePassword" class="action-button secondary-button">
            <i class="fas fa-key"></i> Şifre Değiştir
          </button>
        </div>
      </div>
    </div>

    <div v-if="showEditProfileModal" class="modal-overlay" @click.self="closeEditProfileModal">
      <div class="modal-content">
        <button class="modal-close-button" @click="closeEditProfileModal">&times;</button>
        <h3>Profil Bilgilerini Düzenle</h3>
        <form @submit.prevent="submitProfileUpdate">
          <div class="form-group">
            <label for="firstName">Adınız</label>
            <input type="text" id="firstName" v-model="editProfileForm.firstName" required>
          </div>
          <div class="form-group">
            <label for="lastName">Soyadınız</label>
            <input type="text" id="lastName" v-model="editProfileForm.lastName" required>
          </div>
          <div class="form-group">
            <label for="phoneNumber">Telefon Numaranız (İsteğe Bağlı)</label>
            <input type="tel" id="phoneNumber" v-model="editProfileForm.phoneNumber">
          </div>
          <div class="modal-buttons">
            <button type="submit" class="action-button primary-button" :disabled="isUpdatingProfile">
              <i v-if="isUpdatingProfile" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-save"></i>
              {{ isUpdatingProfile ? 'Kaydediliyor...' : 'Kaydet' }}
            </button>
            <button type="button" class="action-button secondary-button" @click="closeEditProfileModal" :disabled="isUpdatingProfile">
              İptal
            </button>
          </div>
          <div v-if="profileUpdateError" class="modal-error-message">{{ profileUpdateError }}</div>
          <div v-if="profileUpdateSuccess" class="modal-success-message">{{ profileUpdateSuccess }}</div>
        </form>
      </div>
    </div>
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
      apiBaseUrl: 'http://localhost:5294/api',
      
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
          this.$router.push('/login'); 
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
        } else {
          this.profileUpdateError = 'Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.';
        }
        if (err.response && err.response.status === 401) {
          this.logout();
          this.$router.push('/login');
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
/* Genel Stil Ayarları */
:root {
  --primary-gold: #d4af37; /* Altın rengi */
  --dark-gold: #b8860b;   /* Koyu altın */
  --light-grey: #f8f8f8;  /* Çok açık gri */
  --medium-grey: #e0e0e0; /* Orta gri */
  --dark-grey: #333;     /* Koyu gri metin */
  --text-light-grey: #666; /* Açık gri metin */
  --shadow-light: rgba(0, 0, 0, 0.08); /* Hafif gölge */
  --shadow-medium: rgba(0, 0, 0, 0.15); /* Orta gölge */
  --transition-speed: 0.3s ease;
}

.user-profile-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 80px);
  padding: 40px 20px;
  background: linear-gradient(to bottom right, var(--light-grey), #f0f0f0);
}

.user-profile-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px var(--shadow-medium);
  padding: 40px;
  width: 100%;
  max-width: 600px;
  text-align: center;
  border: 1px solid var(--medium-grey);
}

/* Header Bölümü */
.profile-header {
  margin-bottom: 30px;
}

.profile-avatar {
  font-size: 80px;
  color: var(--primary-gold);
  margin-bottom: 15px;
  transition: transform var(--transition-speed);
}
.profile-avatar:hover {
  transform: scale(1.05);
}

.profile-greeting {
  font-size: 2.2rem;
  color: var(--dark-grey);
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.02em;
}

/* Bilgi Mesajları (Yükleme/Hata) */
.info-message {
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 500;
  font-size: 1.1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.loading-state {
  background-color: #e3f2fd;
  color: #2196f3;
  border: 1px solid #90caf9;
}

.error-state {
  background-color: #ffebee;
  color: #ef5350;
  border: 1px solid #ef9a9a;
}

.action-link {
  color: #c62828;
  font-weight: bold;
  text-decoration: underline;
  margin-left: 5px;
  transition: color var(--transition-speed);
}
.action-link:hover {
  color: #b71c1c;
}

/* Profil Detayları Bölümü */
.profile-details-section {
  text-align: left;
  margin-bottom: 30px;
}

.detail-group {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--medium-grey);
}
.detail-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.detail-label {
  display: block;
  font-size: 0.95rem;
  color: var(--text-light-grey);
  font-weight: 500;
  margin-bottom: 8px;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}

.detail-value {
  font-size: 1.3rem;
  color: var(--dark-grey);
  font-weight: 600;
  margin: 0;
  word-break: break-all;
}

/* Aksiyon Butonları (Genel) */
.profile-actions-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 30px;
}

.action-button {
  padding: 14px 25px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-speed);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-decoration: none;
  color: white !important; /* Metin rengini kesinlikle beyaz yapıyoruz */
}

.primary-button {
  background-color: var(--primary-gold);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}
.primary-button:hover:not(:disabled) {
  background-color: var(--dark-gold);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
}
.primary-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
  color: #666 !important;
}

.secondary-button {
  background-color: #6c757d;
  box-shadow: 0 5px 15px rgba(108, 117, 125, 0.2);
}
.secondary-button:hover:not(:disabled) {
  background-color: #5a6268;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(108, 117, 125, 0.3);
}
.secondary-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
  color: #666 !important;
}

/* Modal Stilleri */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  position: relative;
  text-align: left;
  animation: modalFadeIn 0.3s ease-out forwards;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: var(--text-light-grey);
  transition: color 0.2s ease;
}
.modal-close-button:hover {
  color: var(--dark-grey);
}

.modal-content h3 {
  font-size: 1.8rem;
  color: var(--dark-grey);
  margin-bottom: 25px;
  text-align: center;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.95rem;
  color: var(--text-light-grey);
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input[type="text"],
.form-group input[type="tel"] {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid var(--medium-grey);
  border-radius: 6px;
  font-size: 1rem;
  color: var(--dark-grey);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: var(--primary-gold);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
  outline: none;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}

.modal-content .action-button {
  width: auto;
  padding: 10px 20px;
  font-size: 1rem;
  margin: 0;
}

.modal-error-message, .modal-success-message {
  margin-top: 20px;
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 0.95rem;
  text-align: center;
}

.modal-error-message {
  background-color: #ffe0e0;
  color: #d32f2f;
  border: 1px solid #ef9a9a;
}

.modal-success-message {
  background-color: #e8f5e9;
  color: #388e3c;
  border: 1px solid #a5d6a7;
}

/* Responsive Ayarlamalar */
@media (max-width: 768px) {
  .user-profile-wrapper {
    padding: 20px 15px;
  }
  .user-profile-card {
    padding: 30px 20px;
    border-radius: 10px;
  }
  .profile-greeting {
    font-size: 1.8rem;
  }
  .profile-avatar {
    font-size: 60px;
  }
  .detail-value {
    font-size: 1.1rem;
  }
  .action-button {
    font-size: 1rem;
    padding: 12px 20px;
  }
  .modal-content {
    padding: 25px;
  }
  .modal-content h3 {
    font-size: 1.5rem;
  }
  .modal-buttons {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .modal-content .action-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .user-profile-card {
    padding: 25px 15px;
  }
  .profile-greeting {
    font-size: 1.6rem;
  }
  .profile-avatar {
    font-size: 50px;
  }
  .detail-label {
    font-size: 0.85rem;
  }
  .detail-value {
    font-size: 1rem;
  }
  .action-button {
    font-size: 0.95rem;
    padding: 10px 15px;
  }
}
</style>