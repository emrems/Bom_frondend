<template>
  <div class="contact-page">
    <section class="contact-hero">
      <div class="container">
        <h1 class="fade-in-up">Bizimle İletişime Geçin</h1>
        <p class="fade-in-up" style="animation-delay: 0.2s">Değerli müşterilerimiz, uzman ekibimiz her türlü soru ve talebiniz için hizmetinizdedir.</p>
      </div>
    </section>

    <section class="contact-main">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-form-container fade-in-up">
            <div class="form-header">
              <h2><i class="fas fa-paper-plane"></i> Mesajınızı Bırakın</h2>
              <p>24 saat içinde yanıt vereceğiz</p>
            </div>
            
            <form @submit.prevent="submitForm" class="contact-form">
              <div class="form-group">
                <label for="name">Adınız Soyadınız</label>
                <input 
                  v-model="form.name" 
                  type="text" 
                  id="name" 
                  placeholder="Adınız ve soyadınız"
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="email">E-posta Adresiniz</label>
                <input 
                  v-model="form.email" 
                  type="email" 
                  id="email" 
                  placeholder="ornek@email.com"
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="phone">Telefon (Opsiyonel)</label>
                <input 
                  v-model="form.phone" 
                  type="tel" 
                  id="phone" 
                  placeholder="5__ ___ __ __"
                >
              </div>
              
              <div class="form-group">
                <label for="subject">Konu</label>
                <select v-model="form.subject" id="subject" required>
                  <option value="" disabled selected>Konu seçiniz</option>
                  <option value="siparis">Sipariş Sorgulama</option>
                  <option value="urun">Ürün Bilgisi</option>
                  <option value="tasarim">Özel Tasarım</option>
                  <option value="diger">Diğer</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="message">Mesajınız</label>
                <textarea 
                  v-model="form.message" 
                  id="message" 
                  rows="5" 
                  placeholder="Mesajınızı detaylı şekilde yazınız..."
                  required
                ></textarea>
              </div>
              
              <button type="submit" class="submit-btn">
                <i class="fas fa-paper-plane"></i> Mesajı Gönder
              </button>
            </form>
          </div>
          
          <div class="contact-info-container fade-in-up" style="animation-delay: 0.3s">
            <div class="info-card">
              <div class="info-header">
                <h2><i class="fas fa-map-marker-alt"></i> Bizi Ziyaret Edin</h2>
                <p>Mağazamızda ağırlanmaktan mutluluk duyarız</p>
              </div>
              
              <div class="info-content">
                <div class="info-item">
                  <i class="fas fa-store"></i>
                  <div>
                    <h3>Mağaza Adresi</h3>
                    <p>Kuyumcular Çarşısı No:12, İzmit / Kocaeli</p>
                  </div>
                </div>
                
                <div class="info-item">
                  <i class="fas fa-clock"></i>
                  <div>
                    <h3>Çalışma Saatleri</h3>
                    <p>Pazartesi - Cumartesi: 09:00 - 19:00</p>
                    <p>Pazar: Kapalı</p>
                  </div>
                </div>
                
                <div class="info-item">
                  <i class="fas fa-phone-alt"></i>
                  <div>
                    <h3>Telefon</h3>
                    <p><a href="tel:+902621234567">0262 123 45 67</a></p>
                    <p><a href="tel:+905416216960">0541 621 69 60</a></p>
                  </div>
                </div>
                
                <div class="info-item">
                  <i class="fas fa-envelope"></i>
                  <div>
                    <h3>E-posta</h3>
                    <p><a href="mailto:destek@altinkuyumcu.com">destek@altinkuyumcu.com</a></p>
                  </div>
                </div>
              </div>
              
              <div class="social-links">
                <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                <a :href="whatsappLink" target="_blank" class="social-icon whatsapp">
                  <i class="fab fa-whatsapp"></i>
                </a>
                <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
              </div>
            </div>
            
            <div class="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.365313333333!2d29.92083561540659!3d40.77610487932497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cb4ee1433019c3%3A0x408f6c4424853032!2zS3V5dW1jdWxhciDDh2FyxZ_EsXPEsSwgS3V5dW1jdWxhciBDZC4sIDQxMjAwIMSwem1pdC9Lb2NhZWxp!5e0!3m2!1str!2str!4v1672846931234!5m2!1str!2str"
                width="100%"
                height="300"
                style="border:0; border-radius: 8px;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <a :href="whatsappLink" target="_blank" class="whatsapp-float">
      <i class="fab fa-whatsapp"></i>
      <span>WhatsApp Destek</span>
    </a>
  </div>
</template>

<script>
export default {
  name: 'ContactPage',
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      },
      whatsappNumber: '905416216960'
    }
  },
  computed: {
    whatsappLink() {
      return `https://wa.me/${this.whatsappNumber}?text=Merhaba, Altın Kuyumcu'dan bilgi almak istiyorum.`
    }
  },
  methods: {
    submitForm() {
      console.log('Form submitted:', this.form)
      alert('Mesajınız başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.')
      this.resetForm()
    },
    resetForm() {
      this.form = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      }
    }
  },
  // ANİMASYON İÇİN GEREKLİ SCRIPT
  mounted() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1, // Elementin %10'u görününce animasyon başlar
    });

    document.querySelectorAll('.fade-in-up').forEach((el) => {
      observer.observe(el);
    });
  },
}
</script>

