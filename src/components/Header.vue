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
        bileklikler: "fa-bracelet", // Font Awesome 5'te bu ikonlar olmayabilir, kontrol edin.
        kolyeler: "fa-necklace", // Varsayılan olarak fa-tag döner
        yuzukler: "fa-ring",
        kupeeler: "fa-earrings", // Varsayılan olarak fa-tag döner
      };
      // Eğer Font Awesome Pro kullanmıyorsanız veya bu özel ikonlar yoksa,
      // `fas` yerine `fa` veya `far` kullanabilirsiniz. Ya da ortak bir ikon atayabilirsiniz.
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
/* Font Awesome ikonları için - BU SATIR EN ÜSTE TAŞINDI */
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

/* Genel Yapı ve Sıfırlamalar */
.main-header {
  background: #ffffff; /* Parlak beyaz */
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Daha belirgin gölge */
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; /* Daha modern font */
}

.container {
  max-width: 1280px; /* Daha geniş alan */
  margin: 0 auto;
  padding: 0 1.5rem; /* Yan boşlukları artır */
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo */
.brand-logo {
  text-decoration: none;
  color: #d4af37; /* Altın rengi */
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand-logo h1 {
  font-size: 1.9rem; /* Biraz büyüdü */
  font-weight: 800; /* Daha kalın */
  margin: 0;
  letter-spacing: -0.5px; /* Hafifçe sıkıştır */
}

/* Navigasyon Menüsü */
.main-nav {
  display: flex;
  align-items: center;
  gap: 1.8rem; /* Nav öğeleri arası boşluk */
}

.nav-item {
  color: #333; /* Koyu gri, okunabilir */
  text-decoration: none;
  font-weight: 600; /* Biraz kalın */
  padding: 0.6rem 0;
  position: relative;
  transition: all 0.3s ease; /* Daha yumuşak geçiş */
  cursor: pointer;
  display: flex; /* İkon ve metin için flex */
  align-items: center;
  user-select: none; /* Metin seçimi engelle */
}

.nav-item:hover {
  color: #d4af37; /* Hover'da altın rengi */
}

.nav-item::after {
  content: "";
  position: absolute;
  bottom: -3px; /* Alt çizginin yeri */
  left: 0;
  width: 100%;
  height: 2px;
  background: #d4af37;
  transform: scaleX(0); /* Başlangıçta gizli */
  transition: transform 0.3s ease;
}

.nav-item:hover::after {
  transform: scaleX(1); /* Hover'da belirsin */
}

.nav-icon {
  margin-right: 0.5rem; /* İkon ile metin arası boşluk */
  font-size: 1.1rem;
}

/* Sepet Rozeti */
.cart-link {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -10px; /* Biraz daha yukarı */
  right: -12px; /* Biraz daha sağa */
  background: #e74c3c; /* Canlı kırmızı */
  color: white;
  border-radius: 50%;
  padding: 3px 7px; /* Boyutunu ayarla */
  font-size: 0.7rem;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Hafif gölge */
  min-width: 22px; /* Tek haneli sayılar için */
  text-align: center;
  line-height: 1;
}

/* Dropdown Menü */
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
  transform: rotate(180deg); /* Açılırken dönsün */
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px); /* Nav öğesinin biraz altına in */
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); /* Daha belirgin gölge */
  padding: 0.8rem 0;
  z-index: 999;
  min-width: 220px;
  transform-origin: top; /* Üstten açılma animasyonu */
  animation: dropdownFadeIn 0.3s ease-out forwards;
  opacity: 0; /* Başlangıçta gizli */
  transform: translateY(-10px); /* Başlangıçta hafif yukarıda */
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
  display: flex; /* İkon ve metin için flex */
  align-items: center;
  padding: 0.8rem 1.5rem;
  color: #555; /* Açık gri */
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  user-select: none;
}

.dropdown-icon {
  margin-right: 0.8rem;
  font-size: 1rem;
  width: 20px; /* İkonlar için sabit genişlik */
  text-align: center;
}

.dropdown-item:hover {
  color: #d4af37;
  background: rgba(212, 175, 55, 0.08); /* Hafif altın rengi arka plan */
  padding-left: 1.8rem; /* Hafif kayma efekti */
}

