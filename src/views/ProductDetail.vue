<template>
  <div class="product-detail">
    <div class="container">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Ürün detayları yükleniyor...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ error }}</p>
        <router-link to="/" class="btn back-home-btn">Ana Sayfaya Dön</router-link>
      </div>

      <div v-else-if="product" class="product-content">
        <div class="product-images">
          <img
            :src="mainImage"
            :alt="product.name"
            class="main-image"
          />
          <div v-if="product.imageUrls && product.imageUrls.length > 1" class="thumbnail-gallery">
            <img
              v-for="(imgUrl, index) in product.imageUrls"
              :key="index"
              :src="imgUrl"
              :alt="`${product.name} - ${index + 1}`"
              :class="{ 'active': imgUrl === mainImage }"
              @click="setMainImage(imgUrl)"
              class="thumbnail-image"
            />
          </div>
        </div>

        <div class="product-info">
          <nav class="breadcrumb">
            <router-link to="/">Ana Sayfa</router-link>
            <span>/</span>
            <router-link :to="`/category/${product.categorySlug}`">{{ product.categoryName }}</router-link>
            <span>/</span>
            <span>{{ product.name }}</span>
          </nav>

          <h1>{{ product.name }}</h1>
          <p class="category">{{ product.categoryName }}</p>
          <div class="price">{{ formatPrice(product.price) }} TL</div>
          <div class="description">
            <p>{{ product.description || 'Bu ürün hakkında detaylı açıklama bulunmamaktadır.' }}</p>
          </div>
          <div class="product-specs">
            <h3>Ürün Özellikleri</h3>
            <ul>
              <li v-if="product.material"><strong>Malzeme:</strong> {{ product.material }}</li>
              <li v-if="product.weight !== undefined"><strong>Ağırlık:</strong> {{ product.weight }} gram</li>
              <li v-if="product.sku"><strong>SKU:</strong> {{ product.sku }}</li>
              <li v-if="product.stockQuantity !== undefined"><strong>Stok Durumu:</strong> {{ product.stockQuantity > 0 ? 'Stokta Var' : 'Tükendi' }}</li>
            </ul>
          </div>

          <div class="add-to-cart-section">
            <div class="quantity-selector">
              <label>Adet:</label>
              <div class="quantity-controls">
                <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
                <span class="quantity">{{ quantity }}</span>
                <button @click="increaseQuantity" :disabled="quantity >= product.stockQuantity">+</button>
              </div>
            </div>
            <button @click="addToCart" class="btn add-to-cart-btn" :disabled="product.stockQuantity === 0">
              <i class="fas fa-shopping-cart"></i> Sepete Ekle
            </button>
          </div>
          
          </div>
      </div>
      <div v-else class="no-product-found">
        <i class="fas fa-box-open"></i>
        <p>Ürün bulunamadı.</p>
        <router-link to="/" class="btn back-home-btn">Ana Sayfaya Dön</router-link>
      </div>
    </div>

    <transition name="toast-slide-fade">
      <div v-if="showToast" :class="['app-toast', toastType]">
        <div class="toast-icon">
          <i :class="toastType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'"></i>
        </div>
        <div class="toast-content">
          <strong class="toast-title">{{ toastTitle }}</strong>
          <span class="toast-message">{{ toastMessage }}</span>
        </div>
        <router-link v-if="toastType === 'success'" to="/cart" class="toast-action-btn">Sepete Git</router-link>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'ProductDetail',
  props: ['id'],
  data() {
    return {
      product: null,
      loading: true,
      error: null,
      quantity: 1,
      mainImage: 'https://via.placeholder.com/500/F8F8F8/C0C0C0?text=Resim+Yok',
      apiBaseUrl: 'https://localhost:7135',
      // GÜNCELLENDİ: 'addedToCart' kaldırıldı, Toast state'leri zaten mevcut ve doğru.
      showToast: false,
      toastType: 'success',
      toastTitle: '',
      toastMessage: ''
    };
  },
  computed: {
    ...mapGetters(['cartItems'])
  },
  async created() {
    await this.fetchProduct();
    await this.fetchCartDetails();
  },
  watch: {
    async id() {
      await this.fetchProduct();
      await this.fetchCartDetails();
    }
  },
  methods: {
    ...mapActions(['addItemToCart', 'fetchCartDetails']),
    
    // Toast (bildirim) gösterme metodu (Bu zaten doğruydu)
    showAppToast(type, title, message) {
      this.toastType = type;
      this.toastTitle = title;
      this.toastMessage = message;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3500);
    },

    async fetchProduct() {
      try {
        this.loading = true;
        this.error = null;
        this.product = null;
        this.quantity = 1;
        
        const response = await axios.get(`${this.apiBaseUrl}/api/Products/${this.id}`);
        let productData = response.data;

        if (productData && productData.imageUrls && productData.imageUrls.length > 0) {
          const fullImageUrls = productData.imageUrls.map(relativeUrl => `${this.apiBaseUrl}${relativeUrl}`);
          productData.imageUrls = fullImageUrls;
          this.mainImage = fullImageUrls[0];
        } else {
          this.mainImage = 'https://via.placeholder.com/500/F8F8F8/C0C0C0?text=Resim+Yok';
        }

        this.product = productData;

      } catch (err) {
        console.error('Ürün detayları yüklenirken hata oluştu:', err);
        if (err.response && err.response.status === 404) {
          this.error = 'Aradığınız ürün bulunamadı.';
        } else {
          this.error = 'Ürün detayları yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.';
        }
      } finally {
        this.loading = false;
      }
    },

    setMainImage(imageUrl) {
      this.mainImage = imageUrl;
    },

    increaseQuantity() {
      if (this.product && this.quantity < this.product.stockQuantity) {
        this.quantity++;
      }
    },

    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },

    async addToCart() {
      // Bu metodun mantığı zaten 'showAppToast' kullandığı için doğru.
      if (!this.product || this.product.stockQuantity === 0) {
        this.showAppToast('error', 'Stokta Yok', 'Bu ürün şu anda stokta bulunmamaktadır.');
        return;
      }

      const existingCartItem = this.cartItems.find(item => item.id === this.product.id);
      const currentQuantityInCart = existingCartItem ? existingCartItem.quantity : 0;
      const totalQuantityAfterAdd = currentQuantityInCart + this.quantity;

      if (totalQuantityAfterAdd > this.product.stockQuantity) {
        const remainingStock = this.product.stockQuantity - currentQuantityInCart;
        const message = remainingStock > 0 
          ? `Sepetinize en fazla ${remainingStock} adet daha ekleyebilirsiniz.` 
          : `Bu ürün için sepete eklenebilecek maksimum adete ulaştınız.`;
        this.showAppToast('error', 'Stok Yetersiz!', `Stokta ${this.product.stockQuantity} adet var. ${message}`);
        return;
      }

      try {
        await this.addItemToCart({
          product: { ...this.product, mainImage: this.mainImage },
          quantity: this.quantity,
        });
        
        this.showAppToast('success', 'Sepete Eklendi!', `"${this.product.name}" sepete başarıyla eklendi.`);
        this.quantity = 1;

      } catch (error) {
        console.error('Sepete ekleme hatası:', error);
        this.showAppToast('error', 'Hata!', error.message || 'Ürün sepete eklenirken bir hata oluştu.');
      }
    },

    formatPrice(price) {
      if (typeof price !== 'number') return '';
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
      }).format(price);
    }
  }
};
</script>

