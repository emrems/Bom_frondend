<template>
  <div class="category-products">
    <div class="container">
      <h2 class="section-title">{{ categoryName }}</h2>
      <p class="section-subtitle">Bu koleksiyondaki eşsiz parçaları keşfedin.</p>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <div v-else-if="error" class="error-state">
        <i class="fas fa-exclamation-circle icon-error"></i>
        <p>{{ error }}</p>
      </div>
      
      <div v-else-if="products.length > 0" class="slider-container">
        <swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="30"
          :loop="products.length > 3"
          :pagination="{ clickable: true }"
          :navigation="true"
          :breakpoints="{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 }
          }"
          class="product-swiper"
        >
          <swiper-slide v-for="product in products" :key="product.id">
            <router-link :to="`/product/${product.slug}`" class="product-card-link">
              <div class="product-card">
                <div class="product-image-container">
                  <img :src="product.imageUrl" :alt="product.name" class="product-image" />
                  <div v-if="product.stockQuantity > 0 && product.stockQuantity < 5" class="stock-badge low-stock">Sınırlı Stok</div>
                  <div v-if="product.stockQuantity === 0" class="stock-badge out-of-stock">Tükendi</div>
                </div>
                <div class="product-info">
                  <span class="product-category">{{ product.categoryName }}</span>
                  <h3 class="product-name">{{ product.name }}</h3>
                  <div class="product-footer">
                    <span class="product-price">{{ formatPrice(product.price) }} TL</span>
                    <div class="action-text">
                      İncele <i class="fas fa-arrow-right"></i>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </swiper-slide>
        </swiper>
      </div>

      <div v-if="products.length === 0 && !loading" class="no-products">
        <i class="fas fa-box-open"></i>
        <p>Bu kategoride henüz ürün bulunmamaktadır.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
// GÜNCELLENDİ: Swiper ve modülleri import edildi
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default {
  name: "CategoryProducts",
  components: {
    Swiper,
    SwiperSlide,
  },
  props: ["slug"],
  data() {
    return {
      loading: true,
      error: null,
      products: [],
      categoryName: "",
      apiBaseUrl: 'http://localhost:5294',
    };
  },
  setup() {
    // GÜNCELLENDİ: Swiper modülleri setup içinde tanımlandı
    return {
      modules: [Navigation, Pagination, Autoplay],
    };
  },
  async created() {
    await this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${this.apiBaseUrl}/api/Products/category/slug/${this.slug}`);
        
        this.products = response.data.map(product => ({
          ...product,
          imageUrl: product.imageUrls && product.imageUrls.length > 0
            ? `${this.apiBaseUrl}${product.imageUrls[0]}`
            : 'https://via.placeholder.com/400?text=Resim+Yok'
        }));

        if (this.products.length > 0) {
          this.categoryName = this.products[0].categoryName;
        } else {
          this.categoryName = this.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
      } catch (error) {
        console.error('Ürünler alınırken hata:', error);
        this.error = "Ürünler yüklenirken bir hata oluştu.";
      } finally {
        this.loading = false;
      }
    },
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR').format(price);
    }
  },
  watch: {
    async slug(newSlug, oldSlug) {
      if (newSlug !== oldSlug) {
        await this.fetchProducts();
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Raleway:wght@400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.category-products {
  padding: 4rem 0;
  background-color: #fdfaf6;
}

.container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-title {
  font-family: 'Cormorant Garamond', serif;
  text-align: center;
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: #333;
}
.section-subtitle {
  font-family: 'Raleway', sans-serif;
  text-align: center;
  font-size: 1.1rem;
  color: #777;
  margin-bottom: 4rem;
}

/* YENİ: Slider stilleri */
.slider-container {
  position: relative;
  padding: 0 40px; /* Oklar için yanlarda boşluk */
}
.product-swiper {
  padding-bottom: 4rem !important; /* Pagination için altta boşluk */
}

/* YENİ: Slider navigasyon oklarının stilini markaya özel yapıyoruz */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #c5a47e;
  width: 50px;
  height: 50px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}
:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background-color: #c5a47e;
  color: white;
}
:deep(.swiper-button-next::after),
:deep(.swiper-button-prev::after) {
  font-size: 1.2rem;
  font-weight: 700;
}

/* YENİ: Slider sayfalama noktalarının stilini markaya özel yapıyoruz */
:deep(.swiper-pagination-bullet) {
  background: #aaa;
  width: 10px;
  height: 10px;
  transition: all 0.3s ease;
}
:deep(.swiper-pagination-bullet-active) {
  background: #c5a47e;
  width: 25px;
  border-radius: 5px;
}

/* KART TASARIMI: Ana sayfadaki şık tasarımla aynı */
.product-card-link { text-decoration: none; color: inherit; }
.product-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
}
.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.1);
}
.product-image-container { height: 280px; overflow: hidden; position: relative; }
.product-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
.product-card:hover .product-image { transform: scale(1.08); }
.stock-badge {
  position: absolute;
  top: 12px; left: 12px;
  color: white; padding: 0.3rem 0.7rem;
  border-radius: 50px; font-size: 0.8rem;
  font-weight: 500; font-family: 'Raleway', sans-serif;
  backdrop-filter: blur(5px);
}
.stock-badge.low-stock { background: rgba(230, 126, 34, 0.8); }
.stock-badge.out-of-stock { background: rgba(192, 57, 43, 0.8); }
.product-info { padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column; }
.product-category {
  font-family: 'Raleway', sans-serif;
  font-size: 0.8rem; text-transform: uppercase;
  letter-spacing: 0.5px; color: #999; margin-bottom: 0.5rem;
}
.product-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem; font-weight: 700;
  color: #333; margin: 0; line-height: 1.3; flex-grow: 1;
}
.product-footer {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 1rem; padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}
.product-price {
  font-size: 1.5rem; font-weight: 700;
  color: #c5a47e; font-family: 'Raleway', sans-serif;
}
.action-text {
  font-family: 'Raleway', sans-serif; font-weight: 500;
  font-size: 0.9rem; color: #999;
  opacity: 0; transform: translateX(-10px);
  transition: all 0.3s ease;
}
.product-card:hover .action-text {
  opacity: 1; transform: translateX(0);
  color: #c5a47e;
}
.action-text i { margin-left: 0.3rem; transition: transform 0.3s ease; }
.product-card:hover .action-text i { transform: translateX(3px); }

/* Hata ve Yükleme Durumları */
.loading-state, .error-state, .no-products {
  text-align: center; padding: 4rem; color: #666;
  display: flex; flex-direction: column; align-items: center;
}
.spinner {
  display: inline-block; width: 40px; height: 40px;
  border: 4px solid rgba(197, 164, 126, 0.2);
  border-radius: 50%; border-top-color: #c5a47e;
  animation: spin 1s ease-in-out infinite; margin-bottom: 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }
.error-state .icon-error, .no-products i {
  font-size: 3rem; margin-bottom: 1rem;
  color: #c5a47e;
}
.error-state .icon-error { color: #dc3545; }
</style>