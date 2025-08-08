<template>
  <header class="main-header">
    <div class="container">
      <div class="header-inner">
        <router-link to="/" class="brand-logo">
          <h1>✨ BOM Altın Kuyumcu</h1>
        </router-link>

        <button class="hamburger-menu" @click="toggleMobileMenu">
          <span :class="{ 'is-active': isMobileMenuOpen }"></span>
          <span :class="{ 'is-active': isMobileMenuOpen }"></span>
          <span :class="{ 'is-active': isMobileMenuOpen }"></span>
        </button>

        <nav :class="['main-nav', { 'is-open': isMobileMenuOpen }]">
          <a href="#" class="nav-item" @click.prevent="navigate('/')">
            <i class="fas fa-home nav-icon"></i> Ana Sayfa
          </a>

          <div
            class="nav-dropdown"
            @mouseenter="showDropdown = true"
            @mouseleave="showDropdown = false"
          >
            <button class="nav-item dropdown-toggle">
              <i class="fas fa-list nav-icon"></i> Kategoriler
              <i class="fas fa-chevron-down dropdown-arrow"></i>
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
                  <i
                    :class="getCategoryIcon(category.slug)"
                    class="dropdown-icon"
                  ></i>
                  {{ category.name }}
                </a>
              </div>
            </transition>
          </div>

          <a
            href="#"
            class="nav-item cart-link"
            @click.prevent="navigate('/cart')"
          >
            <i class="fas fa-shopping-cart nav-icon"></i> Sepet
            <span v-if="cartItemCount > 0" class="cart-badge">{{
              cartItemCount
            }}</span>
          </a>

          <!-- YENİ EKLENEN SİPARİŞ SORGULAMA LİNKİ -->
          <a
            href="#"
            class="nav-item"
            @click.prevent="navigate('/siparis-sorgula')"
          >
            <i class="fas fa-search-dollar nav-icon"></i> Sipariş Sorgula
          </a>
          <!-- YENİ LİNK SONU -->

          <a
            href="#"
            class="nav-item"
            @click.prevent="navigate('/login')"
            v-if="!isAuthenticated"
          >
            <i class="fas fa-sign-in-alt nav-icon"></i> Giriş Yap
          </a>

          <div
            class="nav-dropdown"
            @mouseenter="showUserDropdown = true"
            @mouseleave="showUserDropdown = false"
            v-if="isAuthenticated"
          >
            <button class="nav-item dropdown-toggle">
              <i class="fas fa-user-circle nav-icon"></i> Hesabım
              <i class="fas fa-chevron-down dropdown-arrow"></i>
            </button>
            <transition name="fade">
              <div v-if="showUserDropdown" class="dropdown-menu">
                <a
                  href="#"
                  class="dropdown-item"
                  @click.prevent="navigate('/account')"
                >
                  <i class="fas fa-user dropdown-icon"></i> Profil
                </a>
                <a
                  href="#"
                  class="dropdown-item"
                  @click.prevent="navigate('/orders')"
                >
                  <i class="fas fa-box-open dropdown-icon"></i> Siparişlerim
                </a>
                <a
                  href="#"
                  class="dropdown-item logout-item"
                  @click.prevent="handleLogout"
                >
                  <i class="fas fa-sign-out-alt dropdown-icon"></i> Çıkış Yap
                </a>
              </div>
            </transition>
          </div>

          <a href="#" class="nav-item" @click.prevent="navigate('/about')">
            <i class="fas fa-info-circle nav-icon"></i> Hakkımızda
          </a>
          <a href="#" class="nav-item" @click.prevent="navigate('/contact')">
            <i class="fas fa-envelope nav-icon"></i> İletişim
          </a>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Header",
  data() {
    return {
      showDropdown: false,
      showUserDropdown: false,
      isMobileMenuOpen: false, // Mobil menü açık mı kapalı mı
      categories: [],
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "cartItemCount"]),
  },
  methods: {
    ...mapActions(["logout", "fetchCartDetails"]),

    navigate(path) {
      this.$router.push(path);
      this.closeMenus(); // Tüm menüleri kapat
    },

    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
      if (!this.isMobileMenuOpen) {
        this.closeMenus(); // Mobil menü kapatıldığında alt menüleri de kapat
      }
    },

    closeMenus() {
      this.isMobileMenuOpen = false;
      this.showDropdown = false;
      this.showUserDropdown = false;
    },

    async fetchCategories() {
      try {
        const response = await axios.get(
          "https://localhost:7135/api/Categories"
        );
        this.categories = response.data;
      } catch (error) {
        console.error("Kategoriler yüklenirken hata:", error);
        this.categories = [
          { id: 1, name: "Altın Takılar", slug: "altin-takilar" },
          { id: 2, name: "Gümüş Takılar", slug: "gumus-takilar" },
          { id: 3, name: "Pırlanta Ürünler", slug: "pirlanta-urunler" },
          { id: 4, name: "Bileklikler", slug: "bileklikler" },
          { id: 5, name: "Kolyeler", slug: "kolyeler" },
          { id: 6, name: "Yüzükler", slug: "yuzukler" },
          { id: 7, name: "Küpeler", slug: "kupeeler" },
        ];
      }
    },
    async handleLogout() {
      try {
        await this.logout();
        this.closeMenus();
        this.$router.push("/");
      } catch (error) {
        console.error("Çıkış yapılırken hata:", error);
      }
    },
    getCategoryIcon(slug) {
      const icons = {
        "altin-takilar": "fa-gem",
        "gumus-takilar": "fa-ring",
        "pirlanta-urunler": "fa-diamond",
        bileklikler: "fa-bracelet",
        kolyeler: "fa-necklace",
        yuzukler: "fa-ring",
        kupeeler: "fa-earrings",
      };
      return "fas " + (icons[slug] || "fa-tag");
    },
  },
  async mounted() {
    this.fetchCategories();
    try {
      await this.fetchCartDetails();
    } catch (error) {
      console.error("Headerda sepet detayları yüklenirken hata:", error);
    }
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

.main-header {
  background: #ffffff;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-logo {
  text-decoration: none;
  color: #d4af37;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.brand-logo h1 {
  font-size: 1.9rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.5px;
}

.main-nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;
  gap: 1.2rem;
}

