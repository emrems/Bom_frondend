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

      <button v-if="addresses.length > 0" @click="showAddressForm = true" class="btn-link">
        + Yeni Adres Ekle
      </button>

      <div v-if="showAddressForm" class="modal-overlay">
        <div class="modal">
          <h3>Yeni Adres Ekle</h3>
          <div class="form-group">
            <label>Adres Başlığı *</label>
            <input v-model="newAddress.addressTitle" type="text" placeholder="Ev Adresim" />
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
            <label>İl Seçin *</label>
            <select v-model="newAddress.cityId" @change="fetchDistricts">
              <option disabled value="">İl seçin</option>
              <option v-for="city in cities" :key="city.id" :value="city.id">{{ city.name }}</option>
            </select>
          </div>
          <div class="form-group" v-if="districts.length > 0">
            <label>İlçe Seçin *</label>
            <select v-model="newAddress.districtId">
              <option disabled value="">İlçe seçin</option>
              <option v-for="district in districts" :key="district.id" :value="district.id">{{ district.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Posta Kodu *</label>
            <input v-model="newAddress.postalCode" type="text" placeholder="34000" />
          </div>
          <div class="form-group">
            <label>Açık Adres *</label>
            <textarea v-model="newAddress.fullAddress" rows="3"></textarea>
          </div>

          <div class="form-actions">
            <button @click="saveNewAddress" class="btn save-address-btn" :disabled="isSaving">
              {{ isSaving ? 'Kaydediliyor...' : 'Kaydet' }}
            </button>
            <button @click="showAddressForm = false" class="btn-secondary">İptal</button>
          </div>
        </div>
      </div>

      <div class="form-group" style="margin-top: 2rem;">
        <label for="notesAuth">Sipariş Notu (Opsiyonel)</label>
        <textarea id="notesAuth" v-model="notes" rows="2"></textarea>
      </div>

      <button @click="submitOrder" class="btn payment-btn" :disabled="!selectedShippingId || isSubmitting">
        {{ isSubmitting ? 'Sipariş oluşturuluyor...' : 'Siparişi Oluştur' }}
      </button>

      <OrderSuccess v-if="orderStatus === 'success'" />
      <OrderError v-if="orderStatus === 'error'" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import OrderSuccess from '@/components/success/ordersSuccess/OrderSuccess.vue';
import OrderError from '@/components/error/ordersError/OrderError.vue';

export default {
  name: 'AuthenticatedCheckout',
  components: { OrderSuccess, OrderError },
  props: ['paymentToken'],
  emits: ['initiate-payment'],
  data() {
    return {
      loading: true,
      error: null,
      addresses: [],
      selectedShippingId: null,
      selectedBillingId: null,
      isBillingDifferent: false,
      showAddressForm: false,
      isSaving: false,
      isSubmitting: false,
      orderStatus: null,
      cities: [],
      districts: [],
      newAddress: {
        addressTitle: '',
        contactName: '',
        phoneNumber: '',
        cityId: '',
        districtId: '',
        fullAddress: '',
        postalCode: ''
      },
      notes: '',
      apiBaseUrl: 'https://localhost:7135'
    };
  },
  async created() {
    await this.fetchCities();
    await this.fetchAddresses();
  },
  methods: {
    async fetchCities() {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/api/Locations/cities/1`);
        this.cities = response.data;
      } catch (e) {
        console.error('İller alınamadı:', e);
      }
    },
    async fetchDistricts() {
      if (!this.newAddress.cityId) return;
      try {
        const response = await axios.get(`${this.apiBaseUrl}/api/Locations/districts/${this.newAddress.cityId}`);
        this.districts = response.data;
      } catch (e) {
        console.error('İlçeler alınamadı:', e);
      }
    },
    async fetchAddresses() {
      this.loading = true;
      try {
        const token = this.$store.state.token;
        if (!token) throw new Error("Token bulunamadı.");

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
        this.error = "Adresler yüklenemedi.";
      } finally {
        this.loading = false;
      }
    },
    async saveNewAddress() {
      this.isSaving = true;
      try {
        const headers = { 'Authorization': `Bearer ${this.$store.state.token}` };

        const city = this.cities.find(c => c.id === this.newAddress.cityId)?.name || '';
        const district = this.districts.find(d => d.id === this.newAddress.districtId)?.name || '';

        const payload = {
          ...this.newAddress,
          city,
          district
        };

        await axios.post(`${this.apiBaseUrl}/api/Addresses`, payload, { headers });
        await this.fetchAddresses();
        this.showAddressForm = false;
      } catch (e) {
        this.orderStatus = 'error';
      } finally {
        this.isSaving = false;
      }
    },
    async submitOrder() {
      if (!this.selectedShippingId) return;

      this.isSubmitting = true;
      try {
        const headers = { 'Authorization': `Bearer ${this.$store.state.token}` };
        const payload = {
          cartId: this.$store.state.cartId,
          shippingAddressId: this.selectedShippingId,
          billingAddressId: this.isBillingDifferent ? this.selectedBillingId : this.selectedShippingId,
          notes: this.notes
        };

        await axios.post(`${this.apiBaseUrl}/api/Orders/place-authenticated`, payload, { headers });
        this.orderStatus = 'success';
      } catch (e) {
        this.orderStatus = 'error';
        console.error("Sipariş oluşturma hatası:", e);
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
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
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}
</style>