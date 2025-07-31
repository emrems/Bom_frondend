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

      <div v-else-if="processedCartItems.length === 0" class="empty-cart-state">
        <div class="empty-cart-content">
          <i class="fas fa-shopping-basket empty-cart-icon"></i>
          <h2>Sepetinizde ürün bulunmamaktadır.</h2>
          <p>Favori ürünlerinizi keşfetmeye başlayın!</p>
          <router-link to="/" class="primary-btn">Alışverişe Başla</router-link>
        </div>
      </div>

      <div v-else class="cart-content-wrapper">
        <div class="cart-items-list">
          <div v-for="item in processedCartItems" :key="item.id" class="cart-item-card">
            <div class="item-image-wrapper">
              <img :src="item.image" :alt="item.name" class="item-thumbnail" />
            </div>
            
            <div class="item-details-area">
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-unit-price">{{ formatPrice(item.price) }} TL</p>
            </div>
            
            <div class="item-quantity-control">
              <div class="quantity-selector-group">
                <button @click="decreaseQuantity(item)" :disabled="item.quantity <= 1" class="quantity-btn">
                  -
                </button>
                <span class="item-quantity-display">{{ item.quantity }}</span>
                <button @click="increaseQuantity(item)" class="quantity-btn">
                  +
                </button>
              </div>
            </div>
            
            <div class="item-subtotal">
              <span class="subtotal-price">{{ formatPrice(item.price * item.quantity) }} TL</span>
            </div>
            
            <div class="item-action-area">
              <button @click="removeItem(item)" class="remove-item-btn" title="Sepetten Çıkar">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="cart-summary-panel">
          <div class="summary-card">
            <h3 class="summary-title">Sipariş Özeti</h3>
            
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
              <span v-if="subtotal >= 1000" class="free-shipping-text">Ücretsiz</span>
              <span v-else>{{ formatPrice(shippingCost) }} TL</span>
            </div>
            
            <hr class="summary-divider">
            
            <div class="summary-row total-row">
              <span>Toplam:</span>
              <span>{{ formatPrice(total) }} TL</span>
            </div>
            
            <div v-if="subtotal < 1000" class="free-shipping-promo">
              <p>
                Ücretsiz kargo için {{ formatPrice(1000 - subtotal) }} TL daha alışveriş yapın!
              </p>
            </div>
            
            <button @click="goToCheckout" class="primary-btn checkout-button">
              Ödemeye Geç
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios'; 

export default {
  name: 'Cart',
  data() {
    return {
      loading: false,
      shippingCost: 50,
      // YENİ: Backend adresi eklendi.
      apiBaseUrl: 'https://localhost:7135',
    };
  },
  computed: {
    ...mapGetters(['cartItems', 'cartId']),
    
    // YENİ: Resim yollarını işlemek için yeni bir computed property.
    processedCartItems() {
      if (!this.cartItems) return [];
      return this.cartItems.map(item => {
        // Eğer item.image zaten tam bir URL değilse (http ile başlamıyorsa), başına base URL'i ekle.
        const imageUrl = item.image && !item.image.startsWith('http')
          ? `${this.apiBaseUrl}${item.image}`
          : item.image || 'https://via.placeholder.com/150?text=Resim+Yok';
        
        return {
          ...item,
          image: imageUrl // item'ın image özelliğini tam URL ile güncelliyoruz.
        };
      });
    },
    
    subtotal() {
      // GÜNCELLENDİ: Artık işlenmiş listeyi kullanıyoruz.
      return this.processedCartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    },
    
    taxAmount() {
      return this.subtotal * 0.18;
    },
    
    shippingFee() {
      return this.subtotal >= 1000 ? 0 : this.shippingCost;
    },
    
    total() {
      return this.subtotal + this.taxAmount + this.shippingFee;
    }
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
        // GÜNCELLENDİ: API isteğini apiBaseUrl üzerinden yapıyoruz.
        const productResponse = await axios.get(`${this.apiBaseUrl}/api/Products/${item.id}`);
        const productDetail = productResponse.data;

        if (item.quantity + 1 > productDetail.stockQuantity) {
          alert(`Bu üründen stokta sadece ${productDetail.stockQuantity} adet bulunmaktadır. Daha fazla ekleyemezsiniz.`);
          return;
        }

        await this.updateCartItemQuantity({
          productId: item.id,
          quantity: item.quantity + 1
        });
      } catch (error) {
        alert('Miktar artırılırken bir hata oluştu: ' + error.message);
      }
    },
    
    async decreaseQuantity(item) {
      if (item.quantity > 1) {
        try {
          await this.updateCartItemQuantity({
            productId: item.id,
            quantity: item.quantity - 1
          });
        } catch (error) {
          alert('Miktar azaltılırken bir hata oluştu: ' + error.message);
        }
      }
    },
    
    async removeItem(item) {
      try {
        await this.removeItemFromCart(item.id);
      } catch (error) {
        alert(error.message);
      }
    },
    
    goToCheckout() {
      if (this.cartItems.length > 0) {
        this.$router.push('/checkout');
      } else {
        alert('Sepetinizde ürün bulunmamaktadır.');
      }
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
    }
  }
};
</script>

