<template>
  <div class="payment-section">
    <div class="section-header">
      <i class="fas fa-truck"></i>
      <h2>Teslimat Bilgileri</h2>
    </div>
    
    <transition name="form-fade" mode="out-in">
      <div v-if="!paymentToken" key="form" class="customer-form">
        <form @submit.prevent="submitForm" class="payment-form">
          
          <div class="guest-info-form">
            <h4>Siparişi Veren Kişinin Bilgileri</h4>
            <p>Sipariş durumu hakkında bilgi alabilmemiz için lütfen kendi bilgilerinizi girin.</p>
            
            <div class="form-row">
              <div class="form-group floating-label">
                <input type="text" id="guestFirstName" v-model="guestInfo.firstName" required placeholder=" " />
                <label for="guestFirstName">Adınız *</label>
              </div>
              <div class="form-group floating-label">
                <input type="text" id="guestLastName" v-model="guestInfo.lastName" required placeholder=" " />
                <label for="guestLastName">Soyadınız *</label>
              </div>
            </div>
            <div class="form-group floating-label">
              <input type="email" id="guestEmail" v-model="guestInfo.email" required placeholder=" " />
              <label for="guestEmail">E-posta Adresiniz *</label>
            </div>
            <div class="form-group floating-label">
              <input type="tel" id="guestPhone" v-model="guestInfo.phone" required placeholder=" " />
              <label for="guestPhone">Telefon Numaranız *</label>
            </div>
          </div>
          
          <hr/>
          
          <div class="form-group floating-label">
            <input type="text" id="addressTitle" v-model="shippingAddress.addressTitle" required placeholder=" " />
            <label for="addressTitle">Adres Başlığı * (Örn: Ev, İş)</label>
          </div>
          <div class="form-group floating-label">
            <input type="text" id="contactName" v-model="shippingAddress.contactName" required placeholder=" " />
            <label for="contactName">Teslim Alacak Kişinin Adı Soyadı *</label>
          </div>
          <div class="form-group floating-label">
            <input type="tel" id="phoneNumber" v-model="shippingAddress.phoneNumber" required placeholder=" " />
            <label for="phoneNumber">Teslimat Telefon Numarası *</label>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="city">İl *</label>
              <select id="city" v-model="selectedCityId" @change="onCityChange" required>
                <option value="" disabled>İl seçiniz</option>
                <option v-for="city in cities" :key="city.id" :value="city.id">{{ city.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="district">İlçe *</label>
              <select id="district" v-model="shippingAddress.district" :disabled="!selectedCityId" required>
                <option value="" disabled>İlçe seçiniz</option>
                <option v-for="district in districts" :key="district.id" :value="district.name">{{ district.name }}</option>
              </select>
            </div>
          </div>
          <div class="form-group floating-label">
            <textarea id="fullAddress" v-model="shippingAddress.fullAddress" required rows="3" placeholder=" "></textarea>
            <label for="fullAddress">Açık Adres *</label>
          </div>
          <div class="form-group floating-label">
            <input type="text" id="postalCode" v-model="shippingAddress.postalCode" placeholder=" " />
            <label for="postalCode">Posta Kodu (Opsiyonel)</label>
          </div>

          <div class="form-group-checkbox">
            <input type="checkbox" id="isBillingDifferent" v-model="isBillingDifferent">
            <label for="isBillingDifferent">Fatura adresim, teslimat adresimden farklı.</label>
          </div>
          
          <!-- YENİ EKLENEN KUPON ALANI -->
         

          <div class="form-group floating-label">
            <textarea id="notes" v-model="notes" rows="2" placeholder=" "></textarea>
            <label for="notes">Sipariş Notu (Opsiyonel)</label>
          </div>
          
          <button type="submit" class="btn payment-btn" :disabled="isSubmitting">
            <span v-if="isSubmitting">⏳ Siparişiniz işleniyor...</span>
            <span v-else>Siparişi Oluştur</span>
          </button>
        </form>
      </div>
      <div v-else key="iframe" class="payment-iframe-container">
         <div class="section-header">
            <i class="fas fa-credit-card"></i>
            <h2>Güvenli Ödeme</h2>
        </div>
        <p class="payment-info">Ödemenizi tamamlamak için kart bilgilerinizi giriniz.</p>
        <iframe :src="paymentUrl" width="100%" height="500" frameborder="0" class="payment-iframe" title="PayTR Güvenli Ödeme"></iframe>
        <div class="payment-notes"><p><strong>Not:</strong> Ödeme işlemi PayTR güvencesi altında gerçekleşmektedir.</p></div>
      </div>
    </transition>

    <BillingAddressModal 
      v-if="showBillingModal" 
      @close="closeBillingModal" 
      @save="saveBillingAddress"
    />
  </div>
</template>

<script>
import axios from 'axios';
import BillingAddressModal from './BillingAddressModal.vue';

export default {
  name: 'GuestPaymentForm',
  components: { BillingAddressModal },
  props: { 
    paymentToken: String,
    isSubmitting: Boolean
  },
  emits: ['initiate-payment'],
  data() {
    return {
      shippingAddress: {
        addressTitle: 'Ev Adresim', contactName: '', phoneNumber: '', city: '',
        district: '', fullAddress: '', postalCode: ''
      },
      guestInfo: {
        firstName: '', lastName: '', email: '', phone: ''
      },
      isBillingDifferent: false,
      billingAddress: null,
      notes: '',
      couponCode: '', // YENİ: Kupon kodu için data propertysi
      showBillingModal: false,
      apiBaseUrl: 'http://localhost:5294',
      cities: [], districts: [], selectedCityId: '', 
    };
  },
  computed: {
    paymentUrl() {
      return this.paymentToken ? `https://www.paytr.com/odeme/guvenli/${this.paymentToken}` : '';
    }
  },
  async created() {
    await this.fetchCities();
  },
  methods: {
    async fetchCities() {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/api/locations/cities/1`);
        this.cities = response.data.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
      } catch (error) { console.error("İl listesi çekilirken hata:", error); }
    },
    async fetchDistricts(cityId) {
      if (!cityId) { this.districts = []; return; }
      try {
        const response = await axios.get(`${this.apiBaseUrl}/api/locations/districts/${cityId}`);
        this.districts = response.data.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
      } catch (error) { console.error("İlçe listesi çekilirken hata:", error); }
    },
    async onCityChange() {
      this.shippingAddress.district = '';
      const selectedCityObject = this.cities.find(c => c.id === this.selectedCityId);
      if (selectedCityObject) { this.shippingAddress.city = selectedCityObject.name; }
      await this.fetchDistricts(this.selectedCityId);
    },
    closeBillingModal() {
      this.showBillingModal = false;
      if (!this.billingAddress) this.isBillingDifferent = false;
    },
    saveBillingAddress(addressData) {
      this.billingAddress = addressData;
    },
    async submitForm() {
      if (!this.shippingAddress.district) { alert("Lütfen teslimat için bir ilçe seçiniz."); return; }
      if (this.isBillingDifferent && !this.billingAddress) {
        alert('Lütfen açılan pencereden fatura adresini girip kaydedin.');
        this.showBillingModal = true;
        return;
      }
      this.$emit('initiate-payment', {
        shippingAddress: this.shippingAddress,
        billingAddress: this.isBillingDifferent ? this.billingAddress : null,
        notes: this.notes,
        guestInfo: this.guestInfo,
        couponCode: this.couponCode, // GÜNCELLENDİ: Kupon kodu emit ediliyor
      });
    },
  },
  watch: {
    isBillingDifferent(newValue) {
      if (newValue) this.showBillingModal = true;
      else this.billingAddress = null;
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
.payment-form { display: flex; flex-direction: column; gap: 1.8rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.8rem; }
.form-group { position: relative; }
.form-group.floating-label label { position: absolute; top: 14px; left: 15px; color: #999; font-size: 1rem; transition: all 0.2s ease-out; pointer-events: none; background-color: white; padding: 0 5px; }
.form-group label { font-weight: 500; color: #555; margin-bottom: 0.5rem; font-size: 0.9rem; display: block; }
.form-group.floating-label label { margin-bottom: 0; font-weight: 400; display: inline; }
.form-group input, .form-group textarea, .form-group select { padding: 14px 16px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; font-family: 'Raleway', sans-serif; width: 100%; box-sizing: border-box; transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out; }
.form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: #c5a47e; box-shadow: 0 0 0 3px rgba(197, 164, 126, 0.2); }
.form-group input:focus + label, .form-group input:not(:placeholder-shown) + label, .form-group textarea:focus + label, .form-group textarea:not(:placeholder-shown) + label { top: -10px; font-size: 0.8rem; color: #c5a47e; font-weight: 500; }
.form-icon { position: absolute; top: 15px; left: 15px; color: #ccc; transition: color 0.2s ease-out; }
.form-group input:focus ~ .form-icon { color: #c5a47e; }
.form-group select { -webkit-appearance: none; -moz-appearance: none; appearance: none; background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1em; }
.form-group select:disabled { background-color: #f8f9fa; cursor: not-allowed; }
.form-group-checkbox { display: flex; align-items: center; gap: 0.8rem; }
.form-group-checkbox input { width: 1.2em; height: 1.2em; cursor: pointer; }
.form-group-checkbox label { margin: 0; font-weight: 500; color: #333; cursor: pointer; font-size: 1rem; }
.guest-info-form { padding: 1.5rem; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 1.8rem; background-color: #fdfdfd; display: flex; flex-direction: column; gap: 1.8rem; }
.guest-info-form h4 { margin-top: 0; margin-bottom: 0.5rem; color: #c5a47e; font-size: 1.2rem; }
.guest-info-form p { margin-top: 0; margin-bottom: 0.5rem; color: #777; font-size: 0.9rem;}
hr { border: none; border-top: 1px solid #f0f0f0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
.btn { padding: 14px 35px; font-size: 1.1rem; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; background-color: #c5a47e; color: white; box-shadow: 0 8px 20px rgba(197, 164, 126, 0.3); }
.btn:hover:not(:disabled) { background-color: #b38e64; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(197, 164, 126, 0.4); }
.payment-btn { padding: 16px; font-size: 1.2rem; margin-top: 1rem; width: 100%; }
.payment-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }
.form-fade-enter-active, .form-fade-leave-active { transition: opacity 0.4s ease; }
.form-fade-enter-from, .form-fade-leave-to { opacity: 0; }
@media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } }
</style>