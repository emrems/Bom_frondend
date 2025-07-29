<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>En Güzel Mücevherler</h1>
          <p>Özel tasarım altın ve mücevher koleksiyonumuzu keşfedin</p>
          <a href="#products" class="btn hero-btn">Ürünleri İncele</a>
        </div>
      </div>
    </section>

    <!-- Featured Slider -->
    <section class="featured-slider">
      <div class="container">
        <h2>Öne Çıkan Ürünler</h2>
        <swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="30"
          :pagination="{ clickable: true }"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
          :breakpoints="{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }"
          class="swiper-container"
        >
          <swiper-slide v-for="product in featuredProducts" :key="product.id">
            <div class="slide-content" @click="goToProduct(product.id)">
              <img :src="getProductImage(product)" :alt="product.name" />
              <div class="slide-overlay">
                <h3>{{ product.name }}</h3>
                <p>{{ formatPrice(product.price) }} TL</p>
                <p class="slide-category">{{ product.categoryName }}</p>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </section>

    <!-- Campaign Section -->
    <section class="campaigns">
      <div class="container">
        <h2>Özel Kampanyalar</h2>
        <div class="campaign-grid">
          <div class="campaign-card">
            <h3>%20 İndirim</h3>
            <p>Altın yüzük kategorisinde</p>
          </div>
          <div class="campaign-card">
            <h3>Ücretsiz Kargo</h3>
            <p>1000 TL üzeri alışverişlerde</p>
          </div>
          <div class="campaign-card">
            <h3>Taksit İmkanı</h3>
            <p>12 aya varan taksit seçenekleri</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Products Section -->
    <section id="products" class="products">
      <div class="container">
        <h2>Ürünlerimiz</h2>
        
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          Ürünler yükleniyor...
        </div>
        
        <div v-else-if="error" class="error">
          {{ error }}
          <button @click="fetchProducts" class="retry-btn">Tekrar Dene</button>
        </div>
        
        <div v-else class="product-grid">
          <div 
            v-for="product in products" 
            :key="product.id" 
            class="product-card"
            @click="goToProduct(product.id)"
          >
            <div class="product-image">
              <img :src="getProductImage(product)" :alt="product.name" />
              <div v-if="product.stockQuantity < 5" class="stock-badge">Az Stok</div>
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-sku">{{ product.sku }}</p>
              <p class="product-category">{{ product.categoryName }}</p>
              <p class="product-description">{{ truncateDescription(product.description) }}</p>
              <div class="product-meta">
                <span class="product-weight">{{ product.weight }} gr</span>
                <span class="product-material">{{ product.material }}</span>
              </div>
              <div class="product-footer">
                <span class="product-stock" :class="{ 'low-stock': product.stockQuantity < 10 }">
                  Stok: {{ product.stockQuantity }}
                </span>
                <div class="product-price">{{ formatPrice(product.price) }} TL</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Swiper,
    SwiperSlide
  },
  setup() {
    return {
      modules: [Autoplay, Pagination]
    }
  },
  data() {
    return {
      products: [],
      featuredProducts: [],
      loading: true,
      error: null,
      defaultImage: 'https://via.placeholder.com/400?text=Resim+Yok'
    }
  },
  mounted() {
    this.fetchProducts()
  },
  methods: {
    async fetchProducts() {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.get('https://localhost:7135/api/Products', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        this.products = response.data.map(product => ({
          ...product,
          imageUrl: product.imageUrls?.[0] || this.defaultImage
        }))

        this.featuredProducts = this.products.slice(0, 5)
        
      } catch (error) {
        console.error('Ürün çekme hatası:', error)
        this.error = this.getErrorMessage(error)
      } finally {
        this.loading = false
      }
    },

    getErrorMessage(error) {
      if (!error.response) return 'Sunucuyla bağlantı kurulamadı'
      
      switch(error.response.status) {
        case 401: return 'Lütfen giriş yapın'
        case 403: return 'Bu işlem için yetkiniz yok'
        case 404: return 'Ürünler bulunamadı'
        case 500: return 'Sunucu hatası'
        default: return 'Ürünler yüklenirken hata oluştu'
      }
    },

    getProductImage(product) {
      return product.imageUrl || this.defaultImage
    },

    truncateDescription(desc) {
      if (!desc) return 'Açıklama yok'
      return desc.length > 50 ? `${desc.substring(0, 50)}...` : desc
    },

    goToProduct(productId) {
      this.$router.push(`/product/${productId}`)
    },

    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price)
    }
  }
}
</script>

