<template>
  <section class="products">
    <div class="container">
      <h2 class="section-title">Koleksiyonumuz</h2>
      <p class="section-subtitle">Tüm tasarımlarımız arasında gezinin ve ruhunuza dokunan parçayı bulun.</p>
    </div>
    
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="$emit('retry-fetch')" class="retry-btn">Tekrar Dene</button>
    </div>

    <div v-else-if="products.length > 0" class="swiper-wrapper-container">
      <swiper
        :modules="modules"
        :slides-per-view="'auto'"
        :space-between="30"
        :loop="true"
        :speed="8000"
        :autoplay="{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true, // Fare üzerine gelince durur
        }"
        :free-mode="true"
        class="product-swiper"
      >
        <swiper-slide v-for="product in duplicatedProducts" :key="product.uniqueKey">
          <router-link :to="`/product/${product.id}`" class="product-card-link">
            <div class="product-card">
              <div class="product-image-container">
                <img :src="getProductImage(product)" :alt="product.name" class="product-image" />
              </div>
              <div class="product-overlay">
                <div class="product-info">
                  <span class="product-category">{{ product.categoryName }}</span>
                  <h3 class="product-name">{{ product.name }}</h3>
                </div>
                <div class="action-button">
                  <span>Detayları Gör</span>
                  <i class="fas fa-arrow-right"></i>
                </div>
              </div>
            </div>
          </router-link>
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

export default {
  name: 'ProductListSection',
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    products: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: true
    },
    error: {
      type: String,
      default: null
    }
  },
  setup() {
    return {
      modules: [Autoplay, FreeMode],
    };
  },
  computed: {
    // Kesintisiz döngü efekti için ürün listesini kopyalıyoruz.
    duplicatedProducts() {
      // Akıcılık için slayt sayısını artıralım
      if (this.products.length > 0 && this.products.length < 10) {
         const combined = [...this.products, ...this.products];
         return combined.map((p, index) => ({ ...p, uniqueKey: `${p.id}-${index}` }));
      }
      return this.products.map((p, index) => ({ ...p, uniqueKey: `${p.id}-${index}` }));
    }
  },
  methods: {
    getProductImage(product) {
      // Parent'tan (Home.vue) gelen işlenmiş imageUrl kullanılıyor.
      return product.imageUrl || 'https://via.placeholder.com/400?text=Resim+Yok';
    },
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR').format(price);
    }
  }
};
</script>

<style scoped>
/* Stiller, beğendiğiniz profesyonel slider ile birebir aynı olacak şekilde güncellendi */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Raleway:wght@400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.products {
  padding: 5rem 0;
  background-color: #f8f9fa; /* Hafif farklı bir arka plan */
  overflow: hidden;
}
.container {
  max-width: 100%; /* Tam genişlikte akış için */
  padding: 0;
  text-align: center;
}
.section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: #333;
}
.section-subtitle {
  font-family: 'Raleway', sans-serif;
  font-size: 1.1rem;
  color: #777;
  margin-bottom: 3rem;
}
.product-swiper {
  transition-timing-function: linear !important;
}
.swiper-wrapper-container {
  position: relative;
}
.swiper-wrapper-container::before,
.swiper-wrapper-container::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 150px;
  z-index: 2;
  pointer-events: none;
}
.swiper-wrapper-container::before {
  left: 0;
  background: linear-gradient(to right, #f8f9fa 20%, transparent);
}
.swiper-wrapper-container::after {
  right: 0;
  background: linear-gradient(to left, #f8f9fa 20%, transparent);
}
.product-swiper .swiper-slide {
  width: 320px !important;
  height: 420px !important;
}
.product-card-link {
  display: block;
  width: 100%;
  height: 100%;
  text-decoration: none;
}
.product-card {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.4s ease;
}
/* Üzerine gelince odaklanma (parlama) efekti */
.product-swiper:hover .product-card {
  opacity: 0.5;
}
.product-swiper:hover .product-card:hover {
  opacity: 1;
  transform: scale(1.05);
  z-index: 10;
}
.product-image-container {
  width: 100%;
  height: 100%;
}
.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.product-card:hover .product-image {
  transform: scale(1.1);
}
.product-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  text-align: left;
}
.product-category {
  font-family: 'Raleway', sans-serif;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.4s ease;
  transition-delay: 0.1s;
}
.product-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.7rem;
  margin: 0.2rem 0 0;
  line-height: 1.2;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.4s ease;
}
.product-card:hover .product-category,
.product-card:hover .product-name {
  opacity: 1;
  transform: translateY(0);
}
.action-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  color: #fff;
  background-color: #c5a47e;
  padding: 0.7rem 1.2rem;
  border-radius: 50px;
  margin-top: 1.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s ease;
  transition-delay: 0.2s;
}
.product-card:hover .action-button {
  opacity: 1;
  transform: translateY(0);
}
.action-button i {
  transition: transform 0.3s ease;
}
.product-card:hover .action-button i {
  transform: translateX(5px);
}
.loading-state, .error-state {
  text-align: center;
  padding: 4rem;
  color: #666;
}
.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(197, 164, 126, 0.2);
  border-radius: 50%;
  border-top-color: #c5a47e;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.retry-btn {
  margin-top: 1rem;
  padding: 0.7rem 1.5rem;
  background: #c5a47e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.retry-btn:hover {
  background: #b38e64;
}
</style>