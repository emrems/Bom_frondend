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
            <button @click="openEditProfileModal" class="app-button">
              <i class="fas fa-edit icon-button"></i> Profili Düzenle
            </button>
            <button @click="openAddressModal" class="app-button">
              <i class="fas fa-map-marker-alt icon-button"></i> Adreslerimi Yönet
            </button>
            <!-- GÜNCELLENDİ: Metot adı daha anlaşılır olacak şekilde değiştirildi -->
            <button @click="openPasswordModal" class="app-button secondary-button">
              <i class="fas fa-key icon-button"></i> Şifre Değiştir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mevcut Profil Düzenleme Modalı -->
    <transition name="modal-fade">
      <div v-if="showEditProfileModal" class="modal-overlay" @click.self="closeEditProfileModal">
        <div class="modal-content">
          <button class="modal-close-button" @click="closeEditProfileModal">×</button>
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

    <!-- Mevcut Adres Yönetimi Modalı -->
    <transition name="modal-fade">
      <div v-if="showAddressModal" class="modal-overlay" @click.self="closeAddressModal">
        <div class="modal-content">
          <button class="modal-close-button" @click="closeAddressModal">×</button>
          <h3>Adres Yönetimi</h3>

          <div v-if="addressError" class="alert-message error-status modal-message">{{ addressError }}</div>
          <div v-if="!isEditingOrAddingAddress">
             <div v-if="loadingAddresses" class="loading-status alert-message">
              <i class="fas fa-spinner fa-spin"></i> Adresler yükleniyor...
            </div>
            <div v-else>
              <ul v-if="addresses.length > 0" class="address-list">
                <li v-for="address in addresses" :key="address.id" class="address-item">
                  <div class="address-details">
                    <strong>{{ address.addressTitle }}</strong>
                    <p>{{ address.fullAddress }}, {{ address.district }} / {{ address.city }}</p>
                    <p>{{ address.contactName }} - {{ address.phoneNumber }}</p>
                  </div>
                  <div class="address-actions">
                    <button @click="startEditAddress(address)" class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
                    <button @click="confirmDeleteAddress(address.id)" class="action-btn delete-btn"><i class="fas fa-trash"></i></button>
                  </div>
                </li>
              </ul>
              <div v-else class="alert-message">
                <i class="fas fa-info-circle"></i> Kayıtlı adresiniz bulunmamaktadır.
              </div>
              <div class="modal-buttons mt-4">
                <button @click="startAddNewAddress" class="app-button primary-button">
                  <i class="fas fa-plus"></i> Yeni Adres Ekle
                </button>
              </div>
            </div>
          </div>
          <div v-else>
            <form @submit.prevent="handleSaveAddress">
              <div class="form-group">
                <label for="addressTitle">Adres Başlığı</label>
                <input type="text" id="addressTitle" v-model="addressForm.addressTitle" class="form-input" required placeholder="Ev, İşyeri vb.">
              </div>
              <div class="form-group">
                <label for="contactName">İsim Soyisim</label>
                <input type="text" id="contactName" v-model="addressForm.contactName" class="form-input" required>
              </div>
              <div class="form-group">
                <label for="phoneNumber">Telefon Numarası</label>
                <input type="tel" id="phoneNumber" v-model="addressForm.phoneNumber" class="form-input" required>
              </div>
              <div class="form-group">
                <label for="city">Şehir</label>
                <select id="city" v-model="locationData.selectedCityId" @change="onCityChange" class="form-input" required :disabled="loadingLocations.cities">
                  <option disabled :value="null">{{ loadingLocations.cities ? 'Şehirler Yükleniyor...' : 'Lütfen bir şehir seçin' }}</option>
                  <option v-for="city in cities" :key="city.id" :value="city.id">
                    {{ city.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label for="district">İlçe</label>
                <select id="district" v-model="addressForm.district" class="form-input" required :disabled="!locationData.selectedCityId || loadingLocations.districts">
                  <option disabled value="">{{ loadingLocations.districts ? 'İlçeler Yükleniyor...' : 'Lütfen bir ilçe seçin' }}</option>
                  <option v-for="district in districts" :key="district.id" :value="district.name">
                    {{ district.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label for="fullAddress">Açık Adres</label>
                <textarea id="fullAddress" v-model="addressForm.fullAddress" class="form-input" rows="3" required></textarea>
              </div>
              <div class="form-group">
                <label for="postalCode">Posta Kodu</label>
                <input type="text" id="postalCode" v-model="addressForm.postalCode" class="form-input">
              </div>
              <div class="modal-buttons">
                <button type="submit" class="app-button primary-button" :disabled="isSavingAddress">
                  <i v-if="isSavingAddress" class="fas fa-spinner fa-spin"></i>
                  <i v-else class="fas fa-save"></i>
                  {{ isSavingAddress ? 'Kaydediliyor...' : 'Kaydet' }}
                </button>
                <button type="button" class="app-button secondary-button" @click="cancelEditOrAddAddress">İptal</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>

    <!-- ====================================================== -->
    <!-- YENİ EKLENEN ŞİFRE DEĞİŞTİRME MODALI -->
    <!-- ====================================================== -->
    <transition name="modal-fade">
      <div v-if="showPasswordModal" class="modal-overlay" @click.self="closePasswordModal">
        <div class="modal-content">
          <button class="modal-close-button" @click="closePasswordModal">×</button>
          <h3>Şifre Değiştir</h3>
          <form @submit.prevent="submitPasswordUpdate">
            <div class="form-group">
              <label for="oldPassword">Mevcut Şifreniz</label>
              <input type="password" id="oldPassword" v-model="passwordForm.oldPassword" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="newPassword">Yeni Şifreniz</label>
              <input type="password" id="newPassword" v-model="passwordForm.newPassword" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="confirmNewPassword">Yeni Şifreniz (Tekrar)</label>
              <input type="password" id="confirmNewPassword" v-model="passwordForm.confirmNewPassword" class="form-input" required>
            </div>
            <div class="modal-buttons">
              <button type="submit" class="app-button primary-button" :disabled="isUpdatingPassword">
                <i v-if="isUpdatingPassword" class="fas fa-spinner fa-spin icon-button"></i>
                <i v-else class="fas fa-save icon-button"></i>
                {{ isUpdatingPassword ? 'Güncelleniyor...' : 'Şifreyi Güncelle' }}
              </button>
              <button type="button" class="app-button secondary-button" @click="closePasswordModal" :disabled="isUpdatingPassword">
                İptal
              </button>
            </div>
            <div v-if="passwordUpdateError" class="alert-message error-status modal-message">{{ passwordUpdateError }}</div>
            <div v-if="passwordUpdateSuccess" class="alert-message success-status modal-message">{{ passwordUpdateSuccess }}</div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';

const initialAddressFormState = {
  id: null,
  addressTitle: '',
  contactName: '',
  phoneNumber: '',
  city: '',
  district: '',
  fullAddress: '',
  postalCode: '',
};

// YENİ: Şifre formu için başlangıç state'i eklendi.
const initialPasswordFormState = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: ''
};

export default {
  name: 'UserProfile',
  data() {
    return {
      // Mevcut datalarınız
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
      profileUpdateSuccess: null,

      // Adres Yönetimi Dataları
      showAddressModal: false,
      addresses: [],
      loadingAddresses: false,
      addressError: null,
      isEditingOrAddingAddress: false,
      isSavingAddress: false,
      addressForm: { ...initialAddressFormState },
      editingAddressId: null,

      // Lokasyon Dataları
      cities: [],
      districts: [],
      locationData: {
        selectedCountryId: 1, 
        selectedCityId: null,
      },
      loadingLocations: {
        cities: false,
        districts: false,
      },

      // ======================================================
      // YENİ EKLENEN ŞİFRE DEĞİŞTİRME DATA DEĞİŞKENLERİ
      // ======================================================
      showPasswordModal: false,
      isUpdatingPassword: false,
      passwordUpdateError: null,
      passwordUpdateSuccess: null,
      passwordForm: { ...initialPasswordFormState },
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
    },
    'locationData.selectedCityId'(newCityId, oldCityId) {
      if (newCityId !== oldCityId) {
        this.addressForm.district = '';
        this.districts = [];
        if (newCityId) {
          this.fetchDistricts(newCityId);
        }
      }
    }
  },
  methods: {
    ...mapActions(['logout']),

    // Mevcut metodlarınız (hiçbir değişiklik yok)
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

    // GÜNCELLENDİ: Bu metot artık 'openPasswordModal' olarak değiştirildi
    openPasswordModal() {
      this.passwordForm = { ...initialPasswordFormState };
      this.passwordUpdateError = null;
      this.passwordUpdateSuccess = null;
      this.showPasswordModal = true;
    },

    // YENİ: Şifre modalını kapatmak için
    closePasswordModal() {
      this.showPasswordModal = false;
    },

    // YENİ: Şifre güncelleme formunu göndermek için
    async submitPasswordUpdate() {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmNewPassword) {
        this.passwordUpdateError = 'Yeni şifreleriniz birbiriyle eşleşmiyor.';
        return;
      }

      this.isUpdatingPassword = true;
      this.passwordUpdateError = null;
      this.passwordUpdateSuccess = null;

      try {
        const token = this.$store.state.token;
        const payload = {
          oldPassword: this.passwordForm.oldPassword,
          newPassword: this.passwordForm.newPassword,
          confirmNewPassword: this.passwordForm.confirmNewPassword
        };

        await axios.put(`${this.apiBaseUrl}/Auth/reset-password/v2`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.passwordUpdateSuccess = 'Şifreniz başarıyla güncellendi!';
        
        setTimeout(() => {
          this.closePasswordModal();
        }, 2000);

      } catch (err) {
        console.error('Şifre güncellenirken hata:', err);
        if (err.response && err.response.data && typeof err.response.data === 'string') {
          this.passwordUpdateError = err.response.data; // Eğer API sadece string bir hata mesajı dönüyorsa
        } else if (err.response && err.response.data && err.response.data.message) {
          this.passwordUpdateError = err.response.data.message;
        } else if (err.response && err.response.status === 400) {
            this.passwordUpdateError = 'Girilen bilgiler hatalı. Lütfen mevcut şifrenizi kontrol edin.';
        } else {
          this.passwordUpdateError = 'Şifre güncellenirken bir hata oluştu. Lütfen tekrar deneyin.';
        }
      } finally {
        this.isUpdatingPassword = false;
      }
    },

    // Mevcut Adres Yönetimi Metodları
    openAddressModal() {
      this.showAddressModal = true;
      this.addressError = null;
      this.fetchAddresses();
      if (this.cities.length === 0) {
        this.fetchCities(this.locationData.selectedCountryId);
      }
    },

    closeAddressModal() {
      this.showAddressModal = false;
      this.isEditingOrAddingAddress = false;
      this.addressError = null;
      this.addresses = [];
      this.cities = [];
      this.districts = [];
    },

    async fetchAddresses() {
      this.loadingAddresses = true;
      this.addressError = null;
      try {
        const token = this.$store.state.token;
        const response = await axios.get(`${this.apiBaseUrl}/Addresses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.addresses = response.data;
      } catch (err) {
        console.error('Adresler yüklenirken hata:', err);
        this.addressError = 'Adresler yüklenirken bir hata oluştu.';
      } finally {
        this.loadingAddresses = false;
      }
    },

    startAddNewAddress() {
      this.editingAddressId = null;
      this.addressForm = { ...initialAddressFormState };
      this.locationData.selectedCityId = null;
      this.districts = [];
      this.isEditingOrAddingAddress = true;
    },

    async startEditAddress(address) {
      this.editingAddressId = address.id;
      this.addressForm = { ...address }; 
      this.isEditingOrAddingAddress = true;
      if (this.cities.length === 0) {
        await this.fetchCities(this.locationData.selectedCountryId);
      }
      const city = this.cities.find(c => c.name === address.city);
      if (city) {
        this.locationData.selectedCityId = city.id;
      }
    },

    cancelEditOrAddAddress() {
      this.isEditingOrAddingAddress = false;
      this.addressError = null;
      this.editingAddressId = null;
    },

    async deleteAddress(id) {
      this.addressError = null;
      try {
        const token = this.$store.state.token;
        await axios.delete(`${this.apiBaseUrl}/Addresses/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await this.fetchAddresses();
      } catch (err) {
        console.error('Adres silinirken hata:', err);
        this.addressError = 'Adres silinirken bir hata oluştu.';
      }
    },

    confirmDeleteAddress(id) {
      if (window.confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
        this.deleteAddress(id);
      }
    },

    handleSaveAddress() {
      if (this.editingAddressId) {
        this.updateAddress();
      } else {
        this.createAddress();
      }
    },

    async createAddress() {
      this.isSavingAddress = true;
      this.addressError = null;
      try {
        const token = this.$store.state.token;
        const payload = { ...this.addressForm };
        delete payload.id; 

        await axios.post(`${this.apiBaseUrl}/Addresses`, payload, {
           headers: { Authorization: `Bearer ${token}` }
        });
        this.isEditingOrAddingAddress = false;
        await this.fetchAddresses();
      } catch (err) {
        console.error('Adres eklenirken hata:', err);
        this.addressError = 'Adres eklenirken bir hata oluştu. Lütfen tüm alanları kontrol edin.';
      } finally {
        this.isSavingAddress = false;
      }
    },

    async updateAddress() {
      this.isSavingAddress = true;
      this.addressError = null;
      try {
        const token = this.$store.state.token;
        await axios.put(`${this.apiBaseUrl}/Addresses/${this.editingAddressId}`, this.addressForm, {
           headers: { Authorization: `Bearer ${token}` }
        });
        this.isEditingOrAddingAddress = false;
        await this.fetchAddresses();
      } catch (err) {
        console.error('Adres güncellenirken hata:', err);
        this.addressError = 'Adres güncellenirken bir hata oluştu.';
      } finally {
        this.isSavingAddress = false;
      }
    },
    
    // Mevcut Lokasyon Metodları
    async fetchCities(countryId) {
      this.loadingLocations.cities = true;
      try {
        const response = await axios.get(`${this.apiBaseUrl}/Locations/cities/${countryId}`);
        this.cities = response.data;
      } catch (err) {
        console.error('Şehirler yüklenirken hata:', err);
        this.addressError = "Şehirler yüklenemedi. Lütfen daha sonra tekrar deneyin.";
      } finally {
        this.loadingLocations.cities = false;
      }
    },

    async fetchDistricts(cityId) {
      this.loadingLocations.districts = true;
      this.addressError = null;
      try {
        const response = await axios.get(`${this.apiBaseUrl}/Locations/districts/${cityId}`);
        this.districts = response.data;
      } catch (err) {
        console.error('İlçeler yüklenirken hata:', err);
        this.addressError = "İlçeler yüklenemedi. Lütfen daha sonra tekrar deneyin.";
      } finally {
        this.loadingLocations.districts = false;
      }
    },
    
    onCityChange(event) {
      const cityId = event.target.value;
      const selectedCityObject = this.cities.find(c => c.id == cityId);
      if (selectedCityObject) {
        this.addressForm.city = selectedCityObject.name;
      }
    }

  },
  mounted() {
    this.fetchUserProfile();
  }
};
</script>

<style scoped>
/* TÜM MEVCUT CSS KODUNUZ HİÇBİR DEĞİŞİKLİK OLMADAN BURADA KORUNUYOR */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

:root {
  --primary-gold: #d4af37;
  --dark-gold: #b8860b;
  --light-bg: #fdfdfd;
  --medium-grey-border: #e0e0e0;
  --dark-text: #333;
  --light-text: #666;
  --success-color: #28a745;
  --error-color: #dc3545;
  --shadow-base: rgba(0, 0, 0, 0.1);
  --shadow-hover: rgba(0, 0, 0, 0.15);
  --transition-fast: 0.2s ease;
  --transition-medium: 0.3s ease;
}

.user-profile-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 80px);
  padding: 60px 20px;
  background: linear-gradient(to bottom right, var(--light-bg), #f0f2f5);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--dark-text);
}

.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.user-profile-card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 15px 45px var(--shadow-base);
  padding: 45px;
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  text-align: center;
  border: 1px solid var(--medium-grey-border);
  overflow: hidden;
}

.profile-header {
  margin-bottom: 40px;
  border-bottom: 1px solid var(--medium-grey-border);
  padding-bottom: 30px;
}

.profile-avatar {
  font-size: 90px;
  color: var(--primary-gold);
  margin-bottom: 18px;
  transition: transform var(--transition-medium);
  display: block;
}

.profile-avatar:hover {
  transform: scale(1.08) rotate(5deg);
}

.profile-greeting {
  font-size: 2.5rem;
  color: var(--dark-text);
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.02em;
}

.alert-message {
  padding: 18px 25px;
  border-radius: 10px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  font-size: 1.1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  animation: fadeInDown 0.5s ease-out;
}
@keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

.loading-status {
  background-color: #e0f2f7;
  color: #0288d1;
  border: 1px solid #b3e5fc;
}

.error-status {
  background-color: #ffebee;
  color: var(--error-color);
  border: 1px solid #ef9a9a;
}

.success-status {
  background-color: #e8f5e9;
  color: var(--success-color);
  border: 1px solid #a5d6a7;
}

.icon-spin, .icon-alert, .icon-success {
  font-size: 1.4rem;
}

.alert-action-link {
  color: var(--error-color);
  font-weight: bold;
  text-decoration: underline;
  margin-left: 5px;
  transition: color var(--transition-fast);
}
.alert-action-link:hover {
  color: #c62828;
}

.modal-message {
    margin-top: 20px;
    margin-bottom: 0;
}

.profile-details-section {
  text-align: left;
  margin-top: 30px;
}

.detail-group {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px dashed var(--medium-grey-border);
  transition: all var(--transition-fast);
}
.detail-group:hover {
    background-color: rgba(212, 175, 55, 0.03);
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
  font-size: 0.9rem;
  color: var(--light-text);
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.detail-value {
  font-size: 1.25rem;
  color: var(--dark-text);
  font-weight: 700;
  margin: 0;
  word-break: break-all;
  line-height: 1.4;
}

.profile-actions-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.app-button {
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-decoration: none;
  color: black;
}

.app-button.primary-button {
  background-color: var(--primary-gold);
  box-shadow: 0 6px 18px rgba(212, 175, 55, 0.35);
}
.app-button.primary-button:hover:not(:disabled) {
  background-color: var(--dark-gold);
  transform: translateY(-4px); 
  box-shadow: 0 10px 25px rgba(212, 175, 55, 0.45);
}

.app-button.secondary-button {
  background-color: #6c757d;
  box-shadow: 0 6px 18px rgba(108, 117, 125, 0.25);
}
.app-button.secondary-button:hover:not(:disabled) {
  background-color: #5a6268;
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(108, 117, 125, 0.35);
}

.app-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
  color: #999;
}

.icon-button {
    font-size: 1.15em;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 35px;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  width: 95%;
  max-width: 550px;
  position: relative;
  text-align: left;
  animation: modalFadeIn 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
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
  font-size: 32px;
  cursor: pointer;
  color: var(--light-text);
  transition: color var(--transition-fast);
}
.modal-close-button:hover {
  color: var(--dark-text);
}

.modal-content h3 {
  font-size: 2rem;
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
  padding: 13px 18px;
  border: 1px solid var(--medium-grey-border);
  border-radius: 8px;
  font-size: 1.05rem;
  color: var(--dark-text);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  box-sizing: border-box;
}

.form-input:focus {
  border-color: var(--primary-gold);
  box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.25);
  outline: none;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.modal-content .app-button {
  width: auto;
  padding: 12px 25px;
  font-size: 1rem;
  margin: 0;
}

@media (max-width: 768px) {
  .user-profile-page { padding: 30px 15px; }
  .user-profile-card { padding: 30px 25px; border-radius: 12px; }
  .profile-greeting { font-size: 2rem; }
  .profile-avatar { font-size: 70px; }
  .detail-value { font-size: 1.15rem; }
  .app-button { font-size: 0.95rem; padding: 12px 20px; }
  .modal-content { padding: 30px 20px; }
  .modal-content h3 { font-size: 1.7rem; }
  .modal-buttons { flex-direction: column; align-items: stretch; gap: 10px; }
  .modal-content .app-button { width: 100%; }
}

@media (max-width: 480px) {
  .user-profile-card { padding: 25px 15px; }
  .profile-greeting { font-size: 1.8rem; }
  .profile-avatar { font-size: 60px; }
  .detail-label { font-size: 0.8rem; }
  .detail-value { font-size: 1.05rem; }
  .app-button { font-size: 0.9rem; padding: 10px 15px; }
  .modal-content h3 { font-size: 1.5rem; }
}

.address-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
  max-height: 350px;
  overflow-y: auto;
  border: 1px solid var(--medium-grey-border);
  border-radius: 8px;
}

.address-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--medium-grey-border);
  transition: background-color 0.2s ease;
}

.address-item:last-child {
  border-bottom: none;
}

.address-item:hover {
  background-color: #f9f9f9;
}

.address-details {
  flex-grow: 1;
}

.address-details strong {
  font-size: 1.1rem;
  color: var(--dark-text);
  display: block;
  margin-bottom: 5px;
}

.address-details p {
  margin: 0;
  color: var(--light-text);
  font-size: 0.95rem;
  line-height: 1.4;
}

.address-actions {
  display: flex;
  gap: 10px;
  padding-left: 15px;
}

.action-btn {
  background: none;
  border: 1px solid transparent;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s ease;
}

.action-btn.edit-btn {
  color: #007bff;
}
.action-btn.edit-btn:hover {
  background-color: #e7f3ff;
  border-color: #cce3ff;
}

.action-btn.delete-btn {
  color: var(--error-color);
}
.action-btn.delete-btn:hover {
  background-color: #ffebee;
  border-color: #ffcdd2;
}

.mt-4 {
    margin-top: 1.5rem !important;
}

.form-input[rows] {
  height: auto;
  resize: vertical;
}

.form-input:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>