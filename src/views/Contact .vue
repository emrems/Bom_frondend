<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="contact-hero">
      <div class="container">
        <h1>Bizimle İletişime Geçin</h1>
        <p>Değerli müşterilerimiz, uzman ekibimiz her türlü soru ve talebiniz için hizmetinizdedir.</p>
      </div>
    </section>

    <!-- Contact Content -->
    <section class="contact-main">
      <div class="container">
        <div class="contact-grid">
          <!-- Contact Form -->
          <div class="contact-form-container">
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
          
          <!-- Contact Info -->
          <div class="contact-info-container">
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
                    <p><a href="mailto:destek@pirlantacim.com">destek@pirlantacim.com</a></p>
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3066.8183969129986!2d29.9203962!3d40.766963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cb4f48e5ffb5d1%3A0x11b37f6895fa57d9!2sKuyumcular%20%C3%87ar%C5%9F%C4%B1s%C4%B1%2C%20%C4%B0zmit!5e0!3m2!1str!2str!4v1690219207287"
                width="100%"
                height="300"
                style="border:0; border-radius: 8px;"
                allowfullscreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- WhatsApp Floating Button -->
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
      // Form gönderim işlemleri
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
  }
}
</script>

<style scoped>
/* Global Styles */
.contact-page {
  font-family: 'Poppins', sans-serif;
  color: #333;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.contact-hero {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
              url('https://images.pexels.com/photos/3266710/pexels-photo-3266710.jpeg');
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  padding: 100px 0;
}

.contact-hero h1 {
  font-size: 2.8rem;
  margin-bottom: 1rem;
  font-weight: 700;
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
  gap: 40px;
}

/* Contact Form Styles */
.contact-form-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 40px;
}

.form-header {
  margin-bottom: 30px;
  text-align: center;
}

.form-header h2 {
  font-size: 1.8rem;
  color: #d4af37;
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
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #d4af37;
  outline: none;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
}

.form-group textarea {
  resize: vertical;
  min-height: 150px;
}

.submit-btn {
  background: #d4af37;
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
  background: #c19d2e;
  transform: translateY(-2px);
}

/* Contact Info Styles */
.contact-info-container {
  display: grid;
  gap: 30px;
}

.info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 40px;
}

.info-header {
  margin-bottom: 30px;
  text-align: center;
}

.info-header h2 {
  font-size: 1.8rem;
  color: #d4af37;
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
  gap: 15px;
}

.info-item i {
  font-size: 1.5rem;
  color: #d4af37;
  margin-top: 3px;
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
  color: #d4af37;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 40px;
}

.social-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.social-icon:hover {
  transform: translateY(-3px);
  color: white;
}

.social-icon.whatsapp:hover {
  background: #25D366;
}

.social-icon:nth-child(1):hover {
  background: #3b5998;
}

.social-icon:nth-child(2):hover {
  background: #E1306C;
}

.social-icon:nth-child(4):hover {
  background: #1DA1F2;
}

/* Map Container */
.map-container {
  height: 100%;
}

.map-container iframe {
  width: 100%;
  height: 100%;
  min-height: 300px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
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
  transition: all 0.3s ease;
}

.whatsapp-float i {
  font-size: 1.8rem;
}

.whatsapp-float span {
  font-size: 0.7rem;
  margin-top: 2px;
  display: none;
}

.whatsapp-float:hover {
  width: 160px;
  border-radius: 30px;
  padding: 0 15px;
  flex-direction: row;
  justify-content: space-between;
}

.whatsapp-float:hover span {
  display: inline;
}

/* Responsive Design */
@media (max-width: 992px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
  
  .map-container {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .contact-hero {
    padding: 80px 0;
  }
  
  .contact-hero h1 {
    font-size: 2.2rem;
  }
  
  .contact-form-container,
  .info-card {
    padding: 30px;
  }
  
  .whatsapp-float {
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
  }
  
  .whatsapp-float i {
    font-size: 1.5rem;
  }
}
</style>