<template>
  <div class="cart-page">
    <div class="container">
      <div class="cart-header">
        <h1>🛒 Sepetim</h1>
        <router-link to="/" class="continue-shopping-link">
          ← Alışverişe Devam Et
        </router-link>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Sepetiniz yükleniyor...</p>
      </div>

      <EmptyCart v-else-if="processedCartItems.length === 0" />

      <div v-else class="cart-content-wrapper">
        <CartItemsList
          :items="processedCartItems"
          @increase="increaseQuantity"
          @decrease="decreaseQuantity"
          @remove="removeItem"
        />
        <CartSummary
          :subtotal="subtotal"
          :taxAmount="taxAmount"
          :shippingCost="shippingCost"
          :total="total"
          @go-to-checkout="goToCheckout"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';
import CartItemsList from '@/components/cart/CartItemsList.vue';
import CartSummary from '@/components/cart/CartSummary.vue';
import EmptyCart from '@/components/cart/EmptyCart.vue';

export default {
  name: 'Cart',
  components: {
    CartItemsList,
    CartSummary,
    EmptyCart,
  },
  data() {
    return {
      loading: false,
      shippingCost: 50,
      apiBaseUrl: 'https://localhost:7135',
    };
  },
  computed: {
    ...mapGetters(['cartItems']),
    
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
    total() { return this.subtotal + this.taxAmount + this.shippingFee; }
  },
  async mounted() {
    this.loading = true;
    try {
      await this.fetchCartDetails();
    } catch (error) {
      console.error('Sepet detayları çekilirken hata oluştu:', error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    ...mapActions(['removeItemFromCart', 'updateCartItemQuantity', 'fetchCartDetails']),
    
    async increaseQuantity(item) {
      try {
        const productResponse = await axios.get(`${this.apiBaseUrl}/api/Products/${item.id}`);
        const stock = productResponse.data.stockQuantity;
        if (item.quantity < stock) {
          await this.updateCartItemQuantity({ productId: item.id, quantity: item.quantity + 1 });
        } else {
          alert(`Stokta sadece ${stock} adet mevcut.`);
        }
      } catch (error) {
        alert('Miktar artırılırken bir hata oluştu: ' + error.message);
      }
    },
    
    async decreaseQuantity(item) {
      if (item.quantity > 1) {
        await this.updateCartItemQuantity({ productId: item.id, quantity: item.quantity - 1 });
      }
    },
    
    async removeItem(item) {
      await this.removeItemFromCart(item.id);
    },
    
    goToCheckout() {
      this.$router.push('/checkout');
    }
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.cart-page { padding: 3rem 0; min-height: 80vh; background: #fdfdfd; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
.loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; text-align: center; color: #666; }
.spinner { border: 4px solid #f3f3f3; border-top: 4px solid #d4af37; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin-bottom: 20px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.cart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1.5rem; }
.cart-header h1 { font-size: 2.8rem; color: #1a1a1a; margin: 0; font-weight: 700; }
.continue-shopping-link { color: #d4af37; text-decoration: none; font-weight: 600; padding: 10px 20px; border: 2px solid #d4af37; border-radius: 8px; transition: all 0.3s ease; }
.continue-shopping-link:hover { background: #d4af37; color: white; }
.cart-content-wrapper { display: grid; grid-template-columns: 2fr 1fr; gap: 2.5rem; }
@media (max-width: 1024px) { .cart-content-wrapper { grid-template-columns: 1fr; } }
</style>