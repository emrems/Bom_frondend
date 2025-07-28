<template>
  <div class="cart">
    <div class="container">
      <div class="cart-header">
        <h1>🛒 Sepetim</h1>
        <router-link to="/" class="continue-shopping">
          ← Alışverişe Devam Et
        </router-link>
      </div>

      <div v-if="loading" class="loading">
        Sepet yükleniyor...
      </div>

      <div v-else-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-cart-content">
          <h2>Sepetiniz boş</h2>
          <p>Henüz sepetinize ürün eklemediniz.</p>
          <router-link to="/" class="btn">Alışverişe Başla</router-link>
        </div>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="item-image">
              <img :src="item.image" :alt="item.name" />
            </div>
            
            <div class="item-details">
              <h3>{{ item.name }}</h3>
              <p class="item-price">{{ formatPrice(item.price) }} TL</p>
            </div>
            
            <div class="item-quantity">
              <div class="quantity-controls">
                <button @click="decreaseQuantity(item)" :disabled="item.quantity <= 1">
                  -
                </button>
                <span class="quantity">{{ item.quantity }}</span>
                <button @click="increaseQuantity(item)">
                  +
                </button>
              </div>
            </div>
            
            <div class="item-total">
              <span class="total-price">{{ formatPrice(item.price * item.quantity) }} TL</span>
            </div>
            
            <div class="item-actions">
              <button @click="removeItem(item)" class="remove-btn" title="Sepetten Çıkar">
                🗑️
              </button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <div class="summary-card">
            <h3>Sipariş Özeti</h3>
            
            <div class="summary-row">
              <span>Ara Toplam:</span>
              <span>{{ formatPrice(subtotal) }} TL</span>
            </div>
            
            <div class="summary-row">
              <span>KDV (%18):</span>
              <span>{{ formatPrice(taxAmount) }} TL</span>
            </div>
            
            <div class="summary-row">
              <span>Kargo:</span>
              <span v-if="subtotal >= 1000">Ücretsiz</span>
              <span v-else>{{ formatPrice(shippingCost) }} TL</span>
            </div>
            
            <hr>
            
            <div class="summary-row total">
              <span>Toplam:</span>
              <span>{{ formatPrice(total) }} TL</span>
            </div>
            
            <div v-if="subtotal < 1000" class="free-shipping-info">
              <p>
                Ücretsiz kargo için {{ formatPrice(1000 - subtotal) }} TL daha alışveriş yapın!
              </p>
            </div>
            
            <button @click="goToCheckout" class="btn checkout-btn">
              Ödemeye Geç
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  data() {
    return {
      cartItems: [],
      loading: true,
      shippingCost: 50
    }
  },
  computed: {
    subtotal() {
      return this.cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    },
    
    taxAmount() {
      return this.subtotal * 0.18
    },
    
    shippingFee() {
      return this.subtotal >= 1000 ? 0 : this.shippingCost
    },
    
    total() {
      return this.subtotal + this.taxAmount + this.shippingFee
    }
  },
  mounted() {
    this.loadCart()
  },
  methods: {
    loadCart() {
      try {
        this.loading = true
        // localStorage'dan sepet verilerini yükle
        const savedCart = localStorage.getItem('cartItems')
        this.cartItems = savedCart ? JSON.parse(savedCart) : []
      } catch (error) {
        console.error('Sepet yüklenirken hata oluştu:', error)
        this.cartItems = []
      } finally {
        this.loading = false
      }
    },
    
    saveCart() {
      try {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems))
        // Header'daki sepet sayısını güncelle
        window.dispatchEvent(new Event('cartUpdated'))
      } catch (error) {
        console.error('Sepet kaydedilirken hata oluştu:', error)
      }
    },
    
    increaseQuantity(item) {
      item.quantity++
      this.saveCart()
    },
    
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--
        this.saveCart()
      }
    },
    
    removeItem(item) {
      const index = this.cartItems.findIndex(cartItem => cartItem.id === item.id)
      if (index > -1) {
        this.cartItems.splice(index, 1)
        this.saveCart()
      }
    },
    
    goToCheckout() {
      if (this.cartItems.length > 0) {
        this.$router.push('/checkout')
      }
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR').format(price)
    }
  }
}
</script>

<style scoped>
.cart {
  padding: 2rem 0;
  min-height: 80vh;
  background: #f8f9fa;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.cart-header h1 {
  font-size: 2.5rem;
  color: #1a1a1a;
  margin: 0;
}

.continue-shopping {
  color: #d4af37;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border: 2px solid #d4af37;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.continue-shopping:hover {
  background: #d4af37;
  color: #1a1a1a;
}

.empty-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.empty-cart-content {
  text-align: center;
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

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.cart-items {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details h3 {
  font-size: 1.2rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.item-price {
  color: #d4af37;
  font-weight: 600;
  font-size: 1.1rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 2px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.quantity-controls button {
  width: 35px;
  height: 35px;
  border: none;
  background: #f8f9fa;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: background 0.2s;
}

.quantity-controls button:hover:not(:disabled) {
  background: #e9ecef;
}

.quantity-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  width: 50px;
  text-align: center;
  font-weight: 600;
  padding: 0 0.5rem;
}

.total-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a1a;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.remove-btn:hover {
  background: #ffe6e6;
}

.cart-summary {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.summary-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.summary-card h3 {
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  text-align: center;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.summary-row.total {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-top: 1rem;
}

.summary-card hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 1rem 0;
}

.free-shipping-info {
  background: #e8f5e8;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  text-align: center;
}

.free-shipping-info p {
  color: #27ae60;
  font-size: 0.9rem;
  margin: 0;
}

.checkout-btn {
  width: 100%;
  padding: 16px;
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 1rem;
}

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .cart-header h1 {
    font-size: 2rem;
  }
  
  .cart-item {
    grid-template-columns: 80px 1fr;
    grid-template-rows: auto auto auto;
    gap: 0.8rem;
  }
  
  .item-image {
    width: 80px;
    height: 80px;
  }
  
  .item-quantity,
  .item-total,
  .item-actions {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .quantity-controls {
    flex: 0 0 auto;
  }
}
</style>