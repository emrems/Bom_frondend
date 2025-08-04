<template>
  <transition name="cookie-banner-fade">
    <div class="cookie-banner-overlay" v-if="isVisible">
      <div class="cookie-banner">
        <div class="cookie-content">
          <div class="cookie-icon">
            <span>🍪</span>
          </div>
          <div class="cookie-text">
            <h4>Gizliliğinize Değer Veriyoruz</h4>
            <p>
              Web sitemizde sunduğumuz hizmetlerin kalitesini artırmak ve size özel bir alışveriş deneyimi sunmak amacıyla çerezler kullanmaktayız. Tercihlerinizi yönetmek veya daha fazla bilgi almak için
              <router-link to="/kvkk-aydinlatma-metni" @click="$emit('close')">Çerez Politikamızı</router-link>
              inceleyebilirsiniz.
            </p>
          </div>
        </div>
        <div class="cookie-actions">
          <!-- YENİ: Kişiselleştir butonu eklendi -->
          <button class="btn btn-secondary" @click="$emit('customize')">Kişiselleştir</button>
          <!-- GÜNCELLENDİ: 'accept' eventi 'accept-all' olarak değiştirildi -->
          <button class="btn btn-primary" @click="$emit('accept-all')">Tümünü Kabul Et</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CookieConsentBanner',
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    }
  },
  // GÜNCELLENDİ: Yeni event'ler eklendi
  emits: ['accept-all', 'customize', 'close'],
}
</script>

<style scoped>
/* Google Fonts (Projenizin ana CSS dosyasında zaten varsa bu satırı silebilirsiniz) */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&family=Raleway:wght@400;500&display=swap');

.cookie-banner-overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem;
  box-sizing: border-box;
  z-index: 1050;
  font-family: 'Raleway', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cookie-banner {
  background-color: #2c3e50; /* Koyu, kurumsal bir arka plan */
  color: #fdfaf6;
  width: 100%;
  max-width: 800px; /* Biraz daha geniş */
  padding: 1.5rem 2rem;
  border-radius: 8px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  border-left: 4px solid #c5a47e;
}

.cookie-content {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-grow: 1;
}

.cookie-icon span {
  font-size: 2.5rem; /* İkonu biraz büyüttük */
  line-height: 1;
  opacity: 0.8;
}

.cookie-text h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-family: 'Playfair Display', serif;
  font-weight: 500;
  font-size: 1.2rem;
  color: #ffffff;
}

.cookie-text p {
  margin-bottom: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #dcdcdc;
}

.cookie-text a {
  color: #c5a47e;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s ease;
}

.cookie-text a:hover {
  border-bottom-color: #c5a47e;
}

.cookie-actions {
  display: flex;
  gap: 1rem;
  flex-shrink: 0; /* Butonların küçülmesini engelle */
}

.btn {
  padding: 12px 28px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  white-space: nowrap;
  letter-spacing: 0.5px;
}

.btn-primary {
  background-color: #c5a47e;
  color: #2c3e50;
  border: 1px solid #c5a47e;
}

.btn-primary:hover {
  background-color: transparent;
  color: #c5a47e;
}

/* YENİ: 'Kişiselleştir' butonu için stil */
.btn-secondary {
  background-color: transparent;
  color: #fdfaf6;
  border: 1px solid #777;
}

.btn-secondary:hover {
  background-color: #fdfaf6;
  color: #2c3e50;
  border-color: #fdfaf6;
}

/* Geçiş Efektleri */
.cookie-banner-fade-enter-active, .cookie-banner-fade-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.cookie-banner-fade-enter, .cookie-banner-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Mobil Cihazlar için Düzenleme */
@media (max-width: 768px) {
  .cookie-banner-overlay {
    padding: 1rem;
  }
  .cookie-banner {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.25rem;
    padding: 1.5rem;
  }
  .cookie-content {
    flex-direction: column;
    gap: 0.75rem;
  }
  .cookie-actions {
    width: 100%;
    display: flex;
    justify-content: center; /* Butonları ortala */
  }
}
</style>