<style scoped>
/* Gerekli Fontları Google'dan import ediyoruz */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&family=Cormorant+Garamond:wght@700&display=swap');

/* Global Styles */
.contact-page {
  font-family: 'Poppins', sans-serif;
  color: #333;
  line-height: 1.6;
  background-color: #f9f9f9; /* Hafif gri arka plan */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* YENİ: Kaydırma animasyonları için temel stiller */
.fade-in-up {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.165, 0.84, 0.44, 1),
    transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}


/* Hero Section */
.contact-hero {
  background: linear-gradient(rgba(40, 40, 40, 0.7), rgba(40, 40, 40, 0.7)), 
              url('https://images.pexels.com/photos/7841797/pexels-photo-7841797.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
  background-size: cover;
  background-position: center 70%;
  color: white;
  text-align: center;
  padding: 100px 0;
}

.contact-hero h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 3.5rem; /* Biraz büyütüldü */
  margin-bottom: 1rem;
  font-weight: 700;
  text-shadow: 0 2px 5px rgba(0,0,0,0.5); /* Hafif gölge eklendi */
}

.contact-hero p {
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto;
  opacity: 0.9;
}

/* Contact Main Section */
.contact-main {
  padding: 80px 0;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px; /* Boşluk artırıldı */
  align-items: start; /* Hizalama ayarlandı */
}

/* Contact Form Styles */
.contact-form-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08); /* Gölge yumuşatıldı */
  padding: 40px;
}

.form-header {
  margin-bottom: 30px;
  text-align: center;
}

.form-header h2 {
  font-size: 1.8rem;
  color: #c5a47e; /* Altın rengiyle uyumlu */
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.form-header p {
  color: #666;
}

.contact-form {
  display: grid;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #444;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 14px 18px; /* Dolgu artırıldı */
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif; /* Font ailesi eklendi */
  transition: all 0.3s ease;
}
/* Seçim kutusu için özel stil */
.form-group select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1em;
}


.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #c5a47e;
  outline: none;
  box-shadow: 0 0 0 3px rgba(197, 164, 126, 0.2);
}

.form-group textarea {
  resize: vertical;
  min-height: 150px;
}

.submit-btn {
  background: #c5a47e;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.submit-btn:hover {
  background: #b38e64;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(197, 164, 126, 0.3);
}

/* Contact Info Styles */
.contact-info-container {
  display: flex;
  flex-direction: column; /* Dikey sıralama */
  gap: 30px;
}

.info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08); /* Gölge yumuşatıldı */
  padding: 40px;
}

.info-header {
  margin-bottom: 30px;
  text-align: center;
}

.info-header h2 {
  font-size: 1.8rem;
  color: #c5a47e;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.info-header p {
  color: #666;
}

.info-content {
  display: grid;
  gap: 25px;
}

.info-item {
  display: flex;
  gap: 20px; /* Boşluk artırıldı */
  align-items: flex-start; /* Hizalama ayarlandı */
}

.info-item i {
  font-size: 1.5rem;
  color: #c5a47e;
  margin-top: 5px;
  width: 25px; /* İkonlar için sabit genişlik */
  text-align: center;
}

.info-item h3 {
  font-size: 1.1rem;
  margin-bottom: 5px;
  color: #333;
}

.info-item p,
.info-item a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
}

.info-item a:hover {
  color: #c5a47e;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 40px;
  border-top: 1px solid #f0f0f0; /* Ayırıcı çizgi */
  padding-top: 30px;
}

.social-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.social-icon:hover {
  transform: translateY(-3px) scale(1.1); /* Hafif büyüme efekti */
  color: white;
}

.social-icon.whatsapp:hover {
  background: #25D366;
}
.social-icon:nth-child(1):hover {
  background: #3b5998;
}
.social-icon:nth-child(2):hover {
  background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%);
}
.social-icon:nth-child(4):hover {
  background: #1DA1F2;
}

/* Map Container */
.map-container {
  height: auto;
}

.map-container iframe {
  width: 100%;
  height: 100%;
  min-height: 350px;
  border-radius: 12px;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08);
}

/* WhatsApp Floating Button */
.whatsapp-float {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #25D366;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: 0 5px 20px rgba(37, 211, 102, 0.3);
  z-index: 100;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.whatsapp-float i {
  font-size: 1.8rem;
  transition: transform 0.3s ease;
}

.whatsapp-float span {
  font-size: 0.8rem;
  display: none;
  font-weight: 500;
  margin-left: 8px;
}

.whatsapp-float:hover {
  width: auto;
  border-radius: 30px;
  padding: 10px 20px;
  flex-direction: row;
}

.whatsapp-float:hover span {
  display: inline;
}

.whatsapp-float:hover i {
    transform: rotate(360deg);
}

/* Responsive Design */
@media (max-width: 992px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .contact-hero {
    padding: 80px 0;
  }
  
  .contact-hero h1 {
    font-size: 2.5rem;
  }
  
  .contact-form-container,
  .info-card {
    padding: 30px;
  }
  
  .whatsapp-float:hover {
      width: 60px; /* mobilde hover efekti kaldırılıyor */
      flex-direction: column;
  }
  .whatsapp-float:hover span {
      display: none;
  }
}
</style>