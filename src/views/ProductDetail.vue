<template>
  <div class="product-detail-page">
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

      <div v-else-if="product" class="product-layout">
        <div class="product-gallery">
          <div class="main-image-wrapper">
            <img :src="mainImage" :alt="product.name" class="main-image" />
          </div>
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
          </nav>

          <h1 class="product-title">{{ product.name }}</h1>
          
          <!-- <div class="product-meta">
            <div class="reviews-placeholder">
              <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
              <span>(24 Yorum)</span>
            </div>
            <span class="sku">SKU: {{ product.sku || 'N/A' }}</span>
          </div> -->

          <p class="product-price">{{ formatPrice(product.price) }} TL</p>
          
          <p class="product-short-description">{{ product.description.substring(0, 150) }}...</p>

          <div class="actions-wrapper">
            <div class="quantity-selector">
              <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
              <span class="quantity">{{ quantity }}</span>
              <button @click="increaseQuantity" :disabled="quantity >= product.stockQuantity">+</button>
            </div>
            <button @click="addToCart" class="btn add-to-cart-btn" :disabled="product.stockQuantity === 0">
              <i class="fas fa-shopping-cart"></i> Sepete Ekle
            </button>
            <button class="btn wishlist-btn"><i class="far fa-heart"></i></button>
          </div>
          
          <div class="trust-badges">
            <div class="badge"><i class="fas fa-shield-alt"></i> Güvenli Ödeme</div>
            <div class="badge"><i class="fas fa-shipping-fast"></i> Hızlı Kargo</div>
            <div class="badge"><i class="fas fa-box-open"></i> Kolay İade</div>
          </div>

          <div class="product-details-tabs">
            <div class="tab-headers">
              <button :class="{ active: activeTab === 'description' }" @click="activeTab = 'description'">Açıklama</button>
              <button :class="{ active: activeTab === 'specs' }" @click="activeTab = 'specs'">Özellikler</button>
              <!-- <button :class="{ active: activeTab === 'reviews' }" @click="activeTab = 'reviews'">Yorumlar</button> -->
            </div>
            <div class="tab-content">
              <div v-if="activeTab === 'description'" class="tab-pane">
                <p>{{ product.description || 'Bu ürün hakkında detaylı açıklama bulunmamaktadır.' }}</p>
              </div>
              <div v-if="activeTab === 'specs'" class="tab-pane">
                <ul class="specs-list">
                  <li v-if="product.material"><strong>Malzeme:</strong> <span>{{ product.material }}</span></li>
                  <li v-if="product.weight !== undefined"><strong>Ağırlık:</strong> <span>{{ product.weight }} gram</span></li>
                  <li v-if="product.stockQuantity !== undefined"><strong>Stok:</strong> <span>{{ product.stockQuantity }} adet</span></li>
                </ul>
              </div>
              <div v-if="activeTab === 'reviews'" class="tab-pane">
                <p>Bu ürün için henüz yorum yapılmamıştır.</p>
              </div>
            </div>
          </div>
        </div>
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
      mainImage: 'https://via.placeholder.com/600?text=Yükleniyor',
      apiBaseUrl: 'https://localhost:7135',
      showToast: false,
      toastType: 'success',
      toastTitle: '',
      toastMessage: '',
      activeTab: 'description'
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
    }
  },
  methods: {
    ...mapActions(['addItemToCart', 'fetchCartDetails']),
    showAppToast(type, title, message) {
      this.toastType = type;
      this.toastTitle = title;
      this.toastMessage = message;
      this.showToast = true;
      setTimeout(() => { this.showToast = false; }, 3500);
    },
    async fetchProduct() {
      try {
        this.loading = true; this.error = null; this.product = null; this.quantity = 1;
        const response = await axios.get(`${this.apiBaseUrl}/api/Products/${this.id}`);
        let productData = response.data;
        if (productData && productData.imageUrls && productData.imageUrls.length > 0) {
          productData.imageUrls = productData.imageUrls.map(relativeUrl => `${this.apiBaseUrl}${relativeUrl}`);
          this.mainImage = productData.imageUrls[0];
        } else {
          this.mainImage = 'https://via.placeholder.com/600?text=Resim+Yok';
        }
        this.product = productData;
      } catch (err) {
        this.error = 'Aradığınız ürün bulunamadı veya bir sorun oluştu.';
      } finally {
        this.loading = false;
      }
    },
    setMainImage(imageUrl) { this.mainImage = imageUrl; },
    increaseQuantity() { if (this.product && this.quantity < this.product.stockQuantity) { this.quantity++; } },
    decreaseQuantity() { if (this.quantity > 1) { this.quantity--; } },
    async addToCart() {
      if (!this.product || this.product.stockQuantity === 0) {
        this.showAppToast('error', 'Stokta Yok', 'Bu ürün şu anda stokta bulunmamaktadır.');
        return;
      }
      const existingCartItem = this.cartItems.find(item => item.id === this.product.id);
      const currentQuantityInCart = existingCartItem ? existingCartItem.quantity : 0;
      if ((currentQuantityInCart + this.quantity) > this.product.stockQuantity) {
        this.showAppToast('error', 'Stok Yetersiz!', `Stok limitini aşıyorsunuz.`);
        return;
      }
      try {
        await this.addItemToCart({
          product: { ...this.product, mainImage: this.mainImage },
          quantity: this.quantity,
        });
        this.showAppToast('success', 'Başarılı!', `"${this.product.name}" sepete eklendi.`);
        this.quantity = 1;
      } catch (error) {
        this.showAppToast('error', 'Hata!', 'Ürün sepete eklenirken bir hata oluştu.');
      }
    },
    formatPrice(price) {
      if (typeof price !== 'number') return '';
      return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Raleway:wght@400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.product-detail-page {
  padding: 4rem 0;
  background-color: #fdfaf6;
  font-family: 'Raleway', sans-serif;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Yükleme ve Hata Stilleri */
.loading-state, .error-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; min-height: 60vh; text-align: center;
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

/* Ana İçerik Düzeni */
.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

/* Sol Sütun: Resim Galerisi */
.product-gallery {
  position: sticky; top: 2rem;
}
.main-image-wrapper {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
  cursor: zoom-in;
}
.main-image {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.main-image-wrapper:hover .main-image {
  transform: scale(1.2);
}
.thumbnail-gallery {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}
.thumbnail-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}
.thumbnail-image:hover {
  border-color: #e0e0e0;
}
.thumbnail-image.active {
  border-color: #c5a47e;
  box-shadow: 0 0 10px rgba(197, 164, 126, 0.5);
}

/* Sağ Sütun: Ürün Bilgileri */
.product-info { display: flex; flex-direction: column; }
.breadcrumb { margin-bottom: 1rem; font-size: 0.9rem; color: #888; }
.breadcrumb a { color: #888; text-decoration: none; }
.breadcrumb a:hover { color: #c5a47e; }
.breadcrumb span { margin: 0 0.5rem; }

.product-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 3rem;
  font-weight: 700;
  margin: 0.5rem 0;
  color: #333;
}
.product-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #777;
}
.reviews-placeholder .fa-star, .reviews-placeholder .fa-star-half-alt { color: #f39c12; }
.sku { background-color: #f5f5f5; padding: 0.2rem 0.5rem; border-radius: 4px; }

.product-price {
  font-family: 'Raleway', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #c5a47e;
  margin-bottom: 1.5rem;
}
.product-short-description {
  color: #555;
  line-height: 1.6;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 2rem;
}

/* Aksiyon Butonları */
.actions-wrapper { display: flex; gap: 1rem; margin-bottom: 2rem; }
.quantity-selector { display: flex; align-items: center; border: 1px solid #ddd; border-radius: 8px; }
.quantity-selector button {
  width: 45px; height: 45px; border: none;
  background: transparent; cursor: pointer;
  font-size: 1.5rem; color: #888;
}
.quantity { font-size: 1.2rem; font-weight: 700; padding: 0 1.5rem; }
.btn {
  padding: 14px 25px; font-size: 1.1rem; font-weight: 700;
  border: none; border-radius: 8px; cursor: pointer;
  transition: all 0.3s ease; display: inline-flex;
  align-items: center; justify-content: center; gap: 10px;
}
.add-to-cart-btn { flex-grow: 1; background-color: #c5a47e; color: white; }
.add-to-cart-btn:disabled { background-color: #ccc; cursor: not-allowed; }
.wishlist-btn { background-color: #f5f5f5; color: #333; width: 50px; padding: 0; }

/* Güven Rozetleri */
.trust-badges {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 1.5rem 0;
}
.badge { display: flex; align-items: center; gap: 0.5rem; color: #555; font-size: 0.9rem; }
.badge i { color: #c5a47e; }

/* Sekmeli Alan */
.product-details-tabs { width: 100%; }
.tab-headers { display: flex; border-bottom: 1px solid #ddd; }
.tab-headers button {
  padding: 1rem 1.5rem; border: none; background: transparent;
  font-family: 'Raleway', sans-serif; font-size: 1.1rem;
  font-weight: 600; color: #888; cursor: pointer;
  position: relative;
}
.tab-headers button::after {
  content: ''; position: absolute; bottom: -1px; left: 0;
  width: 100%; height: 2px; background-color: #c5a47e;
  transform: scaleX(0); transition: transform 0.3s ease;
}
.tab-headers button.active { color: #333; }
.tab-headers button.active::after { transform: scaleX(1); }
.tab-content { padding: 2rem 0; color: #555; line-height: 1.7; }
.specs-list { list-style: none; padding: 0; }
.specs-list li { display: flex; justify-content: space-between; padding: 0.8rem 0; border-bottom: 1px solid #f5f5f5; }

/* GÜNCELLENDİ: Eksik Toast stilleri eklendi */
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
.app-toast.success { background: #28a745; color: white; }
.app-toast.error { background: #dc3545; color: white; }
.toast-icon { font-size: 1.8rem; line-height: 1; }
.toast-content { flex-grow: 1; }
.toast-title { display: block; font-weight: 700; font-size: 1.2em; margin-bottom: 0.2em; }
.toast-message { font-size: 0.9em; opacity: 0.9; }
.toast-action-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white; border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 0.6rem 1.2rem; border-radius: 8px;
  text-decoration: none; font-weight: 600; font-size: 0.95rem;
  transition: all 0.2s ease; white-space: nowrap;
}
.toast-action-btn:hover { background: rgba(255, 255, 255, 0.3); border-color: white; }
.toast-slide-fade-enter-active,
.toast-slide-fade-leave-active {
  transition: all 0.5s ease;
}
.toast-slide-fade-enter-from,
.toast-slide-fade-leave-to {
  opacity: 0;
  transform: translateY(50px);
}

/* Responsive */
@media (max-width: 992px) {
  .product-layout { grid-template-columns: 1fr; gap: 3rem; }
  .product-gallery { position: static; }
  .main-image, .main-image-wrapper { max-width: 500px; margin-left: auto; margin-right: auto; }
}
@media (max-width: 768px) {
  .actions-wrapper { flex-direction: column; align-items: stretch; }
  .wishlist-btn { width: 100%; }
}
</style>