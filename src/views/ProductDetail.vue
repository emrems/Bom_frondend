<template>
  <div class="product-detail">
    <div class="container">
      <div v-if="loading" class="loading">
        Ürün detayları yükleniyor...
      </div>
      
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      
      <div v-else-if="product" class="product-content">
        <div class="product-images">
          <img :src="product.image" :alt="product.name" class="main-image" />
        </div>
        
        <div class="product-info">
          <nav class="breadcrumb">
            <router-link to="/">Ana Sayfa</router-link>
            <span>/</span>
            <span>{{ product.category }}</span>
            <span>/</span>
            <span>{{ product.name }}</span>
          </nav>
          
          <h1>{{ product.name }}</h1>
          <p class="category">{{ product.category }}</p>
          
          <div class="price">{{ formatPrice(product.price) }} TL</div>
          
          <div class="description">
            <p>{{ product.description }}</p>
          </div>
          
          <div class="product-specs">
            <h3>Ürün Özellikleri</h3>
            <ul>
              <li><strong>Malzeme:</strong> {{ product.material }}</li>
              <li><strong>Ağırlık:</strong> {{ product.weight }}</li>
              <li><strong>Garanti:</strong> {{ product.warranty }}</li>
            </ul>
          </div>
          
          <div class="add-to-cart-section">
            <div class="quantity-selector">
              <label>Adet:</label>
              <div class="quantity-controls">
                <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
                <span class="quantity">{{ quantity }}</span>
                <button @click="increaseQuantity">+</button>
              </div>
            </div>
            
            <button @click="addToCart" class="btn add-to-cart-btn">
              Sepete Ekle
            </button>
          </div>
          
          <div v-if="addedToCart" class="success-message">
            ✅ Ürün sepete eklendi!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDetail',
  props: ['id'],
  data() {
    return {
      product: null,
      loading: true,
      error: null,
      quantity: 1,
      addedToCart: false
    }
  },
  mounted() {
    this.fetchProduct()
  },
  watch: {
    id() {
      this.fetchProduct()
    }
  },
  methods: {
    async fetchProduct() {
      try {
        this.loading = true
        this.error = null
        
        // Mock API çağrısı - gerçek API ile değiştirilecek
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data - gerçek API response'u ile değiştirilecek
        const mockProducts = {
          1: {
            id: 1,
            name: "Altın Yüzük Klasik",
            category: "Yüzük",
            price: 2500,
            image: "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800",
            description: "El işçiliği ile özenle hazırlanmış klasik altın yüzük. 14 ayar altından üretilmiştir.",
            material: "14 Ayar Altın",
            weight: "3.2 gram",
            warranty: "2 Yıl Garanti"
          },
          2: {
            id: 2,
            name: "Pırlanta Kolye",
            category: "Kolye",
            price: 8500,
            image: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=800",
            description: "Zarif pırlanta kolye, özel günleriniz için mükemmel bir seçim.",
            material: "18 Ayar Beyaz Altın",
            weight: "2.8 gram",
            warranty: "5 Yıl Garanti"
          },
          3: {
            id: 3,
            name: "Altın Bilezik",
            category: "Bilezik",
            price: 3200,
            image: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=800",
            description: "Şık tasarımıyla göz kamaştıran altın bilezik.",
            material: "22 Ayar Altın",
            weight: "5.1 gram",
            warranty: "3 Yıl Garanti"
          },
          4: {
            id: 4,
            name: "Pırlanta Küpe",
            category: "Küpe",
            price: 4750,
            image: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=800",
            description: "Işıltılı pırlanta küpeler, zarafetinizi tamamlar.",
            material: "18 Ayar Beyaz Altın",
            weight: "1.9 gram",
            warranty: "5 Yıl Garanti"
          },
          5: {
            id: 5,
            name: "Altın Set",
            category: "Set",
            price: 12000,
            image: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=800",
            description: "Kolye, küpe ve yüzükten oluşan muhteşem altın set.",
            material: "18 Ayar Sarı Altın",
            weight: "12.5 gram",
            warranty: "5 Yıl Garanti"
          },
          6: {
            id: 6,
            name: "Vintage Yüzük",
            category: "Yüzük",
            price: 6800,
            image: "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800",
            description: "Antika görünümlü vintage tasarım yüzük.",
            material: "14 Ayar Rose Altın",
            weight: "4.3 gram",
            warranty: "2 Yıl Garanti"
          }
        }
        
        this.product = mockProducts[this.id]
        
        if (!this.product) {
          this.error = 'Ürün bulunamadı.'
        }
        
        // Gerçek API çağrısı böyle olacak:
        // const response = await fetch(`/api/products/${this.id}`)
        // this.product = await response.json()
        
      } catch (error) {
        this.error = 'Ürün detayları yüklenirken bir hata oluştu.'
        console.error('Product fetch error:', error)
      } finally {
        this.loading = false
      }
    },
    
    increaseQuantity() {
      this.quantity++
    },
    
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },
    
    addToCart() {
      // localStorage'dan mevcut sepeti al
      const cart = JSON.parse(localStorage.getItem('cartItems') || '[]')
      
      // Ürün zaten sepette var mı kontrol et
      const existingItem = cart.find(item => item.id === this.product.id)
      
      if (existingItem) {
        // Varsa miktarını artır
        existingItem.quantity += this.quantity
      } else {
        // Yoksa yeni ürün olarak ekle
        cart.push({
          id: this.product.id,
          name: this.product.name,
          price: this.product.price,
          image: this.product.image,
          quantity: this.quantity
        })
      }
      
      // Sepeti localStorage'a kaydet
      localStorage.setItem('cartItems', JSON.stringify(cart))
      
      // Başarı mesajını göster
      this.addedToCart = true
      setTimeout(() => {
        this.addedToCart = false
      }, 3000)
      
      // Header'daki sepet sayısını güncelle
      window.dispatchEvent(new Event('cartUpdated'))
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR').format(price)
    }
  }
}
</script>

<style scoped>
.product-detail {
  padding: 2rem 0;
  min-height: 80vh;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-top: 2rem;
}

.product-images {
  display: flex;
  justify-content: center;
}

.main-image {
  width: 100%;
  max-width: 500px;
  height: 500px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.breadcrumb {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.breadcrumb a {
  color: #d4af37;
  text-decoration: none;
}

.breadcrumb span {
  margin: 0 0.5rem;
}

.product-info h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.category {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: #d4af37;
  margin-bottom: 2rem;
}

.description {
  margin-bottom: 2rem;
}

.description p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
}

.product-specs {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.product-specs h3 {
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.product-specs ul {
  list-style: none;
}

.product-specs li {
  margin-bottom: 0.5rem;
  color: #555;
}

.add-to-cart-section {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 2px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.quantity-controls button {
  width: 40px;
  height: 40px;
  border: none;
  background: #f8f9fa;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
  transition: background 0.2s;
}

.quantity-controls button:hover:not(:disabled) {
  background: #e9ecef;
}

.quantity-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  width: 60px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0 1rem;
}

.add-to-cart-btn {
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: 600;
}

.success-message {
  color: #27ae60;
  font-weight: 600;
  padding: 1rem;
  background: #d4edda;
  border-radius: 8px;
  border-left: 4px solid #27ae60;
}

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .main-image {
    height: 300px;
  }
  
  .product-info h1 {
    font-size: 2rem;
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
}
</style>