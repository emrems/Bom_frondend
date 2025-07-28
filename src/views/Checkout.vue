<template>
  <div class="checkout">
    <div class="container">
      <div class="checkout-header">
        <h1>💳 Ödeme</h1>
        <router-link to="/cart" class="back-to-cart">
          ← Sepete Dön
        </router-link>
      </div>

      <div v-if="loading" class="loading">
        Ödeme hazırlanıyor...
      </div>

      <div v-else-if="error" class="error">
        <h3>❌ Hata</h3>
        <p>{{ error }}</p>
        <button @click="initPayment" class="btn">Tekrar Dene</button>
      </div>

      <div v-else-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-cart-content">
          <h2>Sepetiniz boş</h2>
          <p>Ödeme yapmak için sepetinizde ürün olması gerekiyor.</p>
          <router-link to="/" class="btn">Alışverişe Başla</router-link>
        </div>
      </div>

      <div v-else class="checkout-content">
        <!-- Sipariş Özeti -->
        <div class="order-summary">
          <h2>📋 Sipariş Özeti</h2>
          
          <div class="summary-items">
            <div v-for="item in cartItems" :key="item.id" class="summary-item">
              <img :src="item.image" :alt="item.name" class="item-image" />
              <div class="item-info">
                <h4>{{ item.name }}</h4>
                <p>{{ item.quantity }} adet × {{ formatPrice(item.price) }} TL</p>
              </div>
              <div class="item-total">
                {{ formatPrice(item.price * item.quantity) }} TL
              </div>
            </div>
          </div>

          <div class="summary-totals">
            <div class="total-row">
              <span>Ara Toplam:</span>
              <span>{{ formatPrice(subtotal) }} TL</span>
            </div>
            <div class="total-row">
              <span>KDV (%18):</span>
              <span>{{ formatPrice(taxAmount) }} TL</span>
            </div>
            <div class="total-row">
              <span>Kargo:</span>
              <span v-if="subtotal >= 1000">Ücretsiz</span>
              <span v-else>{{ formatPrice(shippingCost) }} TL</span>
            </div>
            <hr>
            <div class="total-row final-total">
              <span>Toplam:</span>
              <span>{{ formatPrice(total) }} TL</span>
            </div>
          </div>
        </div>

        <!-- Ödeme Formu -->
        <div class="payment-section">
          <h2>💳 Ödeme Bilgileri</h2>
          
          <div v-if="!paymentToken" class="customer-form">
            <form @submit.prevent="initPayment" class="payment-form">
              <div class="form-group">
                <label for="name">Ad Soyad *</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="customerInfo.name" 
                  required 
                  placeholder="Adınız ve soyadınız"
                />
              </div>

              <div class="form-group">
                <label for="email">E-posta *</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="customerInfo.email" 
                  required 
                  placeholder="ornek@email.com"
                />
              </div>

              <div class="form-group">
                <label for="phone">Telefon *</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="customerInfo.phone" 
                  required 
                  placeholder="05xxxxxxxxx"
                />
              </div>

              <div class="form-group">
                <label for="address">Adres *</label>
                <textarea 
                  id="address" 
                  v-model="customerInfo.address" 
                  required 
                  rows="3"
                  placeholder="Teslimat adresiniz"
                ></textarea>
              </div>

              <button type="submit" class="btn payment-btn" :disabled="initiatingPayment">
                <span v-if="initiatingPayment">⏳ Ödeme Hazırlanıyor...</span>
                <span v-else">🔒 Güvenli Ödeme</span>
              </button>
            </form>
          </div>

          <!-- PayTR Iframe -->
          <div v-if="paymentToken" class="payment-iframe-container">
            <h3>🔒 Güvenli Ödeme - PayTR</h3>
            <p class="payment-info">
              Ödemenizi güvenli bir şekilde tamamlamak için aşağıdaki form aracılığıyla kredi kartı bilgilerinizi giriniz.
            </p>
            
            <iframe 
              :src="paymentUrl" 
              width="100%" 
              height="500" 
              frameborder="0"
              class="payment-iframe"
              title="PayTR Güvenli Ödeme"
            ></iframe>
            
            <div class="payment-notes">
              <p>
                <strong>Not:</strong> Ödeme işlemi PayTR güvencesi altında gerçekleşmektedir. 
                Kredi kartı bilgileriniz 256-bit SSL sertifikası ile korunmaktadır.
              </p>
            </div>
            
            <div class="payment-methods">
              <h4>Güvenli Ödeme Seçenekleri</h4>
              <div class="payment-icons">
                <span class="payment-icon">💳 Kredi Kartı</span>
                <span class="payment-icon">🏦 Banka Kartı</span>
                <span class="payment-icon">📱 Mobil Ödeme</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Checkout',
  data() {
    return {
      cartItems: [],
      loading: true,
      error: null,
      shippingCost: 50,
      paymentToken: null,
      initiatingPayment: false,
      customerInfo: {
        name: '',
        email: '',
        phone: '',
        address: ''
      }
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
    },
    
    paymentUrl() {
      return this.paymentToken ? `https://www.paytr.com/odeme/guvenli/${this.paymentToken}` : ''
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
        this.error = null
      } catch (error) {
        console.error('Sepet yüklenirken hata oluştu:', error)
        this.cartItems = []
        this.error = 'Sepet bilgileri yüklenirken hata oluştu.'
      } finally {
        this.loading = false
      }
    },
    
    async initPayment() {
      if (!this.validateForm()) {
        return
      }

      try {
        this.initiatingPayment = true
        this.error = null

        // Ödeme verileri hazırla
        const paymentData = {
          customer: this.customerInfo,
          items: this.cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          totals: {
            subtotal: this.subtotal,
            tax: this.taxAmount,
            shipping: this.shippingFee,
            total: this.total
          }
        }

        // Backend'e ödeme başlatma isteği gönder
        // Bu örnekte mock response kullanıyoruz
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Mock API response - gerçek API ile değiştirilecek
        const mockToken = this.generateMockToken()
        
        // Gerçek API çağrısı böyle olacak:
        // const response = await fetch('/api/payment/initiate', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(paymentData)
        // })
        // 
        // if (!response.ok) {
        //   throw new Error('Ödeme başlatılamadı')
        // }
        // 
        // const result = await response.json()
        // this.paymentToken = result.token

        this.paymentToken = mockToken

      } catch (error) {
        console.error('Ödeme başlatma hatası:', error)
        this.error = 'Ödeme başlatılırken bir hata oluştu. Lütfen tekrar deneyin.'
      } finally {
        this.initiatingPayment = false
      }
    },
    
    validateForm() {
      if (!this.customerInfo.name.trim()) {
        this.error = 'Ad soyad alanı zorunludur.'
        return false
      }
      
      if (!this.customerInfo.email.trim()) {
        this.error = 'E-posta alanı zorunludur.'
        return false
      }
      
      if (!this.customerInfo.phone.trim()) {
        this.error = 'Telefon alanı zorunludur.'
        return false
      }
      
      if (!this.customerInfo.address.trim()) {
        this.error = 'Adres alanı zorunludur.'
        return false
      }
      
      // E-posta format kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.customerInfo.email)) {
        this.error = 'Geçerli bir e-posta adresi giriniz.'
        return false
      }
      
      return true
    },
    
    generateMockToken() {
      // Mock token oluştur - gerçek API'den gelecek
      return 'mock_' + Math.random().toString(36).substr(2, 16)
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR').format(price)
    }
  }
}
</script>

