<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <router-link to="/" class="logo">
          <h1>✨ Altın Kuyumcu</h1>
        </router-link>

        <button class="hamburger" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <span :class="{ open: isMobileMenuOpen }"></span>
        </button>

        <nav :class="['nav', { open: isMobileMenuOpen }]">
          <a href="#" class="nav-link" @click.prevent="navigate('/')">
            <i class="fas fa-home"></i> Ana Sayfa
          </a>

          <div class="dropdown" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
            <button class="nav-link dropdown-toggle">
              <i class="fas fa-list"></i> Kategoriler <i class="fas fa-chevron-down"></i>
            </button>
            <transition name="fade">
              <div v-if="showDropdown" class="dropdown-menu">
                <a
                  v-for="category in categories"
                  :key="category.id"
                  href="#"
                  class="dropdown-item"
                  @click.prevent="navigate(`/category/${category.slug}`)"
                >
                  <i :class="getCategoryIcon(category.slug)"></i> {{ category.name }}
                </a>
              </div>
            </transition>
          </div>

          <a href="#" class="nav-link cart-link" @click.prevent="navigate('/cart')">
            <i class="fas fa-shopping-cart"></i> Sepet
            <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
          </a>

          <a href="#" class="nav-link" @click.prevent="navigate('/login')" v-if="!isAuthenticated">
            <i class="fas fa-sign-in-alt"></i> Giriş Yap
          </a>

          <div class="dropdown" @mouseenter="showUserDropdown = true" @mouseleave="showUserDropdown = false" v-if="isAuthenticated">
            <button class="nav-link dropdown-toggle">
              <i class="fas fa-user-circle"></i> Hesabım <i class="fas fa-chevron-down"></i>
            </button>
            <transition name="fade">
              <div v-if="showUserDropdown" class="dropdown-menu">
                <a href="#" class="dropdown-item" @click.prevent="navigate('/account')">
                  <i class="fas fa-user"></i> Profil
                </a>
                <a href="#" class="dropdown-item" @click.prevent="navigate('/orders')">
                  <i class="fas fa-box-open"></i> Siparişlerim
                </a>
                <a href="#" class="dropdown-item" @click.prevent="handleLogout">
                  <i class="fas fa-sign-out-alt"></i> Çıkış Yap
                </a>
              </div>
            </transition>
          </div>

          <a href="#" class="nav-link" @click.prevent="navigate('/about')">
            <i class="fas fa-info-circle"></i> Hakkımızda
          </a>
          <a href="#" class="nav-link" @click.prevent="navigate('/contact')">
            <i class="fas fa-envelope"></i> İletişim
          </a>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Header',
  data() {
    return {
      showDropdown: false,
      showUserDropdown: false,
      isMobileMenuOpen: false,
      cartItems: [], // Bu veri hala localStorage'dan çekiyor, API'ye geçiş yapılacak
      categories: []
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    cartItemCount() {
      // Bu kısım sepet API'sine geçiş yaptığınızda Vuex'ten çekilmeli
      return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    }
  },
  methods: {
    ...mapActions(['logout']), // Vuex logout action'ı
    
    // Tüm yönlendirmeler için merkezi metot
    navigate(path) {
      this.$router.push(path);
      this.closeMenu(); // Menüyü kapat
    },

    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:5294/api/Categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
        // Geçici test kategorileri
        this.categories = [
          { id: 1, name: 'Altın Takılar', slug: 'altin-takilar' },
          { id: 2, name: 'Gümüş Takılar', slug: 'gumus-takilar' },
          { id: 3, name: 'Pırlanta Ürünler', slug: 'pirlanta-urunler' },
          { id: 4, name: 'Bileklikler', slug: 'bileklikler' },
          { id: 5, name: 'Kolyeler', slug: 'kolyeler' },
          { id: 6, name: 'Yüzükler', slug: 'yuzukler' },
          { id: 7, name: 'Küpeler', slug: 'kupeeler' }
        ];
      }
    },
    // Bu metodun API'den sepet verilerini çekecek şekilde güncellenmesi gerekiyor
    updateCartItems() {
      const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      this.cartItems = cart;
    },
    closeMenu() {
      this.isMobileMenuOpen = false;
      this.showDropdown = false;
      this.showUserDropdown = false;
    },
    async handleLogout() {
      try {
        await this.logout(); // Vuex store'dan logout action'ını çağır
        this.closeMenu();
        this.$router.push('/'); // Ana sayfaya yönlendir
        // Başarı mesajı (isteğe bağlı)
        // this.$toast?.success('Başarıyla çıkış yapıldı');
      } catch (error) {
        console.error('Çıkış yapılırken hata:', error);
        // this.$toast?.error('Çıkış yapılırken bir hata oluştu');
      }
    },
    getCategoryIcon(slug) {
      const icons = {
        'altin-takilar': 'fa-gem',
        'gumus-takilar': 'fa-ring',
        'pirlanta-urunler': 'fa-diamond',
        'bileklikler': 'fa-bracelet',
        'kolyeler': 'fa-necklace',
        'yuzukler': 'fa-ring',
        'kupeeler': 'fa-earrings'
      };
      return 'fas ' + (icons[slug] || 'fa-tag');
    }
  },
  mounted() {
    this.fetchCategories();
    // Bu kısımlar sepet API'sine geçiş yaptığınızda Vuex'ten çekilmeli
    this.updateCartItems();
    window.addEventListener('cartUpdated', this.updateCartItems);
  },
  beforeUnmount() {
    // Bu kısımlar sepet API'sine geçiş yaptığınızda Vuex'ten çekilmeli
    window.removeEventListener('cartUpdated', this.updateCartItems);
  }
};
</script>

