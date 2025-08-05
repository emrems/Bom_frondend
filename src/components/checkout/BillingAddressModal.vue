<template>
  <transition name="modal-fade">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <button class="modal-close-button" @click="$emit('close')">&times;</button>
        <div class="modal-header">
          <i class="fas fa-file-invoice"></i>
          <h3>Fatura Bilgileri</h3>
        </div>
        <form @submit.prevent="saveAddress" class="modal-form">
          <p class="modal-info">Lütfen faturanız için gerekli tüm bilgileri eksiksiz giriniz.</p>
          
          <div class="form-group floating-label">
            <input type="text" id="billingAddressTitle" v-model="address.addressTitle" required placeholder=" " />
            <label for="billingAddressTitle">Adres Başlığı *</label>
          </div>
          <div class="form-group floating-label">
            <input type="text" id="billingContactName" v-model="address.contactName" required placeholder=" " />
            <label for="billingContactName">Ad Soyad *</label>
          </div>
          <div class="form-group floating-label">
            <input type="tel" id="billingPhoneNumber" v-model="address.phoneNumber" required placeholder=" " />
            <label for="billingPhoneNumber">Telefon *</label>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="billingCity">İl *</label>
              <select id="billingCity" v-model="selectedCityId" @change="onCityChange" required>
                <option value="" disabled>İl seçiniz</option>
                <option v-for="city in cities" :key="city.id" :value="city.id">{{ city.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="billingDistrict">İlçe *</label>
              <select id="billingDistrict" v-model="address.district" :disabled="!selectedCityId" required>
                <option value="" disabled>İlçe seçiniz</option>
                <option v-for="district in districts" :key="district.id" :value="district.name">{{ district.name }}</option>
              </select>
            </div>
          </div>
          <div class="form-group floating-label">
            <textarea id="billingFullAddress" v-model="address.fullAddress" required rows="3" placeholder=" "></textarea>
            <label for="billingFullAddress">Açık Adres *</label>
          </div>
          <div class="form-group floating-label">
            <input type="text" id="billingPostalCode" v-model="address.postalCode" placeholder=" " />
            <label for="billingPostalCode">Posta Kodu (Opsiyonel)</label>
          </div>

          <button type="submit" class="btn">Fatura Adresini Kaydet</button>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from 'axios';

export default {
  name: 'BillingAddressModal',
  emits: ['close', 'save'],
  data() {
    return {
      address: {
        addressTitle: 'Fatura Adresi', contactName: '', phoneNumber: '', city: '',
        district: '', fullAddress: '', postalCode: ''
      },
      apiBaseUrl: 'http://localhost:5294',
      cities: [],
      districts: [],
      selectedCityId: '',
    };
  },
  async created() {
    await this.fetchCities();
  },
  methods: {
    async fetchCities() {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/api/Locations/cities/1`);
        this.cities = response.data.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
      } catch (error) { console.error("Modal: İl listesi çekilirken hata:", error); }
    },
    async fetchDistricts(cityId) {
      if (!cityId) { this.districts = []; return; }
      try {
        const response = await axios.get(`${this.apiBaseUrl}/api/Locations/districts/${cityId}`);
        this.districts = response.data.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
      } catch (error) { console.error("Modal: İlçe listesi çekilirken hata:", error); }
    },
    async onCityChange() {
      this.address.district = '';
      const selectedCityObject = this.cities.find(c => c.id === this.selectedCityId);
      if (selectedCityObject) { this.address.city = selectedCityObject.name; }
      await this.fetchDistricts(this.selectedCityId);
    },
    saveAddress() {
      if (!this.address.district) {
        alert("Lütfen fatura adresi için bir ilçe seçin.");
        return;
      }
      this.$emit('save', this.address);
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.modal-overlay { z-index: 1000; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; }
.modal-content { background: white; padding: 2.5rem; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); width: 90%; max-width: 550px; position: relative; font-family: 'Raleway', sans-serif; }
.modal-close-button { position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 2rem; cursor: pointer; color: #aaa; }
.modal-header { display: flex; align-items: center; gap: 1rem; color: #c5a47e; margin-bottom: 1rem; font-size: 1.2rem; }
.modal-header h3 { margin: 0; font-size: 1.5rem; color: #333; }
.modal-info { color: #666; margin-bottom: 2rem; }
.modal-form { display: flex; flex-direction: column; gap: 1.8rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.8rem; }
.form-group { position: relative; }
.form-group label { font-weight: 500; color: #555; margin-bottom: 0.5rem; font-size: 0.9rem; display: block; }
.form-group.floating-label label { position: absolute; top: 14px; left: 15px; background: white; padding: 0 5px; pointer-events: none; transition: all 0.2s ease; color: #999; }
.form-group input, .form-group textarea, .form-group select { padding: 14px 16px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; width: 100%; box-sizing: border-box; font-family: 'Raleway', sans-serif; }
.form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: #c5a47e; box-shadow: 0 0 0 3px rgba(197, 164, 126, 0.2); }
.form-group input:focus + label, .form-group input:not(:placeholder-shown) + label, .form-group textarea:focus + label, .form-group textarea:not(:placeholder-shown) + label { top: -10px; font-size: 0.8rem; color: #c5a47e; }
.btn { width: 100%; padding: 14px; font-size: 1.1rem; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; background-color: #c5a47e; color: white; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.form-group select { -webkit-appearance: none; -moz-appearance: none; appearance: none; background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1em; }
</style>