<style scoped>
/* Font Awesome ikonları için */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.cart-page {
  padding: 3rem 0;
  min-height: 80vh;
  background: #fdfdfd;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Yükleme Durumu */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  color: #666;
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

.loading-state p {
  font-size: 1.2rem;
  margin-top: 15px;
}

/* Sepet Başlığı */
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.cart-header h1 {
  font-size: 2.8rem;
  color: #1a1a1a;
  margin: 0;
  font-weight: 700;
}

.continue-shopping-link {
  color: #d4af37;
  text-decoration: none;
  font-weight: 600;
  padding: 10px 20px;
  border: 2px solid #d4af37;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.continue-shopping-link:hover {
  background: #d4af37;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(212, 175, 55, 0.2);
}

/* Boş Sepet Durumu */
.empty-cart-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.empty-cart-content {
  text-align: center;
  background: white;
  padding: 4rem 3rem;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  max-width: 500px;
}

.empty-cart-icon {
  font-size: 5rem;
  color: #ccc;
  margin-bottom: 1.5rem;
  transition: color 0.3s ease;
}

.empty-cart-content:hover .empty-cart-icon {
    color: #d4af37;
}

.empty-cart-content h2 {
  color: #1a1a1a;
  margin-bottom: 1rem;
  font-size: 2.2rem;
  font-weight: 700;
}

.empty-cart-content p {
  color: #666;
  margin-bottom: 2.5rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

.primary-btn {
  padding: 15px 35px;
  font-size: 1.15rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #d4af37;
  color: white;
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
  text-decoration: none;
}

.primary-btn:hover {
  background-color: #c49a2e;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(212, 175, 55, 0.4);
}

/* Sepet İçeriği */
.cart-content-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2.5rem;
}

.cart-items-list {
  background: white;
  border-radius: 15px;
  padding: 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.cart-item-card {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.cart-item-card:last-child {
  border-bottom: none;
}

.item-image-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details-area {
  flex-grow: 1;
}

.item-name {
  font-size: 1.2rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.item-unit-price {
  color: #666;
  font-weight: 500;
  font-size: 1rem;
}

.quantity-selector-group {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f1f1f1;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
  transition: background 0.2s ease;
  color: #333;
}

.quantity-btn:hover:not(:disabled) {
  background: #e0e0e0;
}

.quantity-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #fafafa;
}

.item-quantity-display {
  width: 40px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  color: #1a1a1a;
}

.subtotal-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
}

.remove-item-btn {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background 0.2s ease, color 0.2s ease;
  color: #999;
}

.remove-item-btn:hover {
  background: #ffebeb;
  color: #e74c3c;
}

/* Sipariş Özeti */
.cart-summary-panel {
  position: sticky;
  top: 3rem;
  height: fit-content;
}

.summary-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.summary-title {
  font-size: 1.8rem;
  color: #1a1a1a;
  margin-bottom: 1.8rem;
  text-align: center;
  font-weight: 700;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1.05rem;
  color: #555;
}

.summary-row span:last-child {
    font-weight: 600;
    color: #333;
}

.summary-row.total-row {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-top: 1.5rem;
  border-top: 2px dashed #eee;
  padding-top: 1.5rem;
}

.summary-row.total-row span:last-child {
    color: #d4af37;
}

.summary-divider {
  border: none;
  border-top: 1px solid #f0f0f0;
  margin: 1.5rem 0;
}

.free-shipping-promo {
  background: #e6ffe6;
  padding: 1.2rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  text-align: center;
  border: 1px solid #c8e6c9;
}

.free-shipping-promo p {
  color: #27ae60;
  font-size: 0.95rem;
  margin: 0;
  font-weight: 500;
}

.free-shipping-text {
    color: #27ae60;
    font-weight: 700;
}

.checkout-button {
  width: 100%;
  margin-top: 1.5rem;
}

/* Responsive Düzenlemeler */
@media (max-width: 1024px) {
  .cart-content-wrapper {
    grid-template-columns: 1fr;
  }
  
  .cart-summary-panel {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-header {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 2rem;
  }
  
  .cart-header h1 {
    font-size: 2.2rem;
  }
  
  .continue-shopping-link {
    width: 100%;
    justify-content: center;
  }

  .empty-cart-content {
      padding: 3rem 1.5rem;
  }
  .empty-cart-content h2 {
      font-size: 1.8rem;
  }

  .cart-items-list {
    padding: 0;
    box-shadow: none;
    background: none;
  }
  
  .cart-item-card {
    grid-template-columns: 80px 1fr;
    grid-template-rows: auto auto auto auto;
    gap: 0.5rem;
    padding: 1.5rem;
    border-radius: 15px;
    margin-bottom: 1.5rem;
    background: white;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  }
  
  .item-image-wrapper {
    width: 80px;
    height: 80px;
    grid-row: 1 / 2;
  }
  
  .item-details-area {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }

  .item-quantity-control,
  .item-subtotal,
  .item-action-area {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
  }
  
  .item-quantity-control {
      border-top: 1px solid #f0f0f0;
      padding-top: 1rem;
      margin-top: 1rem;
  }

  .item-quantity-control::before {
      content: "Adet:";
      font-weight: 600;
  }
  
  .item-subtotal::before {
      content: "Ara Toplam:";
      font-weight: 600;
  }
  
  .item-action-area {
      justify-content: flex-end;
  }

  .subtotal-price {
      font-size: 1.3rem;
  }

  .quantity-btn {
      width: 35px;
      height: 35px;
      font-size: 1.1rem;
  }

  .item-quantity-display {
      width: 40px;
      font-size: 1rem;
  }
}
</style>