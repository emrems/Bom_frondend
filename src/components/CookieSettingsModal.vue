<template>
  <transition name="modal-fade">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        
        <div class="modal-header">
          <h3>Çerez Tercihleriniz</h3>
          <p>
            Gizliliğiniz bizim için önemlidir. Hangi çerez türlerine izin vermek istediğinizi seçerek deneyiminizi kişiselleştirebilirsiniz.
            Daha fazla bilgi için <router-link to="/kvkk-aydinlatma-metni" @click="$emit('close')">Aydınlatma Metni'ni</router-link> inceleyebilirsiniz.
          </p>
        </div>

        <!-- YENİ: Sekme (Tab) Navigasyonu -->
        <div class="modal-tabs">
          <button 
            :class="['tab-button', { active: activeTab === 'preferences' }]"
            @click="activeTab = 'preferences'"
          >
            Çerez Bildirimi
          </button>
          <button 
            :class="['tab-button', { active: activeTab === 'about' }]"
            @click="activeTab = 'about'"
          >
            Çerezler Hakkında
          </button>
        </div>

        <!-- YENİ: Sekme İçerikleri -->
        <div class="modal-body">
          <!-- Çerez Tercihleri Sekmesi -->
          <div v-if="activeTab === 'preferences'" class="tab-content">
            <!-- Kesinlikle Gerekli Çerezler -->
            <div class="cookie-category">
              <div class="category-header">
                <h4>Kesinlikle Gerekli Çerezler</h4>
                <label class="switch disabled">
                  <input type="checkbox" checked disabled>
                  <span class="slider round"></span>
                </label>
              </div>
              <p class="category-description">
                Bu çerezler, web sitemizin sepet gibi temel işlevlerinin çalışması için gereklidir ve sistemimizde kapatılamaz.
              </p>
            </div>

            <!-- Performans ve Analitik Çerezler -->
            <div class="cookie-category">
              <div class="category-header">
                <h4>Performans ve Analitik Çerezler</h4>
                <label class="switch">
                  <input type="checkbox" v-model="preferences.performance">
                  <span class="slider round"></span>
                </label>
              </div>
              <p class="category-description">
                Bu çerezler, sitemizdeki etkileşimleri anonim olarak ölçerek performansımızı analiz etmemize ve iyileştirmemize olanak tanır.
              </p>
            </div>

            <!-- Hedefleme ve Reklam Çerezleri -->
            <div class="cookie-category">
              <div class="category-header">
                <h4>Hedefleme ve Reklam Çerezleri</h4>
                <label class="switch">
                  <input type="checkbox" v-model="preferences.targeting">
                  <span class="slider round"></span>
                </label>
              </div>
              <p class="category-description">
                Bu çerezler, ilgi alanlarınıza yönelik daha alakalı reklamlar sunmak amacıyla iş ortaklarımız tarafından kullanılabilir.
              </p>
            </div>
          </div>

          <!-- Çerezler Hakkında Sekmesi -->
          <div v-if="activeTab === 'about'" class="tab-content about-cookies">
            <h4>Çerezler Nedir?</h4>
            <p>
              Çerezler, ziyaret ettiğiniz web siteleri tarafından tarayıcınıza veya cihazınıza yerleştirilen küçük metin dosyalarıdır. Web sitelerinin daha verimli çalışmasını sağlamak ve site sahiplerine bilgi sunmak amacıyla yaygın olarak kullanılırlar.
            </p>
            <h4>Neden Çerez Kullanıyoruz?</h4>
            <p>
              Sitemizin düzgün şekilde çalışması, gezinme deneyiminizi kişiselleştirmek ve sitemizin performansını ölçmek için çerezler kullanmaktayız. Çerez kullanımına yönelik onayınızı istediğiniz zaman "Çerez Bildirimi" sekmesinden değiştirebilirsiniz.
            </p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="rejectAll">Tümünü Reddet</button>
          <button class="btn btn-tertiary" @click="savePreferences">Tercihlerimi Kaydet</button>
          <button class="btn btn-primary" @click="acceptAll">Tümünü Kabul Et</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CookieSettingsModal',
  emits: ['close', 'save-preferences'],
  data() {
    return {
      // YENİ: Aktif sekmeyi takip etmek için
      activeTab: 'preferences', // Başlangıçta 'preferences' sekmesi aktif
      
      preferences: {
        performance: true,
        targeting: true,
      }
    };
  },
  methods: {
    acceptAll() {
      const allAccepted = {
        necessary: true,
        performance: true,
        targeting: true,
      };
      this.$emit('save-preferences', allAccepted);
    },
    rejectAll() {
      const allRejected = {
        necessary: true,
        performance: false,
        targeting: false,
      };
      this.$emit('save-preferences', allRejected);
    },
    savePreferences() {
      const finalPreferences = {
        necessary: true,
        ...this.preferences
      };
      this.$emit('save-preferences', finalPreferences);
    }
  }
};
</script>

