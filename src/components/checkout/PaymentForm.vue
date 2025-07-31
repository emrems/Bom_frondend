<template>
  <div class="payment-section">
    <h2>💳 Ödeme Bilgileri</h2>
    
    <div v-if="!paymentToken" class="customer-form">
      <form @submit.prevent="submitForm" class="payment-form">
        <div class="form-group">
          <label for="name">Ad Soyad *</label>
          <input type="text" id="name" v-model="customerInfo.name" required placeholder="Adınız ve soyadınız" />
        </div>
        <div class="form-group">
          <label for="email">E-posta *</label>
          <input type="email" id="email" v-model="customerInfo.email" required placeholder="ornek@email.com" />
        </div>
        <div class="form-group">
          <label for="phone">Telefon *</label>
          <input type="tel" id="phone" v-model="customerInfo.phone" required placeholder="05xxxxxxxxx" />
        </div>
        <div class="form-group">
          <label for="address">Adres *</label>
          <textarea id="address" v-model="customerInfo.address" required rows="3" placeholder="Teslimat adresiniz"></textarea>
        </div>
        <button type="submit" class="btn payment-btn" :disabled="initiatingPayment">
          <span v-if="initiatingPayment">⏳ Ödeme Hazırlanıyor...</span>
          <span v-else>🔒 Güvenli Ödeme</span>
        </button>
      </form>
    </div>

    <div v-if="paymentToken" class="payment-iframe-container">
      <h3>🔒 Güvenli Ödeme - PayTR</h3>
      <p class="payment-info">Ödemenizi tamamlamak için kart bilgilerinizi giriniz.</p>
      <iframe :src="paymentUrl" width="100%" height="500" frameborder="0" class="payment-iframe" title="PayTR Güvenli Ödeme"></iframe>
      <div class="payment-notes"><p><strong>Not:</strong> Ödeme işlemi PayTR güvencesi altında gerçekleşmektedir.</p></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentForm',
  props: {
    paymentToken: String,
  },
  emits: ['initiate-payment'],
  data() {
    return {
      initiatingPayment: false,
      customerInfo: { name: '', email: '', phone: '', address: '' },
    };
  },
  computed: {
    paymentUrl() {
      return this.paymentToken ? `https://www.paytr.com/odeme/guvenli/${this.paymentToken}` : '';
    }
  },
  methods: {
    async submitForm() {
      this.initiatingPayment = true;
      this.$emit('initiate-payment', this.customerInfo);
    },
  }
}
</script>

<style scoped>
.payment-section {
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}
.payment-section h2 {
  color: #1a1a1a;
  margin-top: 0;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 1rem;
}
.payment-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}
.form-group input,
.form-group textarea {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
}
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
}
.btn {
  padding: 14px 35px;
  font-size: 1.15rem;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #d4af37;
  color: white;
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}
.btn:hover {
  background-color: #c49a2e;
  transform: translateY(-2px);
}
.payment-btn {
  padding: 16px;
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 1rem;
}
.payment-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.payment-iframe-container h3 {
  color: #1a1a1a;
}
.payment-info {
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
  border-left: 4px solid #d4af37;
}
</style>