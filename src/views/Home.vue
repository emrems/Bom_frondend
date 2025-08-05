<template>
  <div class="home">
    <div class="section-container">
      <HeroSection />
    </div>

    <!-- GÜNCELLENDİ: Bu slider artık 'bestsellers' verisini kullanacak -->
    <div class="section-container">
      <FeaturedProductsSlider :products="bestsellers" :loading="loading" :error="error" />
    </div>

    <!-- DOKUNULMADI: Bu bölüm olduğu gibi kaldı -->
    <div class="section-container">
      <CampaignsSection />
    </div>

    <!-- DOKUNULMADI: Bu bölüm tüm ürünleri göstermeye devam ediyor -->
    <div class="section-container">
      <ProductListSection :products="products" :loading="loading" :error="error" @retry-fetch="fetchProducts" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import HeroSection from '@/components/home/HeroSection.vue';
import FeaturedProductsSlider from '@/components/home/FeaturedProductsSlider.vue';
import CampaignsSection from '@/components/home/CampaignsSection.vue';
import ProductListSection from '@/components/home/ProductListSection.vue';

export default {
  name: 'Home',
  components: {
    HeroSection,
    FeaturedProductsSlider,
    CampaignsSection,
    ProductListSection
  },
  data() {
    return {
      products: [],
      // YENİ: Vitrin (FeaturedProductsSlider) için çok satanlar dizisi eklendi
      bestsellers: [],
      loading: true,
      error: null,
      apiBaseUrl: 'https://localhost:7135', 
    };
  },
  mounted() {
    this.fetchProducts(); // Tüm ürünleri çek
    this.fetchBestsellers(); // Çok satanları çek
    this.initScrollAnimations();
  },
  methods: {
    // Bu metot 'ProductListSection' için tüm ürünleri çekmeye devam ediyor
    async fetchProducts() {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await axios.get(`${this.apiBaseUrl}/api/Products`);
        
        this.products = response.data.map(product => {
          const imageUrl = product.imageUrls && product.imageUrls.length > 0
            ? `${this.apiBaseUrl}${product.imageUrls[0]}` 
            : 'https://via.placeholder.com/400?text=Resim+Yok';
          
          return {
            ...product,
            imageUrl: imageUrl
          };
        });
        
      } catch (error) {
        console.error('Ürün çekme hatası:', error);
        this.error = this.getErrorMessage(error);
      } finally {
        this.loading = false;
      }
    },

    // YENİ: Bu metot 'FeaturedProductsSlider' için çok satanları çekiyor
    async fetchBestsellers() {
      try {
        // Not: Bu isteğin 'loading' durumunu etkilememesi için ayrı yönetiyoruz
        const response = await axios.get(`${this.apiBaseUrl}/api/Products/bestsellers`);
        
        this.bestsellers = response.data.map(product => {
          const imageUrl = product.imageUrls && product.imageUrls.length > 0
            ? `${this.apiBaseUrl}${product.imageUrls[0]}` 
            : 'https://via.placeholder.com/400?text=Resim+Yok';
          
          return {
            ...product,
            imageUrl: imageUrl
          };
        });

      } catch (error) {
        console.error('Çok satan ürünleri çekerken hata:', error);
        // Vitrin bölümünün boş kalmaması için hata durumunda ana ürünlerden birkaçını gösterebiliriz
        // veya hata mesajı gösterebiliriz. Şimdilik konsola yazdırıyoruz.
      }
    },

    getErrorMessage(error) {
      if (!error.response) return 'Sunucuyla bağlantı kurulamadı.';
      
      switch(error.response.status) {
        case 401: return 'Lütfen giriş yapın.';
        case 403: return 'Bu işlem için yetkiniz yok.';
        case 404: return 'Ürünler bulunamadı.';
        case 500: return 'Sunucu hatası.';
        default: return 'Ürünler yüklenirken bir hata oluştu.';
      }
    },

    initScrollAnimations() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
      });

      document.querySelectorAll('.section-container').forEach((section) => {
        observer.observe(section);
      });
    }
  }
};
</script>

<style scoped>
.home {
  background: #fdfaf6;
  overflow-x: hidden;
}

.section-container {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.8s cubic-bezier(0.165, 0.84, 0.44, 1), 
              transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.section-container.visible {
  opacity: 1;
  transform: translateY(0);
}

.section-container:nth-of-type(2) {
  transition-delay: 0.1s;
}
.section-container:nth-of-type(3) {
  transition-delay: 0.2s;
}
.section-container:nth-of-type(4) {
  transition-delay: 0.3s;
}
</style>