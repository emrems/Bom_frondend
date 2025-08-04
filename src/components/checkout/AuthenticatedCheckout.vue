<template>
  <div class="payment-section">
    <div class="section-header">
      <i class="fas fa-map-marked-alt"></i>
      <h2>Adres Seçimi</h2>
    </div>

    <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Adresleriniz yükleniyor...</p>
    </div>
    <div v-else-if="error" class="error-state">{{ error }}</div>

    <div v-else>
      <div v-if="addresses.length > 0" class="address-selection">
        <div class="form-group">
          <label for="shippingAddress">Teslimat Adresi Seçin</label>
          <select id="shippingAddress" v-model="selectedShippingId">
            <option v-for="address in addresses" :key="address.id" :value="address.id">
              {{ address.addressTitle }} - {{ address.fullAddress.substring(0, 30) }}...
            </option>
          </select>
        </div>
        <div class="form-group-checkbox">
            <input type="checkbox" id="isBillingDifferentAuth" v-model="isBillingDifferent">
            <label for="isBillingDifferentAuth">Fatura adresim, teslimat adresimden farklı.</label>
        </div>
        <div v-if="isBillingDifferent" class="form-group">
          <label for="billingAddress">Fatura Adresi Seçin</label>
          <select id="billingAddress" v-model="selectedBillingId">
            <option v-for="address in addresses" :key="address.id" :value="address.id">
              {{ address.addressTitle }} - {{ address.fullAddress.substring(0, 30) }}...
            </option>
          </select>
        </div>
      </div>

      <button v-if="!showAddressForm" @click="showAddressForm = true" class="btn-link">
        {{ addresses.length > 0 ? '+ Yeni Adres Ekle' : 'Adres Ekle' }}
      </button>

      <transition name="fade">
        <div v-if="showAddressForm" class="new-address-form">
          <hr v-if="addresses.length > 0">
          <h4>{{ addresses.length > 0 ? 'Yeni Adres Ekle' : 'Lütfen Teslimat Adresi Girin' }}</h4>
          
          <div class="form-group">
              <label>Adres Başlığı *</label>
              <input v-model="newAddress.addressTitle" type="text" placeholder="Ev Adresim"/>
          </div>
           <div class="form-group">
            <label>Ad Soyad *</label>
            <input v-model="newAddress.contactName" type="text" />
          </div>
           <div class="form-group">
            <label>Telefon *</label>
            <input v-model="newAddress.phoneNumber" type="tel" />
          </div>
          <div class="form-group">
            <label>Açık Adres *</label>
            <textarea v-model="newAddress.fullAddress" rows="3"></textarea>
          </div>
          
          <div class="form-actions">
            <button @click="saveNewAddress" class="btn save-address-btn" :disabled="isSaving">
                {{ isSaving ? 'Kaydediliyor...' : 'Yeni Adresi Kaydet' }}
            </button>
            <button v-if="addresses.length > 0" @click="showAddressForm = false" class="btn-secondary">İptal</button>
          </div>
        </div>
      </transition>
      
      <div class="form-group" style="margin-top: 2rem;">
        <label for="notesAuth">Sipariş Notu (Opsiyonel)</label>
        <textarea id="notesAuth" v-model="notes" rows="2"></textarea>
      </div>

      <button @click="submitOrder" class="btn payment-btn" :disabled="!selectedShippingId && !showAddressForm">siparişi oluştur</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  name: 'AuthenticatedCheckout',
  props: ['paymentToken'],
  emits: ['initiate-payment'],
  data() {
    return {
      loading: true, error: null,
      addresses: [],
      selectedShippingId: null,
      selectedBillingId: null,
      isBillingDifferent: false,
      showAddressForm: false,
      isSaving: false,
      newAddress: {
        addressTitle: '', contactName: '', phoneNumber: '', city: 'İstanbul',
        district: 'Kadıköy', fullAddress: '', postalCode: '34700'
      },
      notes: '',
      apiBaseUrl: 'https://localhost:7135',
    };
  },
 
  computed: {}, 
  async created() {
    await this.fetchAddresses();
  },
  methods: {
    async fetchAddresses() {
      this.loading = true;
      try {
      
        const token = this.$store.state.token;
        if (!token) {
            throw new Error("Kullanıcı token'ı bulunamadı. Lütfen giriş yapın.");
        }
        
        const headers = { 'Authorization': `Bearer ${token}` };
        const response = await axios.get(`${this.apiBaseUrl}/api/Addresses`, { headers });
        
        this.addresses = response.data;
        if (this.addresses.length > 0) {
          this.selectedShippingId = this.addresses[0].id;
          this.selectedBillingId = this.addresses[0].id;
        } else {
          this.showAddressForm = true;
        }
      } catch (e) {
        this.error = "Adresleriniz yüklenemedi. Lütfen tekrar giriş yapmayı deneyin.";
        console.error("Adres çekme hatası:", e);
      } finally {
        this.loading = false;
      }
    },
    async saveNewAddress() {
      this.isSaving = true;
      try {
        const headers = { 'Authorization': `Bearer ${this.$store.state.token}` };
        await axios.post(`${this.apiBaseUrl}/api/Addresses`, this.newAddress, { headers });
        await this.fetchAddresses();
        this.showAddressForm = false;
      } catch(e) {
          alert("Yeni adres kaydedilirken bir hata oluştu.");
      } finally {
          this.isSaving = false;
      }
    },
    submitOrder() {
      if (!this.selectedShippingId) {
        if (this.showAddressForm) {
            alert("Lütfen önce yeni adresi kaydedin veya işlemi iptal edin.");
        } else {
            alert("Lütfen bir teslimat adresi seçin.");
        }
        return;
      }
      this.$emit('initiate-payment', {
        shippingAddressId: this.selectedShippingId,
        billingAddressId: this.isBillingDifferent ? this.selectedBillingId : this.selectedShippingId,
        notes: this.notes
      });
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.payment-section { background: white; padding: 2.5rem; border-radius: 15px; box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08); font-family: 'Raleway', sans-serif; }
.section-header { display: flex; align-items: center; gap: 1rem; color: #1a1a1a; margin-top: 0; margin-bottom: 2.5rem; font-size: 1.2rem; border-bottom: 1px solid #f0f0f0; padding-bottom: 1.5rem; }
.section-header i { color: #c5a47e; font-size: 1.5rem; }
.section-header h2 { margin: 0; font-size: 1.5rem; }
.loading-state, .error-state { text-align: center; padding: 2rem; }
.spinner { display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(197, 164, 126, 0.2); border-radius: 50%; border-top-color: #c5a47e; animation: spin 1s ease-in-out infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.address-selection, .new-address-form { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 1.5rem; }
.form-group { display: flex; flex-direction: column; }
.form-group label { font-weight: 500; color: #555; margin-bottom: 0.5rem; font-size: 0.9rem; }
.form-group select, .form-group textarea, .form-group input { padding: 12px 16px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; font-family: 'Raleway', sans-serif; width: 100%; box-sizing: border-box; background-color: #fff; transition: all 0.2s ease; }
.form-group select:focus, .form-group textarea:focus, .form-group input:focus { outline: none; border-color: #c5a47e; box-shadow: 0 0 0 3px rgba(197, 164, 126, 0.2); }
.form-group-checkbox { display: flex; align-items: center; gap: 0.8rem; }
.btn-link { background: none; border: none; color: #c5a47e; cursor: pointer; text-decoration: underline; padding: 0.5rem 0; font-family: 'Raleway', sans-serif; font-size: 1rem; align-self: flex-start; }
hr { border: none; border-top: 1px solid #f0f0f0; margin: 2rem 0; }
.btn { padding: 14px 35px; font-size: 1.1rem; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; background-color: #c5a47e; color: white; }
.payment-btn { width: 100%; margin-top: 1rem; }
.save-address-btn { align-self: flex-start; }
.btn:disabled { opacity: 0.7; cursor: not-allowed; }
.form-actions { display: flex; gap: 1rem; }
.btn-secondary { background-color: #f0f0f0; color: #333; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>