<style scoped>
.checkout {
  padding: 2rem 0;
  min-height: 80vh;
  background: #f8f9fa;
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
  font-size: 2.5rem;
  color: #1a1a1a;
  margin: 0;
}

.back-to-cart {
  color: #d4af37;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border: 2px solid #d4af37;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.back-to-cart:hover {
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

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.order-summary,
.payment-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: fit-content;
}

.order-summary h2,
.payment-section h2 {
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.summary-items {
  margin-bottom: 2rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.summary-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  color: #1a1a1a;
  margin-bottom: 0.3rem;
  font-size: 1rem;
}

.item-info p {
  color: #666;
  font-size: 0.9rem;
}

.item-total {
  font-weight: 600;
  color: #d4af37;
}

.summary-totals {
  padding-top: 1rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  font-size: 1rem;
}

.total-row.final-total {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-top: 1rem;
}

.summary-totals hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 1rem 0;
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
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #d4af37;
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

.payment-iframe-container {
  margin-top: 2rem;
}

.payment-iframe-container h3 {
  color: #1a1a1a;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.payment-info {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.payment-iframe {
  border: 2px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.payment-notes {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #d4af37;
}

.payment-notes p {
  color: #555;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .checkout-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .checkout-header h1 {
    font-size: 2rem;
  }
  
  .order-summary,
  .payment-section {
    padding: 1.5rem;
  }
  
  .summary-item {
    flex-wrap: wrap;
    gap: 0.8rem;
  }
  
  .item-info {
    flex: 1 1 100%;
  }
}
</style>