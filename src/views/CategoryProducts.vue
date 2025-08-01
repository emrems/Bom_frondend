<template>
  <div class="category-products">
    <h2>{{ categoryName }} Ürünleri</h2>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Ürünler yükleniyor...</p>
    </div>

    <div v-else-if="error" class="error">
      <i class="fas fa-exclamation-circle"></i>
      <p>{{ error }}</p>
    </div>

    <div v-else class="product-grid">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
        @click="$router.push(`/product/${product.id}`)"
      >
        <div class="product-image">
          <img :src="product.imageUrl || 'https://via.placeholder.com/300'" :alt="product.name" />
        </div>
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="product-price">{{ formatPrice(product.price) }} TL</p>
        </div>
      </div>
    </div>

    <div v-if="products.length === 0 && !loading" class="no-products">
      <i class="fas fa-box-open"></i>
      <p>Bu kategoride henüz ürün bulunmamaktadır.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "CategoryProducts",
  props: ["slug"], // 'id' prop'unu doğru şekilde aldığınızdan emin olun
  data() {
    return {
      loading: true,
      error: null,
      products: [],
      categoryName: "", // Kategori adı, getirilen veriye göre ayarlanacak
      category: null
    };
  },
  async created() {
    // Bileşen ilk oluşturulduğunda verileri getir
    // await this.fetchCategoryData(); // Kategori detaylarını getir
    await this.fetchProducts();     // O kategoriye ait ürünleri getir
  },
  methods: {
    // async fetchCategoryData() {
    //   try {
    //     // ID prop'unu kullanarak kategori detaylarını getir
    //     const response = await axios.get(`http://localhost:5294/api/Categories/${this.id}`);
    //     this.category = response.data;
    //     this.categoryName = this.category.name;
    //     this.error = null; // Önceki hataları temizle
    //   } catch (error) {
    //     console.error('Kategori bilgisi alınırken hata:', error);
    //     this.error = "Kategori bulunamadı veya bir hata oluştu.";
    //     this.categoryName = "Bilinmeyen Kategori"; // Varsayılan bir ad belirle
    //   }
    // },
    async fetchProducts() {
      this.loading = true; // Ürünleri getirmeden önce yükleniyor durumunu aç
      this.error = null;   // Ürünlerle ilgili önceki hataları temizle

      try {
        const response = await axios.get(`http://localhost:5294/api/Products/category/slug/${this.slug}`);
        this.products = response.data;
        console.log("kategoriye göre alınan ürünler", response.data);
      } catch (error) {
        console.error('Ürünler alınırken hata:', error);
        this.error = "Ürünler yüklenirken bir hata oluştu.";
      } finally {
        this.loading = false; // Veri alma işlemi bittikten sonra (başarılı veya hatalı) yükleniyor durumunu kapat
      }
    },
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR').format(price);
    }
  },
  watch: {
    // 'id' prop'undaki değişiklikleri izle
    async slug(newId, oldId) {
      if (newId !== oldId) { // Sadece ID gerçekten değiştiyse yeniden getir
        this.loading = true;
        this.error = null;
        this.products = []; // Eski ürünleri hemen temizleyerek daha iyi bir kullanıcı deneyimi sağla
        this.categoryName = ""; // Eski kategori adını temizle
        // await this.fetchCategoryData(); // Yeni kategori verilerini getir
        await this.fetchProducts();     // Yeni ürünleri getir
      }
    }
  }
};
</script>

<style scoped>
.category-products {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 2rem;
  font-family: 'Playfair Display', serif;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.product-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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
  padding: 15px;
}

.product-info h3 {
  margin: 0 0 10px;
  font-size: 1.1rem;
  color: #333;
}

.product-price {
  font-weight: bold;
  color: #d4af37;
  font-size: 1.2rem;
}

.loading,
.error,
.no-products {
  text-align: center;
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading p,
.error p,
.no-products p {
  margin-top: 15px;
  color: #666;
}

.error i {
  color: #e74c3c;
  font-size: 2rem;
}

.no-products i {
  color: #d4af37;
  font-size: 2rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #d4af37;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  h2 {
    font-size: 1.5rem;
  }
}
</style>