<style scoped>
.hero {
  background: #f7f5f2;
  color: white;
  padding: 6rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(244, 208, 63, 0.1));
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-content p {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  color: #666;
}

.btn.hero-btn {
  display: inline-block;
  font-size: 1.1rem;
  padding: 16px 32px;
  background: #d4af37;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.btn.hero-btn:hover {
  background: #f4d03f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.btn.hero-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: -1;
}

.btn.hero-btn:hover::after {
  transform: translateX(0);
}

.featured-slider {
  padding: 4rem 0;
  background: #f5f5f5;
}

.featured-slider h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #1a1a1a;
  position: relative;
}

.featured-slider h2::after {
  content: '';
  display: block;
  width: 80px;
  height: 3px;
  background: #d4af37;
  margin: 0.5rem auto 0;
}

.swiper-container {
  padding: 0 20px 40px;
}

.slide-content {
  position: relative;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.slide-content:hover {
  transform: scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.slide-content img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.slide-content:hover img {
  transform: scale(1.05);
}

.slide-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: 2rem 1.5rem 1.5rem;
  color: white;
  transition: all 0.3s ease;
}

.slide-content:hover .slide-overlay {
  padding-bottom: 2rem;
}

.slide-overlay h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  transition: transform 0.3s ease;
}

.slide-content:hover .slide-overlay h3 {
  transform: translateY(-5px);
}

.slide-overlay p {
  font-size: 1.3rem;
  font-weight: 700;
  color: #d4af37;
  margin-bottom: 0.3rem;
}

.slide-category {
  font-size: 0.9rem;
  opacity: 0.8;
}

:deep(.swiper-pagination-bullet) {
  background: #d4af37;
  opacity: 0.5;
  width: 12px;
  height: 12px;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  transform: scale(1.2);
}

.campaigns {
  padding: 4rem 0;
  background: white;
}

.campaigns h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #1a1a1a;
  position: relative;
}

.campaigns h2::after {
  content: '';
  display: block;
  width: 80px;
  height: 3px;
  background: #d4af37;
  margin: 0.5rem auto 0;
}

.campaign-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.campaign-card {
  background: white;
  color: #1a1a1a;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(212, 175, 55, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(212, 175, 55, 0.1);
}

.campaign-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(212, 175, 55, 0.15);
}

.campaign-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #d4af37, #f4d03f);
}

.campaign-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: #d4af37;
}

.campaign-card p {
  color: #666;
  margin-bottom: 0;
}

.products {
  padding: 4rem 0;
  background: #f8f9fa;
}

.products h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #1a1a1a;
  position: relative;
}

.products h2::after {
  content: '';
  display: block;
  width: 80px;
  height: 3px;
  background: #d4af37;
  margin: 0.5rem auto 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.product-image {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.stock-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #dc3545;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}

.product-info {
  padding: 1.5rem;
}

.product-info h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.product-sku {
  color: #6c757d;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.product-category {
  color: #d4af37;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.product-description {
  color: #666;
  font-size: 0.9rem;
  margin: 0.5rem 0;
  min-height: 20px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
  font-size: 0.8rem;
}

.product-weight {
  color: #6c757d;
}

.product-material {
  color: #6c757d;
  font-style: italic;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid #eee;
}

.product-stock {
  color: #28a745;
  font-size: 0.9rem;
}

.product-stock.low-stock {
  color: #dc3545;
  font-weight: bold;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #d4af37;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(212, 175, 55, 0.2);
  border-radius: 50%;
  border-top-color: #d4af37;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 2rem;
  color: #dc3545;
  background: rgba(220, 53, 69, 0.05);
  border-radius: 8px;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #d4af37;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #f4d03f;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-content p {
    font-size: 1.1rem;
  }
  
  .featured-slider h2,
  .campaigns h2,
  .products h2 {
    font-size: 2rem;
  }
  
  .campaign-grid {
    grid-template-columns: 1fr;
  }
  
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .slide-content {
    height: 300px;
  }
  
  .slide-overlay h3 {
    font-size: 1.3rem;
  }
  
  .slide-overlay p {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .slide-content {
    height: 250px;
  }
  
  .slide-overlay {
    padding: 1.5rem 1rem 1rem;
  }
  
  .slide-overlay h3 {
    font-size: 1.1rem;
  }
  
  .product-info {
    padding: 1rem;
  }
  
  .product-info h3 {
    font-size: 1.1rem;
  }
}
</style>