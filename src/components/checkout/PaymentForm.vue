  <template>
    <div class="payment-section">
      <div class="section-header">
        <i class="fas fa-truck"></i>
        <h2>Teslimat Bilgileri</h2>
      </div>
      
      <transition name="form-fade" mode="out-in">
        <div v-if="!paymentToken" key="form" class="customer-form">
          <form @submit.prevent="submitForm" class="payment-form">
            
            <div class="form-group floating-label">
              <input type="text" id="addressTitle" v-model="customerInfo.addressTitle" required placeholder=" " />
              <label for="addressTitle">Adres Başlığı *</label>
              <i class="fas fa-map-pin form-icon"></i>
            </div>

            <div class="form-group floating-label">
              <input type="text" id="contactName" v-model="customerInfo.contactName" required placeholder=" " />
              <label for="contactName">Ad Soyad *</label>
              <i class="fas fa-user form-icon"></i>
            </div>

            <div class="form-group floating-label">
              <input type="email" id="email" v-model="customerInfo.email" required placeholder=" " />
              <label for="email">E-posta *</label>
              <i class="fas fa-envelope form-icon"></i>
            </div>

            <div class="form-group floating-label">
              <input type="tel" id="phoneNumber" v-model="customerInfo.phoneNumber" required placeholder=" " />
              <label for="phoneNumber">Telefon *</label>
              <i class="fas fa-phone-alt form-icon"></i>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="city">İl *</label>
                <select id="city" v-model="selectedCityId" @change="onCityChange" required>
                  <option value="" disabled>İl seçiniz</option>
                  <option v-for="city in cities" :key="city.id" :value="city.id">
                    {{ city.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label for="district">İlçe *</label>
                <select id="district" v-model="customerInfo.district" :disabled="!selectedCityId" required>
                  <option value="" disabled>İlçe seçiniz</option>
                  <option v-for="district in districts" :key="district.id" :value="district.name">
                    {{ district.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group floating-label">
              <textarea id="fullAddress" v-model="customerInfo.fullAddress" required rows="3" placeholder=" "></textarea>
              <label for="fullAddress">Açık Adres *</label>
            </div>

            <button type="submit" class="btn payment-btn" :disabled="initiatingPayment">
              <span v-if="initiatingPayment">⏳ Ödeme Hazırlanıyor...</span>
              <span v-else>🔒 Güvenli Ödeme</span>
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
    </div>
  </template>

  <script>
  import axios from 'axios';
  import { mapGetters } from 'vuex';

  export default {
    name: 'PaymentForm',
    props: { paymentToken: String },
    emits: ['initiate-payment'],
    data() {
      return {
        initiatingPayment: false,
        customerInfo: {
          addressTitle: '', contactName: '', email: '', phoneNumber: '',
          city: '', district: '', fullAddress: '', postalCode: ''
        },
        apiBaseUrl: 'https://localhost:7135',
        cities: [],
        districts: [],
        selectedCityId: '', 
      };
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'user']),
      paymentUrl() {
        return this.paymentToken ? `https://www.paytr.com/odeme/guvenli/${this.paymentToken}` : '';
      }
    },
    async created() {
      await this.fetchCities();
      this.prefillFormIfLoggedIn();
    },
    methods: {
      prefillFormIfLoggedIn() {
        if (this.isAuthenticated && this.user) {
          this.customerInfo.contactName = `${this.user.firstName} ${this.user.lastName}`;
          this.customerInfo.email = this.user.email;
          this.customerInfo.phoneNumber = this.user.phoneNumber || '';
        }
      },
      async fetchCities() {
        try {
          const turkeyId = 1; 
          const response = await axios.get(`${this.apiBaseUrl}/api/locations/cities/${turkeyId}`);
          this.cities = response.data.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
        } catch (error) { console.error("İl listesi çekilirken hata oluştu:", error); }
      },
      async fetchDistricts(cityId) {
        if (!cityId) { this.districts = []; return; }
        try {
          const response = await axios.get(`${this.apiBaseUrl}/api/locations/districts/${cityId}`);
          this.districts = response.data.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
        } catch (error) { console.error("İlçe listesi çekilirken hata oluştu:", error); this.districts = []; }
      },
      async onCityChange() {
        this.customerInfo.district = '';
        const selectedCityObject = this.cities.find(c => c.id === this.selectedCityId);
        if (selectedCityObject) { this.customerInfo.city = selectedCityObject.name; }
        await this.fetchDistricts(this.selectedCityId);
      },
      async submitForm() {
        if (!this.customerInfo.district) { alert("Lütfen bir ilçe seçiniz."); return; }
        this.initiatingPayment = true;
        const deliveryInfo = { ...this.customerInfo };
        this.$emit('initiate-payment', deliveryInfo);
        setTimeout(() => { if (this.initiatingPayment) { this.initiatingPayment = false; } }, 5000);
      },
    },
    watch: {
      user(newUser) { if (newUser) { this.prefillFormIfLoggedIn(); } }
    }
  }
  </script>

  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;700&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

  .payment-section {
    background: white;
    padding: 2.5rem;
    border-radius: 15px;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
    font-family: 'Raleway', sans-serif;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #1a1a1a;
    margin-top: 0;
    margin-bottom: 2.5rem;
    font-size: 1.2rem;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 1.5rem;
  }
  .section-header i {
    color: #c5a47e;
    font-size: 1.5rem;
  }
  .section-header h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  .payment-form {
    display: flex;
    flex-direction: column;
    gap: 1.8rem;
  }
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.8rem;
  }

  /* Kayan Etiket (Floating Label) Stilleri */
  .form-group {
    position: relative;
  }
  .form-group.floating-label label {
    position: absolute;
    top: 14px;
    left: 40px;
    color: #999;
    font-size: 1rem;
    transition: all 0.2s ease-out;
    pointer-events: none;
    background-color: white;
    padding: 0 5px;
  }

  /* Select kutuları için normal etiket */
  .form-group label {
    font-weight: 500;
    color: #555;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  .form-group.floating-label label {
    margin-bottom: 0; /* floating label için alttaki boşluğu sıfırla */
    font-weight: 400;
  }


  .form-group input,
  .form-group textarea,
  .form-group select {
    padding: 14px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    font-family: 'Raleway', sans-serif;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;
  }
  .form-group.floating-label input,
  .form-group.floating-label textarea {
    padding-left: 42px;
  }
  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
    outline: none;
    border-color: #c5a47e;
    box-shadow: 0 0 0 3px rgba(197, 164, 126, 0.2);
  }

  .form-group input:focus + label,
  .form-group input:not(:placeholder-shown) + label,
  .form-group textarea:focus + label,
  .form-group textarea:not(:placeholder-shown) + label {
    top: -10px;
    left: 35px;
    font-size: 0.8rem;
    color: #c5a47e;
    font-weight: 500;
  }
  .form-icon {
    position: absolute;
    top: 15px;
    left: 15px;
    color: #ccc;
    transition: color 0.2s ease-out;
  }
  .form-group input:focus ~ .form-icon {
    color: #c5a47e;
  }

  .form-group select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1em;
  }
  .form-group select:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }

  .btn {
    padding: 14px 35px;
    font-size: 1.1rem;
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #c5a47e;
    color: white;
    box-shadow: 0 8px 20px rgba(197, 164, 126, 0.3);
  }
  .btn:hover:not(:disabled) {
    background-color: #b38e64;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(197, 164, 126, 0.4);
  }
  .payment-btn {
    padding: 16px;
    font-size: 1.2rem;
    margin-top: 1rem;
  }
  .payment-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  .payment-iframe-container .payment-info {
    color: #666;
    margin-bottom: 1.5rem;
  }
  .payment-iframe {
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  .payment-notes {
    margin-top: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-left: 4px solid #c5a47e;
  }

  /* Form ve Iframe arası geçiş animasyonu */
  .form-fade-enter-active,
  .form-fade-leave-active {
    transition: opacity 0.4s ease;
  }
  .form-fade-enter-from,
  .form-fade-leave-to {
    opacity: 0;
  }

  @media (max-width: 768px) {
      .form-row {
          grid-template-columns: 1fr;
          gap: 1.8rem;
      }
  }
  </style>