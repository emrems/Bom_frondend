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
        <h2>emre almamıs</h2>
        <h2>emredadadads</h2>
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
              <img :src="product.image" :alt="product.name" />
              <div class="slide-overlay">
                <h3>{{ product.name }}</h3>
                <p>{{ formatPrice(product.price) }} TL</p>
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
          Ürünler yükleniyor...
        </div>
        
        <div v-else-if="error" class="error">
          {{ error }}
        </div>
        
        <div v-else class="product-grid">
          <div 
            v-for="product in products" 
            :key="product.id" 
            class="product-card"
            @click="goToProduct(product.id)"
          >
            <div class="product-image">
              <img :src="product.image" :alt="product.name" />
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-category">{{ product.category }}</p>
              <div class="product-price">{{ formatPrice(product.price) }} TL</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// Swiper için gerekli importlar
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

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
      featuredProducts: [
        {
          id: 1,
          name: "Premium Altın Kolye",
          category: "Kolye",
          price: 12500,
          image: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg"
        },
        {
          id: 2,
          name: "Elmas Yüzük",
          category: "Yüzük",
          price: 18900,
          image: "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg"
        },
        {
          id: 3,
          name: "Lüks Bileklik Set",
          category: "Set",
          price: 24500,
          image: "https://images.pexels.com/photos/3266700/pexels-photo-3266700.jpeg"
        },
        {
          id: 4,
          name: "Vintage Küpeler",
          category: "Küpe",
          price: 8500,
          image: "https://images.pexels.com/photos/3266703/pexels-photo-3266703.jpeg"
        },
        {
          id: 5,
          name: "Altın Bilezik",
          category: "Bilezik",
          price: 9800,
          image: "https://images.pexels.com/photos/3266701/pexels-photo-3266701.jpeg"
        }
      ],
      loading: true,
      error: null
    }
  },
  mounted() {
    this.fetchProducts()
  },
  methods: {
    async fetchProducts() {
      try {
        this.loading = true
        // Mock API çağrısı - gerçek API ile değiştirilecek
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data - gerçek API response'u ile değiştirilecek
        this.products = [
          {
            id: 1,
            name: "Altın Yüzük Klasik",
            category: "Yüzük",
            price: 2500,
            image: "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400"
          },
          {
            id: 2,
            name: "Pırlanta Kolye",
            category: "Kolye",
            price: 8500,
            image: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=400"
          },
          {
            id: 3,
            name: "Altın Bilezik",
            category: "Bilezik",
            price: 3200,
            image: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=400"
          },
          {
            id: 4,
            name: "Pırlanta Küpe",
            category: "Küpe",
            price: 4750,
            image: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=400"
          },
          {
            id: 5,
            name: "Altın Set",
            category: "Set",
            price: 12000,
            image: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=400"
          },
          {
            id: 6,
            name: "Vintage Yüzük",
            category: "Yüzük",
            price: 6800,
            image: "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400"
          }
        ]
        
      } catch (error) {
        this.error = 'Ürünler yüklenirken bir hata oluştu.'
        console.error('Products fetch error:', error)
      } finally {
        this.loading = false
      }
    },
    
    goToProduct(productId) {
      this.$router.push(`/product/${productId}`)
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR').format(price)
    }
  }
}
</script>

<style scoped>
.hero {
  background:#f7f5f2;
  color: white;
  padding: 6rem 0;
  text-align: center;
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
}

.btn.hero-btn:hover {
  background: #f4d03f;
  transform: translateY(-2px);
}

/* Featured Slider Styles */
.featured-slider {
  padding: 4rem 0;
  background: #f5f5f5;
}

.featured-slider h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #1a1a1a;
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
  transition: transform 0.3s ease;
}

.slide-content:hover {
  transform: scale(1.02);
}

.slide-content img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: 2rem 1.5rem 1.5rem;
  color: white;
}

.slide-overlay h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.slide-overlay p {
  font-size: 1.3rem;
  font-weight: 700;
  color: #d4af37;
}

/* Swiper pagination styling */
:deep(.swiper-pagination-bullet) {
  background: #d4af37;
  opacity: 0.5;
  width: 12px;
  height: 12px;
}

:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
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
  transition: transform 0.3s ease;
}

.campaign-card:hover {
  transform: translateY(-5px);
}

.campaign-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: #d4af37;
}

.campaign-card p {
  color: #666;
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
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
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

.product-category {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #d4af37;
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
}
</style>