<style scoped>
/* CSS styles aynı kalıyor */
.product-detail {
  padding: 3rem 0;
  min-height: 80vh;
  background-color: #f9f9f9;
}
.app-toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  padding: 1.2rem 1.8rem;
  border-radius: 10px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 2000;
  font-size: 1.1rem;
  font-weight: 600;
  min-width: 280px;
  box-sizing: border-box;
}

.app-toast.success {
  background: #28a745;
  color: white;
}

.app-toast.error {
  background: #dc3545;
  color: white;
}

.toast-icon {
  font-size: 1.8rem;
  line-height: 1;
}

.toast-content {
  flex-grow: 1;
}

.toast-title {
  display: block;
  font-weight: 700;
  font-size: 1.2em;
  margin-bottom: 0.2em;
}

.toast-message {
  font-size: 0.9em;
  opacity: 0.9;
}

.toast-action-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.toast-action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
}

/* Toast Geçiş Animasyonları */
.toast-slide-fade-enter-active,
.toast-slide-fade-leave-active {
  transition: all 0.5s ease;
}

.toast-slide-fade-enter-from,
.toast-slide-fade-leave-to {
  opacity: 0;
  transform: translateY(50px);
}
/* ... Diğer tüm CSS kodlarınız ... */

.product-detail {
  padding: 3rem 0;
  min-height: 80vh;
  background-color: #f9f9f9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Loading State */
.loading-state,
.error-state,
.no-product-found {
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

.loading-state p,
.error-state p,
.no-product-found p {
  font-size: 1.2rem;
  margin-top: 15px;
}

.error-state i,
.no-product-found i {
  font-size: 3rem;
  color: #e74c3c;
  margin-bottom: 15px;
}

.no-product-found i {
  color: #d4af37;
}

.back-home-btn {
  margin-top: 20px;
  background-color: #d4af37;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.back-home-btn:hover {
  background-color: #c49a2e;
}


/* Product Content */
.product-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr; 
  gap: 4rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
}

.product-images {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.main-image {
  width: 100%;
  max-width: 450px;
  height: 450px;
  object-fit: contain; 
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}

.thumbnail-gallery {
  display: flex;
  gap: 10px;
  flex-wrap: wrap; 
  justify-content: center;
}

.thumbnail-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid #eee;
  transition: all 0.2s ease;
}

.thumbnail-image:hover,
.thumbnail-image.active {
  border-color: #d4af37;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.breadcrumb {
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: #888;
}

.breadcrumb a {
  color: #d4af37;
  text-decoration: none;
  font-weight: 500;
}

.breadcrumb span {
  margin: 0 0.5rem;
  color: #bbb;
}

.product-info h1 {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  color: #1a1a1a;
  line-height: 1.2;
}

.category {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.price {
  font-size: 2.5rem;
  font-weight: 800;
  color: #d4af37;
  margin-bottom: 2.5rem;
  letter-spacing: -0.5px;
}

.description {
  margin-bottom: 2.5rem;
  border-top: 1px solid #eee;
  padding-top: 2rem;
}

.description p {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #444;
}

.product-specs {
  margin-bottom: 2.5rem;
  padding: 1.8rem;
  background: #fdfdfd;
  border-radius: 10px;
  border: 1px solid #eee;
}

.product-specs h3 {
  margin-bottom: 1.2rem;
  color: #333;
  font-size: 1.4rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.8rem;
}

.product-specs ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-specs li {
  margin-bottom: 0.8rem;
  color: #555;
  font-size: 1rem;
}

.product-specs li strong {
  color: #333;
}

.add-to-cart-section {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-selector label {
  font-weight: 600;
  color: #333;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.quantity-controls button {
  width: 45px;
  height: 45px;
  border: none;
  background: #f1f1f1;
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  transition: background 0.2s ease, color 0.2s ease;
}

.quantity-controls button:hover:not(:disabled) {
  background: #e0e0e0;
  color: #1a1a1a;
}

.quantity-controls button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #fafafa;
}

.quantity {
  width: 70px;
  text-align: center;
  font-weight: 600;
  font-size: 1.2rem;
  color: #1a1a1a;
}

.btn {
  padding: 14px 35px;
  font-size: 1.15rem;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.add-to-cart-btn {
  background-color: #d4af37;
  color: white;
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}

.add-to-cart-btn:hover:not(:disabled) {
  background-color: #c49a2e;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(212, 175, 55, 0.4);
}

.add-to-cart-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
}

.success-message {
  color: #27ae60;
  font-weight: 600;
  padding: 1rem 1.5rem;
  background: #e6ffe6;
  border-radius: 8px;
  border-left: 5px solid #27ae60;
  margin-top: 1.5rem;
  box-shadow: 0 4px 15px rgba(39, 174, 96, 0.15);
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 992px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: 3rem;
    padding: 2rem;
  }

  .main-image {
    max-width: 400px;
    height: 400px;
  }

  .product-info h1 {
    font-size: 2.2rem;
  }

  .price {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .product-detail {
    padding: 2rem 0;
  }
  .product-content {
    padding: 1.5rem;
    gap: 2rem;
  }
  .main-image {
    max-width: 100%;
    height: 300px;
  }
  .product-info h1 {
    font-size: 1.8rem;
  }
  .price {
    font-size: 1.8rem;
  }
  .add-to-cart-section {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  .quantity-selector {
    justify-content: center;
  }
  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .thumbnail-gallery {
    flex-wrap: wrap;
    justify-content: center;
  }
  .thumbnail-image {
    width: 60px;
    height: 60px;
  }
  .main-image {
    height: 250px;
  }
}
</style>