<style scoped>
.header {
  background: white;
  color: #d4af37;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  color: #d4af37;
}

.logo h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* router-link yerine a etiketlerini kullandığımız için stilleri ona göre güncelliyoruz */
.nav-link {
  color: #d4af37;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer; /* A etiketlerine tıklanabilirlik imleci ekledik */
}

.nav-link:hover {
  color: black;
}

.nav-link:hover::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #d4af37;
  animation: underline 0.3s ease forwards;
}

@keyframes underline {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.cart-link {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -10px;
  background: #d4af37;
  color: black;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.75rem;
  font-weight: bold;
}

/* Dropdown */
.dropdown {
  position: relative;
}

.dropdown-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font: inherit;
  color: inherit;
  -webkit-tap-highlight-color: transparent;
}

.dropdown-toggle:focus {
  outline: none;
  box-shadow: none;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  z-index: 999;
  min-width: 200px;
  transform-origin: top center;
  animation: fadeIn 0.2s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1.5rem;
  color: #333;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
}

.dropdown-item:focus {
  outline: none;
  background: rgba(212, 175, 55, 0.1);
}

.dropdown-item:hover {
  color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
  padding-left: 1.75rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  z-index: 1001;
  -webkit-tap-highlight-color: transparent;
}

.hamburger:focus {
  outline: none;
}

.hamburger span,
.hamburger span::before,
.hamburger span::after {
  content: '';
  display: block;
  background: #d4af37;
  height: 3px;
  border-radius: 2px;
  transition: 0.3s ease;
  position: relative;
}

.hamburger span.open {
  background: transparent;
}

.hamburger span.open::before {
  transform: rotate(45deg);
  top: 0;
}

.hamburger span.open::after {
  transform: rotate(-45deg);
  top: 0;
}

.hamburger span::before,
.hamburger span::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 3px;
  background: #d4af37;
}

.hamburger span::before {
  top: -8px;
}

.hamburger span::after {
  top: 8px;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    width: 100%;
    height: 100vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    display: none;
    z-index: 1000;
  }

  .nav.open {
    display: flex;
  }

  .nav-link {
    font-size: 1.2rem;
    margin: 0.5rem 0;
    color: #333;
  }

  .dropdown-menu {
    position: static;
    box-shadow: none;
    background: transparent;
    padding: 0;
    animation: none;
  }

  .dropdown-item {
    color: #555;
    padding: 0.75rem 1rem;
  }

  .dropdown-item:hover {
    color: #d4af37;
    background: transparent;
    padding-left: 1rem;
  }
}

/* Tüm focus outline'ları kaldırma */
button:focus, a:focus {
  outline: none;
}

/* Firefox için */
button::-moz-focus-inner {
  border: 0;
}

.nav-link i {
  margin-right: 8px;
  width: 20px;
  text-align: center;
}

.dropdown-item i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

/* Font Awesome ikonları için */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

/* Özel ikonlar için (eğer kullanılıyorsa) */
@font-face {
  font-family: 'Custom Icons';
  src: url('path/to/custom-icons.woff2') format('woff2');
}

.fa-bracelet:before {
  content: "\f0c1";
}

.fa-necklace:before {
  content: "\f302";
}

.fa-earrings:before {
  content: "\f0c4";
}

/* Responsive düzenlemeler */
@media screen and (max-width: 768px) {
  .nav-link i {
    margin-right: 12px;
    font-size: 1.2rem;
  }
  
  .dropdown-item i {
    margin-right: 15px;
  }
}
</style>