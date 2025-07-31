<template>
  <div class="checkout">
    <div class="container">
      <div class="checkout-header">
        <h1>💳 Ödeme</h1>
        <router-link to="/cart" class="back-to-cart">
          ← Sepete Dön
        </router-link>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Ödeme sayfası hazırlanıyor...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <h3>❌ Hata</h3>
        <p>{{ error }}</p>
        <button @click="initPayment" class="btn">Tekrar Dene</button>
      </div>
      
      <div v-else-if="processedCartItems.length === 0" class="empty-cart">
        <div class="empty-cart-content">
          <h2>Sepetiniz boş</h2>
          <p>Ödeme yapmak için sepetinizde ürün olması gerekiyor.</p>
          <router-link to="/" class="btn">Alışverişe Başla</router-link>
        </div>
      </div>

      <div v-else class="checkout-content">
        <OrderSummary
          :items="processedCartItems"
          :subtotal="subtotal"
          :taxAmount="taxAmount"
          :shippingFee="shippingFee"
          :total="total"
        />
        
        <PaymentForm
          :paymentToken="paymentToken"
          @initiate-payment="handlePaymentInitiation"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import OrderSummary from '@/components/checkout/OrderSummary.vue';
import PaymentForm from '@/components/checkout/PaymentForm.vue';

export default {
  name: 'Checkout',
  components: {
    OrderSummary,
    PaymentForm,
  },
  data() {
    return {
      loading: false,
      error: null,
      shippingCost: 50,
      paymentToken: null,
      apiBaseUrl: 'https://localhost:7135',
    }
  },
  computed: {
    ...mapGetters(['cartItems', 'isAuthenticated', 'user']),
    
    processedCartItems() {
      if (!this.cartItems) return [];
      return this.cartItems.map(item => ({
        ...item,
        image: item.image && !item.image.startsWith('http')
          ? `${this.apiBaseUrl}${item.image}`
          : item.image || 'https://via.placeholder.com/150?text=Resim+Yok'
      }));
    },

    subtotal() {
      return this.processedCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    taxAmount() {
      return this.subtotal * 0.18;
    },
    
    shippingFee() {
      return this.subtotal >= 1000 ? 0 : this.shippingCost;
    },
    
    total() {
      return this.subtotal + this.taxAmount + this.shippingFee;
    },
  },
  async created() {
    this.loading = true;
    await this.fetchCartDetails();
    this.loading = false;
  },
  methods: {
    ...mapActions(['fetchCartDetails']),
    
    async handlePaymentInitiation(customerInfo) {
      try {
        const paymentData = {
          customer: customerInfo,
          items: this.processedCartItems.map(item => ({
            id: item.id, name: item.name, price: item.price, quantity: item.quantity
          })),
          totalAmount: this.total,
        };

        console.log('Sending to payment API:', paymentData);
        // Gerçek API çağrısı burada yapılacak.
        // const response = await axios.post(`${this.apiBaseUrl}/api/payment/initiate`, paymentData);
        // this.paymentToken = response.data.token;
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.paymentToken = 'mock_' + Math.random().toString(36).substr(2, 16);

      } catch (error) {
        console.error('Ödeme başlatma hatası:', error)
        this.error = 'Ödeme başlatılırken bir hata oluştu. Lütfen tekrar deneyin.'
      }
    },
    formatPrice(price) {
        return new Intl.NumberFormat('tr-TR').format(price)
    }
  }
}
</script>

<style scoped>
.checkout {
  padding: 3rem 0;
  min-height: 80vh;
  background-color: #f9f9f9;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.checkout-header h1 {
  font-size: 2.8rem;
  color: #1a1a1a;
  margin: 0;
}
.back-to-cart {
  color: #d4af37;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 16px;
  border: 2px solid #d4af37;
  border-radius: 8px;
  transition: all 0.3s ease;
}
.back-to-cart:hover {
  background: #d4af37;
  color: white;
}
.loading-state, .error-state, .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    text-align: center;
}
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #d4af37;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.empty-cart-content {
  background: white;
  padding: 3rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
.empty-cart-content h2 {
  color: #1a1a1a;
  margin-bottom: 1rem;
  font-size: 2rem;
}
.empty-cart-content p {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}
.checkout-content {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 3rem;
  align-items: start;
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
  text-decoration: none;
}
.btn:hover {
  background-color: #c49a2e;
  transform: translateY(-2px);
}

@media (max-width: 1024px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
}
</style>