.nav-item {
  color: #333;
  text-decoration: none;
  font-weight: 600;
  padding: 0.6rem 0;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  user-select: none;
  white-space: nowrap;
}

.nav-item:hover {
  color: #d4af37;
}

.nav-item::after {
  content: "";
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #d4af37;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.nav-item:hover::after {
  transform: scaleX(1);
}

.nav-icon {
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

.cart-link {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -10px;
  right: -12px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 3px 7px;
  font-size: 0.7rem;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  min-width: 22px;
  text-align: center;
  line-height: 1;
}

.nav-dropdown {
  position: relative;
}

.dropdown-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font: inherit;
  color: inherit;
  display: flex;
  align-items: center;
  user-select: none;
}

.dropdown-toggle:focus {
  outline: none;
  box-shadow: none;
}

.dropdown-arrow {
  margin-left: 0.5rem;
  font-size: 0.8rem;
  transition: transform 0.2s ease;
}

.nav-dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 0.8rem 0;
  z-index: 999;
  min-width: 220px;
  animation: dropdownFadeIn 0.3s ease-out forwards;
  opacity: 0;
  transform-origin: top;
  visibility: hidden;
}

.dropdown-menu[style*="left: auto"] {
  transform: translateX(0);
}

.nav-dropdown:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
}


@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scaleY(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scaleY(1);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  color: #555;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  user-select: none;
}

.dropdown-icon {
  margin-right: 0.8rem;
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.dropdown-item:hover {
  color: #d4af37;
  background: rgba(212, 175, 55, 0.08);
  padding-left: 1.8rem;
}

.dropdown-item.logout-item {
  border-top: 1px solid #eee;
  margin-top: 0.5rem;
  padding-top: 1rem;
}

.hamburger-menu {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 22px;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  z-index: 1001;
  padding: 0;
}

.hamburger-menu span {
  display: block;
  width: 100%;
  height: 3px;
  background: #d4af37;
  border-radius: 2px;
  transition: all 0.3s ease-in-out;
  transform-origin: center center;
}

.hamburger-menu span:nth-child(1) {
  transform-origin: top left;
}
.hamburger-menu span:nth-child(3) {
  transform-origin: bottom left;
}

.hamburger-menu span.is-active:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}
.hamburger-menu span.is-active:nth-child(2) {
  opacity: 0;
}
.hamburger-menu span.is-active:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}


/* --- TEK DEĞİŞİKLİK BURADA: BREAKPOINT DEĞERİ --- */
/* Menünün sıkışmaya başladığı daha geniş bir ekranda mobil görünüme geçiyoruz */
@media screen and (max-width: 1150px) {
  .hamburger-menu {
    display: flex;
  }
  .main-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(5px);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    transform: translateX(100%);
    transition: transform 0.4s ease-in-out;
    opacity: 0;
    pointer-events: none;
    gap: 0;
    display: none; /* Başlangıçta gizli, sadece is-open ile görünür olacak */
  }
  .main-nav.is-open {
    display: flex; /* Sadece is-open sınıfı varken görünür yap */
    transform: translateX(0%);
    opacity: 1;
    pointer-events: all;
  }

  .nav-item, .dropdown-toggle {
    font-size: 1.4rem;
    color: #333;
    width: 100%;
    text-align: center;
    justify-content: center;
    padding: 1.2rem 0;
  }

  .nav-item::after {
    display: none;
  }

  .nav-icon {
    font-size: 1.3rem;
  }

  .nav-dropdown {
    width: 100%;
    text-align: center;
  }

  .dropdown-toggle {
    width: 100%;
    justify-content: center;
  }
  
  /* Mobil'de hover ile açılmayı engelle */
  .nav-dropdown:hover .dropdown-menu {
    display: none;
    opacity: 0;
    visibility: hidden;
  }

  .dropdown-menu {
    position: static;
    box-shadow: none;
    background: #f8f8f8;
    padding: 0.5rem 0;
    animation: none;
    opacity: 1;
    visibility: visible;
    transform: none;
    width: 90%;
    margin: 0 auto 1rem auto;
    border-radius: 8px;
    display: none; /* Mobil'de dropdown'lar da tıklama ile açılacak */
  }
  
  /* Mobil'de JS ile açılan dropdown için */
  .nav-dropdown.is-open-mobile .dropdown-menu {
    display: block;
  }

  .dropdown-item {
    padding: 0.8rem 1rem;
    font-size: 1.1rem;
    justify-content: center;
  }
  .dropdown-item:hover {
    padding-left: 1rem;
  }
  .dropdown-icon {
    margin-right: 0.5rem;
  }
  .logout-item {
    border-top: none;
    margin-top: 0;
    padding-top: 0.8rem;
  }
}

</style>