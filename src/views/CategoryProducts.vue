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
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
        @click="$router.push(`/product/${product.id}`)"
      >
        <div class="product-image">
          <img :src="product.image" :alt="product.name" />
        </div>
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="product-price">{{ product.price }} TL</p>
        </div>
      </div>
    </div>

    <div v-if="filteredProducts.length === 0 && !loading" class="no-products">
      <p>Bu kategoride henüz ürün bulunmamaktadır.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CategoryProducts",
  props: ["slug"],
  data() {
    return {
      loading: true,
      error: null,
      allProducts: [],
      categoryName: "",
      categories: [
        { id: 1, name: "Altın Takılar", slug: "altin-takilar" },
        { id: 2, name: "Gümüş Takılar", slug: "gumus-takilar" },
        { id: 3, name: "Pırlanta Ürünler", slug: "pirlanta-urunler" },
        { id: 4, name: "Bileklikler", slug: "bileklikler" },
        { id: 5, name: "Kolyeler", slug: "kolyeler" },
        { id: 6, name: "Yüzükler", slug: "yuzukler" },
        { id: 7, name: "Küpeler", slug: "kupeeler" },
      ],
    };
  },
  computed: {
    filteredProducts() {
      return this.allProducts.filter(
        (product) => product.category && product.category.slug === this.slug
      );
    },
  },
  async created() {
    try {
      await this.fetchMockProducts();

      const category = this.categories.find((c) => c.slug === this.slug);
      this.categoryName = category ? category.name : "Kategori";

      if (this.filteredProducts.length === 0) {
        const categoryExists = this.categories.some(
          (c) => c.slug === this.slug
        );
        if (!categoryExists) {
          this.error = "Geçersiz kategori";
        }
      }
    } catch (err) {
      this.error = "Ürünler yüklenirken bir hata oluştu";
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async fetchMockProducts() {
      await new Promise((resolve) => setTimeout(resolve, 800));

      this.allProducts = [
        {
          id: 1,
          name: "Klasik Altın Yüzük",
          price: 2500,
          image:
            "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg",
          category: { slug: "altin-takilar", name: "Altın Takılar" },
        },
        {
          id: 2,
          name: "Gümüş Bileklik",
          price: 850,
          image:
            "https://images.pexels.com/photos/3266703/pexels-photo-3266703.jpeg",
          category: { slug: "gumus-takilar", name: "Gümüş Takılar" },
        },
        {
          id: 3,
          name: "Pırlanta Kolye",
          price: 4500,
          image:
            "https://images.pexels.com/photos/3266700/pexels-photo-3266700.jpeg",
          category: { slug: "pirlanta-urunler", name: "Pırlanta Ürünler" },
        },
        {
          id: 4,
          name: "Deri Bileklik",
          price: 350,
          image:
            "https://images.pexels.com/photos/3266701/pexels-photo-3266701.jpeg",
          category: { slug: "bileklikler", name: "Bileklikler" },
        },
        {
          id: 5,
          name: "Altın Kolye",
          price: 3200,
          image:
            "https://images.pexels.com/photos/3266702/pexels-photo-3266702.jpeg",
          category: { slug: "kolyeler", name: "Kolyeler" },
        },
        {
          id: 6,
          name: "Elmas Yüzük",
          price: 7800,
          image:
            "https://images.pexels.com/photos/1191532/pexels-photo-1191532.jpeg",
          category: { slug: "yuzukler", name: "Yüzükler" },
        },
        {
          id: 7,
          name: "Altın Küpe",
          price: 1850,
          image:
            "https://images.pexels.com/photos/3266704/pexels-photo-3266704.jpeg",
          category: { slug: "kupeeler", name: "Küpeler" },
        },
      ];
    },
  },
};
</script>

<style scoped>
/* Ürün grid ve kart stilleri buraya gelecek */
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
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 15px;
}

.product-info h3 {
  margin: 0 0 10px;
  font-size: 1.1rem;
}

.product-price {
  font-weight: bold;
  color: #d4af37;
}

.loading,
.error,
.no-products {
  text-align: center;
  padding: 50px 0;
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
</style>