.dropdown-item.logout-item {
  border-top: 1px solid #eee; /* Çıkış yap butonu için ayırıcı */
  margin-top: 0.5rem;
  padding-top: 1rem;
}

/* Hamburger Menü (Mobil) */
.hamburger-menu {
  display: none; /* Varsayılan olarak gizli */
  flex-direction: column;
  justify-content: space-between;
  width: 30px; /* Boyutunu büyüt */
  height: 22px;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  z-index: 1001; /* Navigasyonun üstünde */
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
  opacity: 0; /* Orta çizgi kaybolur */
}

.hamburger-menu span.is-active:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

/* Responsive Tasarım */
@media screen and (max-width: 992px) {
  /* Tablet boyutları için breakpoint */
  .main-nav {
    gap: 1.2rem;
  }
}

@media screen and (max-width: 768px) {
  /* Mobil boyutları için breakpoint */
  .hamburger-menu {
    display: flex; /* Mobilde görünür */
  }

  .main-nav {
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
    display: flex; /* Default olarak esnek */
    transform: translateX(100%); /* Başlangıçta sağdan gizli */
    transition: transform 0.4s ease-in-out;
    opacity: 0; /* Başlangıçta gizli */
    pointer-events: none; /* Tıklamayı engelle */
  }

  .main-nav.is-open {
    transform: translateX(0%); /* Açıkken görünür */
    opacity: 1; /* Görünür hale gel */
    pointer-events: all; /* Tıklamayı etkinleştir */
  }

  .nav-item {
    font-size: 1.4rem; /* Mobil menüde büyüt */
    margin: 0.8rem 0;
    color: #333;
    width: 100%; /* Tüm genişliği kapla */
    text-align: center;
    justify-content: center; /* Ortala */
    padding: 1rem 0;
  }

  .nav-item::after {
    bottom: -5px;
  }

  .nav-icon {
    font-size: 1.3rem;
  }

  /* Mobil Dropdownlar */
  .nav-dropdown {
    width: 100%;
    text-align: center;
  }

  .dropdown-toggle {
    width: 100%;
    justify-content: center;
  }

  .dropdown-menu {
    position: static; /* Statik konum */
    box-shadow: none;
    background: #f8f8f8; /* Hafif gri arka plan */
    padding: 0.5rem 0;
    animation: none;
    opacity: 1; /* Her zaman görünür */
    transform: none;
    width: 90%; /* Mobil cihazda biraz daralt */
    margin: 0 auto 1rem auto; /* Üstten ve alttan boşluk */
    border-radius: 8px;
  }

  .dropdown-item {
    padding: 0.7rem 1rem;
    font-size: 1.1rem;
    justify-content: center; /* Ortala */
  }

  .dropdown-item:hover {
    padding-left: 1rem; /* Kayma efektini kaldır */
  }
  .dropdown-icon {
    margin-right: 0.5rem; /* Mobil ikon boşluğu */
  }

  .logout-item {
    border-top: none; /* Mobilde ayırıcıyı kaldır */
    margin-top: 0;
    padding-top: 0.7rem;
  }
}

/* Özel ikonlar için (eğer kullanılıyorsa) */
/* Font Awesome 5 Free sürümleri bazı ikonları içermeyebilir,
   bu durumda bu kurallar işe yaramayabilir.
   Gerekirse Font Awesome Pro'ya geçiş yapabilir veya farklı ikon kütüphaneleri kullanabilirsiniz. */
@font-face {
  font-family: "Custom Icons"; /* Eğer özel ikon fontunuz varsa */
  src: url("path/to/custom-icons.woff2") format("woff2");
}

.fa-bracelet:before {
  content: "\f0c1"; /* Bu kodlar Font Awesome'a özeldir. Eğer FA pro değilse çalışmaz. */
}

.fa-necklace:before {
  content: "\f302"; /* Bu kodlar Font Awesome'a özeldir. Eğer FA pro değilse çalışmaz. */
}

.fa-earrings:before {
  content: "\f0c4"; /* Bu kodlar Font Awesome'a özeldir. Eğer FA pro değilse çalışmaz. */
}
</style>
