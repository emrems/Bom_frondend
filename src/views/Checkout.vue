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
      </div>
      
      <div v-else-if="processedCartItems.length === 0" class="empty-cart">
        <EmptyCart />
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
import axios from 'axios';
import OrderSummary from '@/components/checkout/OrderSummary.vue';
import PaymentForm from '@/components/checkout/PaymentForm.vue';
import EmptyCart from '@/components/cart/EmptyCart.vue';

export default {
  name: 'Checkout',
  components: {
    OrderSummary,
    PaymentForm,
    EmptyCart
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
    ...mapGetters(['cartItems', 'isAuthenticated', 'user', 'cartId']),
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
    taxAmount() { return this.subtotal * 0.18; },
    shippingFee() { return this.subtotal >= 1000 ? 0 : this.shippingCost; },
    total() { return this.subtotal + this.taxAmount + this.shippingFee; },
  },
  async created() {
    this.loading = true;
    await this.fetchCartDetails();
    this.loading = false;
  },
  methods: {
    ...mapActions(['fetchCartDetails']),
    
    async handlePaymentInitiation(payload) {
      const { shippingAddress, billingAddress, notes } = payload;
      
      const orderData = {
        shippingAddress: shippingAddress,
        billingAddress: billingAddress || shippingAddress, // Fatura adresi null ise teslimat adresini kullan
        notes: notes,
        cartId: null,
        guestFirstName: null,
        guestLastName: null,
        guestEmail: null,
        guestPhone: null,
      };

      if (!this.isAuthenticated) {
        // --- MİSAFİR KULLANICI İSE ---
        orderData.cartId = this.cartId;
        
        // guest bilgileri ana form olan shippingAddress'ten gelir.
        const nameParts = shippingAddress.contactName.split(' ');
        orderData.guestFirstName = nameParts[0] || '';
        orderData.guestLastName = nameParts.slice(1).join(' ') || '';
        orderData.guestEmail = shippingAddress.email;
        orderData.guestPhone = shippingAddress.phoneNumber;
      }

      try {
        const apiUrl = `${this.apiBaseUrl}/api/Orders/place`;
        const response = await axios.post(apiUrl, orderData);
        if (response.data && response.data.iframe_token) {
          this.paymentToken = response.data.iframe_token;
        } else if (response.data && response.data.orderNumber) {
           this.$router.push({ name: 'OrderSuccess', params: { orderId: response.data.id } });
        } else {
          throw new Error(response.data.error || "PayTR'den token alınamadı.");
        }
      } catch (error) {
        this.error = (error.response?.data?.message || error.response?.data) || 'Siparişiniz oluşturulurken bir hata oluştu.';
      }
    },
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Raleway:wght@400;500;700&display=swap');

.checkout {
  padding: 3rem 0;
  min-height: 80vh;
  background-color: #f9f9f9;
  font-family: 'Raleway', sans-serif;
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
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.8rem;
  color: #1a1a1a;
  margin: 0;
}
.back-to-cart {
  color: #c5a47e;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 16px;
  border: 2px solid #c5a47e;
  border-radius: 8px;
  transition: all 0.3s ease;
}
.back-to-cart:hover {
  background: #c5a47e;
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
  border-top: 4px solid #c5a47e;
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
.error-state h3 {
  font-family: 'Cormorant Garamond', serif;
  color: #1a1a1a;
  margin-bottom: 1rem;
  font-size: 2rem;
}
.error-state p {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}
.checkout-content {
  display: grid;
  grid-template-columns: 450px 1fr;
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
  background-color: #c5a47e;
  color: white;
  box-shadow: 0 8px 20px rgba(197, 164, 126, 0.3);
  text-decoration: none;
}
.btn:hover {
  background-color: #b38e64;
  transform: translateY(-2px);
}

@media (max-width: 1024px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
}
</style>