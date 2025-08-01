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
              <li v-if="product.weight !== undefined && product.weight !== null"><strong>Ağırlık:</strong> {{ product.weight }} gram</li>
              <li v-if="product.sku"><strong>SKU:</strong> {{ product.sku }}</li>
              <li v-if="product.stockQuantity !== undefined && product.stockQuantity !== null"><strong>Stok Durumu:</strong> {{ product.stockQuantity > 0 ? 'Stokta Var' : 'Tükendi' }}</li>
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

          <transition name="fade">
            <div v-if="addedToCart" class="success-message">
              ✅ Ürün sepete eklendi!
            </div>
          </transition>
        </div>
      </div>
      <div v-else class="no-product-found">
        <i class="fas fa-box-open"></i>
        <p>Ürün bulunamadı.</p>
        <router-link to="/" class="btn back-home-btn">Ana Sayfaya Dön</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProductDetail',
  props: ['id'],
  data() {
    return {
      product: null,
      loading: true,
      error: null,
      quantity: 1,
      addedToCart: false,
      mainImage: 'https://via.placeholder.com/500/F8F8F8/C0C0C0?text=Resim+Yok' // Varsayılan resim
    };
  },
  async created() {
    // Component oluşturulduğunda ve id değiştiğinde çalışır
    await this.fetchProduct();
  },
  watch: {
    // id prop'u değiştiğinde ürünü tekrar getir
    async id() {
      await this.fetchProduct();
    }
  },
  methods: {
    async fetchProduct() {
      try {
        this.loading = true;
        this.error = null;
        this.product = null; // Önceki ürünü temizle
        this.quantity = 1; // Miktarı sıfırla
        this.addedToCart = false; // Sepete eklendi mesajını sıfırla

        const response = await axios.get(`http://localhost:5294/api/Products/${this.id}`);
        this.product = response.data;

        // Ürün geldiğinde ilk resmi ana resim olarak ayarla
        if (this.product && this.product.imageUrls && this.product.imageUrls.length > 0) {
          this.mainImage = this.product.imageUrls[0];
        } else {
          this.mainImage = 'https://via.placeholder.com/500/F8F8F8/C0C0C0?text=Resim+Yok'; // Resim yoksa varsayılan
        }

        if (!this.product) {
          this.error = 'Ürün bulunamadı.';
        }

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
      } else if (this.product && this.product.stockQuantity === 0) {
        // Stok yoksa artırma işlemi yapma
      } else {
        // Eğer stok miktarı tanımlı değilse veya çok büyükse bir limit belirleyebilirsiniz
        // Şimdilik sadece stok miktarından fazla olmamasına dikkat edelim
        this.quantity++;
      }
    },

    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },

    addToCart() {
      if (this.product.stockQuantity === 0) {
        alert('Bu ürün stokta bulunmamaktadır.');
        return;
      }

      const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');

      const existingItem = cart.find(item => item.id === this.product.id);

      if (existingItem) {
        // Stok miktarını aşmamaya dikkat et
        if (existingItem.quantity + this.quantity > this.product.stockQuantity) {
          alert(`Bu üründen stokta sadece ${this.product.stockQuantity - existingItem.quantity} adet daha ekleyebilirsiniz.`);
          existingItem.quantity = this.product.stockQuantity; // Maksimum stoğa çek
        } else {
          existingItem.quantity += this.quantity;
        }
      } else {
        // Stok miktarını aşmamaya dikkat et
        if (this.quantity > this.product.stockQuantity) {
          alert(`Bu üründen stokta sadece ${this.product.stockQuantity} adet bulunmaktadır.`);
          this.quantity = this.product.stockQuantity; // Seçili miktarı stoğa çek
          cart.push({
            id: this.product.id,
            name: this.product.name,
            price: this.product.price,
            image: this.mainImage,
            quantity: this.quantity
          });
        } else {
          cart.push({
            id: this.product.id,
            name: this.product.name,
            price: this.product.price,
            image: this.mainImage,
            quantity: this.quantity
          });
        }
      }

      localStorage.setItem('cartItems', JSON.stringify(cart));

      this.addedToCart = true;
      setTimeout(() => {
        this.addedToCart = false;
      }, 3000);

      window.dispatchEvent(new Event('cartUpdated'));
    },

    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 0, // Kuruşları gösterme
        maximumFractionDigits: 0, // Kuruşları gösterme
      }).format(price);
    }
  }
};
</script>

<style scoped>
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
  grid-template-columns: 1fr 1.5fr; /* Resim alanı dar, bilgi alanı geniş */
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
  object-fit: contain; /* Resmi içeriğe sığdırır */
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}

.thumbnail-gallery {
  display: flex;
  gap: 10px;
  flex-wrap: wrap; /* Küçük resimler sığmazsa alt satıra geçsin */
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