<style scoped>
/* Mevcut stil kodlarınızın tamamı buraya gelecek... */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&family=Raleway:wght@400;500;600&display=swap');

.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(26, 26, 26, 0.8); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 2000; font-family: 'Raleway', sans-serif; }
.modal-content { background: #ffffff; border-radius: 8px; width: 90%; max-width: 750px; box-shadow: 0 15px 60px rgba(0,0,0,0.4); display: flex; flex-direction: column; max-height: 90vh; overflow: hidden; }
.modal-header { padding: 1.75rem 2.25rem; border-bottom: 1px solid #e9e9e9; }
.modal-header h3 { font-family: 'Playfair Display', serif; margin-top: 0; margin-bottom: 0.75rem; color: #1a1a1a; font-size: 1.5rem; }
.modal-header p { margin-bottom: 0; color: #555; font-size: 0.9rem; line-height: 1.6; }
.modal-header a { color: #c5a47e; text-decoration: none; font-weight: 600; }

/* YENİ: Sekme Stilleri */
.modal-tabs {
  display: flex;
  border-bottom: 1px solid #e9e9e9;
  padding: 0 2.25rem;
  background-color: #f9fafb; /* Sekme arka planını hafifçe ayır */
}
.tab-button {
  padding: 1rem 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: #888;
  position: relative;
  margin-right: 1.5rem;
  border-bottom: 3px solid transparent;
  transition: color 0.3s ease, border-color 0.3s ease;
}
.tab-button:hover {
  color: #333;
}
.tab-button.active {
  color: #c5a47e;
  border-bottom-color: #c5a47e;
}

.modal-body { padding: 0.5rem 2.25rem; overflow-y: auto; }
.cookie-category { padding: 1.5rem 0; border-bottom: 1px solid #f0f0f0; }
.cookie-category:last-child { border-bottom: none; }
.category-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.category-header h4 { margin: 0; font-size: 1.05rem; font-weight: 600; color: #333; }
.category-description { font-size: 0.85rem; color: #666; line-height: 1.6; margin: 0; }

/* YENİ: "Çerezler Hakkında" sekmesi için stiller */
.about-cookies {
    padding: 1.5rem 0;
}
.about-cookies h4 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    font-size: 1.05rem;
    font-weight: 600;
    color: #333;
}
.about-cookies p {
    font-size: 0.85rem;
    color: #666;
    line-height: 1.6;
    margin: 0 0 1rem 0;
}
.about-cookies p:last-child {
    margin-bottom: 0;
}


.modal-footer { padding: 1.5rem 2.25rem; border-top: 1px solid #e9e9e9; display: flex; justify-content: flex-end; gap: 1rem; background: #f9fafb; }
.btn { padding: 12px 28px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.3s ease; border: 1px solid transparent; }
.btn-primary { background-color: #c5a47e; color: white; border-color: #c5a47e; }
.btn-primary:hover { background-color: #b38e64; border-color: #b38e64; }
.btn-secondary { background-color: #fff; color: #555; border-color: #ddd; }
.btn-secondary:hover { background-color: #f1f1f1; border-color: #ccc; }
.btn-tertiary { background-color: #34495e; color: white; border-color: #34495e; }
.btn-tertiary:hover { background-color: #2c3e50; border-color: #2c3e50; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.4s ease; }
.modal-fade-enter-active .modal-content, .modal-fade-leave-active .modal-content { transition: transform 0.4s ease; }
.modal-fade-enter, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter .modal-content, .modal-fade-leave-to .modal-content { transform: translateY(-20px); }
.switch { position: relative; display: inline-block; width: 50px; height: 28px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; }
.slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
input:checked + .slider { background-color: #c5a47e; }
input:focus + .slider { box-shadow: 0 0 1px #c5a47e; }
input:checked + .slider:before { transform: translateX(22px); }
.slider.round { border-radius: 28px; }
.slider.round:before { border-radius: 50%; }
.switch.disabled { opacity: 0.5; cursor: not-allowed; }
@media (max-width: 768px) { .modal-footer { flex-direction: column-reverse; gap: 0.75rem; } .btn { width: 100%; } }
</style>