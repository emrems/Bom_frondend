<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-column about">
          <h3 class="footer-title">✨ Altın Kuyumcu</h3>
          <p class="footer-tagline">60 yıllık tecrübe ile işlenen, nesiller boyu aktarılacak mücevherler.</p>
          <div class="social-media-links">
            <a v-for="social in socialLinks" :key="social.name" :href="social.url" target="_blank" :aria-label="social.name">
              <i :class="social.icon"></i>
            </a>
          </div>
        </div>

        <div class="footer-column links">
          <h4 class="footer-title">Hızlı Erişim</h4>
          <ul>
            <li v-for="link in quickLinks" :key="link.name">
              <router-link :to="link.path">{{ link.name }}</router-link>
            </li>
          </ul>
        </div>

        <div class="footer-column contact">
          <h4 class="footer-title">İletişim</h4>
          <ul>
            <li><i class="fas fa-map-marker-alt"></i><span>Kapalıçarşı, İstanbul, Türkiye</span></li>
            <li><i class="fas fa-phone-alt"></i><a href="tel:+902125550123">0212 555 0123</a></li>
            <li><i class="fas fa-envelope"></i><a href="mailto:info@altinkuyumcu.com">info@altinkuyumcu.com</a></li>
          </ul>
        </div>

        <div class="footer-column newsletter">
          <h4 class="footer-title">Fırsatlardan Haberdar Olun</h4>
          <p>Yeni koleksiyonlar ve özel indirimler için bültenimize kaydolun.</p>
          <form class="newsletter-form" @submit.prevent="subscribeNewsletter">
            <input type="email" placeholder="E-posta adresiniz" required />
            <button type="submit" aria-label="Abone Ol">
              <i class="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Altın Kuyumcu. Tüm hakları saklıdır.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      quickLinks: [
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Hakkımızda', path: '/about' },
        { name: 'Tüm Ürünler', path: '/products' },
        { name: 'İletişim', path: '/contact' }
      ],
      socialLinks: [
        { name: 'Instagram', url: '#', icon: 'fab fa-instagram' },
        { name: 'Facebook', url: '#', icon: 'fab fa-facebook-f' },
        { name: 'Twitter', url: '#', icon: 'fab fa-twitter' },
      ]
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  },
  methods: {
    subscribeNewsletter() {
      // E-bülten kayıt mantığı buraya eklenebilir.
      alert('Bültenimize başarıyla kaydoldunuz!');
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Raleway:wght@400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.site-footer {
  background-color: #1a1a1a; /* Derin antrasit arka plan */
  color: #a9a9a9; /* Yumuşak gri metin */
  padding: 5rem 0 2rem;
  margin-top: auto;
  font-family: 'Raleway', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 4rem;
}

.footer-title {
  font-family: 'Cormorant Garamond', serif;
  color: #c5a47e; /* Sitenin ana altın rengi */
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.6rem;
  font-weight: 700;
}

.footer-column.about .footer-title {
    font-size: 1.8rem;
}

.footer-tagline {
  line-height: 1.7;
  margin-bottom: 2rem;
}

.social-media-links {
  display: flex;
  gap: 1.2rem;
}

.social-media-links a {
  color: #a9a9a9;
  font-size: 1.3rem;
  transition: all 0.3s ease;
}

.social-media-links a:hover {
  color: #c5a47e;
  transform: translateY(-3px);
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column.links li {
  margin-bottom: 0.8rem;
}

.footer-column.links a {
  color: #a9a9a9;
  text-decoration: none;
  transition: color 0.3s ease;
  position: relative;
}

.footer-column.links a::after {
    content: '';
    position: absolute;
    width: 0;
    height: 1px;
    display: block;
    margin-top: 2px;
    right: 0;
    background: #c5a47e;
    transition: width 0.3s ease;
}

.footer-column.links a:hover::after {
    width: 100%;
    left: 0;
}

.footer-column.links a:hover {
  color: white;
}

.footer-column.contact li {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.footer-column.contact i {
  color: #c5a47e;
  margin-top: 4px;
}

.footer-column.contact a {
  color: #a9a9a9;
  text-decoration: none;
  transition: color 0.3s ease;
}
.footer-column.contact a:hover {
  color: white;
}

.footer-column.newsletter p {
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.newsletter-form {
  display: flex;
  position: relative;
}

.newsletter-form input {
  width: 100%;
  padding: 12px 50px 12px 20px;
  border: 1px solid #444;
  background-color: #222;
  border-radius: 50px;
  color: white;
  font-family: 'Raleway', sans-serif;
  font-size: 1rem;
}

.newsletter-form input:focus {
    outline: none;
    border-color: #c5a47e;
}

.newsletter-form button {
  position: absolute;
  right: 5px;
  top: 5px;
  bottom: 5px;
  width: 40px;
  border: none;
  background-color: #c5a47e;
  color: #1a1a1a;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;
}

.newsletter-form button:hover {
    background-color: #b38e64;
}

.footer-bottom {
  border-top: 1px solid #333;
  padding-top: 2rem;
  text-align: center;
  color: #777;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .social-media-links, .newsletter-form {
    justify-content: center;
  }
  .footer-column.contact li {
      justify-content: center;
  }
}
</style>