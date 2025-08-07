<template>
  <div class="live-prices-section">
    <div class="container">
      <div class="ticker-header">
        <h2 class="ticker-title">
          <i class="fas fa-chart-line"></i> Canlı Kur Bilgileri
        </h2>
        <p v-if="lastUpdated" class="last-updated">
          Piyasa Son Güncelleme: {{ lastUpdated }}
        </p>
      </div>

      <!-- Yüklenme Durumu -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <!-- Hata Durumu -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
      </div>
      
      <!-- Başarılı Durum -->
      <div v-else>
        <!-- Otomatik Kayan Şerit (v-show ile kontrol ediliyor) -->
        <div v-show="!showTable" class="ticker-wrap">
          <div class="ticker">
            <!-- Orijinal verileri listeliyoruz -->
            <div v-for="price in prices" :key="price.id" class="price-item">
              <h3 class="currency-name">{{ price.kurAdi }}</h3>
              <div class="price-values">
                <div class="price-buy">
                  <span class="label">Alış</span>
                  <span class="value">{{ formatPrice(price.alis) }}</span>
                </div>
                <div class="price-sell">
                  <span class="label">Satış</span>
                  <span class="value">{{ formatPrice(price.satis) }}</span>
                </div>
              </div>
            </div>
            <!-- Animasyonun kesintisiz olması için verileri BİR KEZ DAHA listeliyoruz -->
            <div v-for="price in prices" :key="price.id + '-clone'" class="price-item">
              <h3 class="currency-name">{{ price.kurAdi }}</h3>
              <div class="price-values">
                <div class="price-buy">
                  <span class="label">Alış</span>
                  <span class="value">{{ formatPrice(price.alis) }}</span>
                </div>
                <div class="price-sell">
                  <span class="label">Satış</span>
                  <span class="value">{{ formatPrice(price.satis) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- YENİ: Gizli Kompakt Tablo (v-show ile kontrol ediliyor) -->
        <div v-show="showTable" class="prices-table-container">
          <table class="prices-table">
            <thead>
              <tr>
                <th class="text-left">Altın Fiyatları</th>
                <th class="text-center">Alış</th>
                <th class="text-center">Satış</th>
                <th class="text-center">Saat</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="price in prices" :key="price.id">
                <td class="currency-name-td">{{ price.kurAdi }}</td>
                <td class="text-center price-buy-text">{{ formatPrice(price.alis) }}</td>
                <td class="text-center price-sell-text">{{ formatPrice(price.satis) }}</td>
                <td class="text-center update-time">{{ formatRowTime(price.guncellenmeZamani) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- YENİ: Göster/Gizle Butonu -->
        <div class="toggle-button-container">
          <button @click="showTable = !showTable" class="toggle-btn">
            <i :class="showTable ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
            {{ showTable ? 'Daha Az Göster' : 'Tüm Kurları Gör' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LiveGoldPrices',
  data() {
    return {
      prices: [],
      loading: true,
      error: null,
      lastUpdated: null,
      apiBaseUrl: 'http://localhost:5294',
      // YENİ: Tablonun görünürlüğünü kontrol eden değişken eklendi.
      showTable: false,
    };
  },
  mounted() {
    this.fetchGoldPrices();
    setInterval(this.fetchGoldPrices, 60000); 
  },
  methods: {
    async fetchGoldPrices() {
      this.error = null;
      try {
        const response = await axios.get(`${this.apiBaseUrl}/api/GoldPrice/tum-kurlar`);
        this.prices = response.data;
        if (response.data && response.data.length > 0) {
          this.lastUpdated = this.formatUpdateTime(response.data[0].guncellenmeZamani);
        }
      } catch (err) {
        console.error('Kur bilgileri çekilirken hata oluştu:', err);
        this.error = 'Fiyatlar şu anda alınamıyor. Lütfen daha sonra tekrar deneyin.';
      } finally {
        this.loading = false;
      }
    },
    // GÜNCELLENDİ: Ondalık basamak sayısı 4'e çıkarıldı.
    formatPrice(value) {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) return value;
      return numericValue.toLocaleString('tr-TR', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      });
    },
    formatUpdateTime(dateTimeString) {
      if (!dateTimeString) return '';
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
      });
    },
    formatRowTime(dateTimeString) {
      if (!dateTimeString) return '';
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
/* GÜNCELLENDİ: Tüm stil bloğu hem kayan şeridi hem de tabloyu destekleyecek şekilde güncellendi */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Cormorant+Garamond:wght@700&display=swap');

.live-prices-section {
  background-color: #fff;
  padding: 2.5rem 0;
  font-family: 'Poppins', sans-serif;
  border-bottom: 1px solid #f0f0f0;
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
.ticker-header { text-align: center; margin-bottom: 2rem; }
.ticker-title { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; color: #333; margin: 0 0 0.5rem 0; display: flex; align-items: center; justify-content: center; gap: 1rem; }
.ticker-title i { color: #c5a47e; }
.last-updated { color: #888; font-size: 0.9rem; margin: 0; }
.loading-state, .error-state { text-align: center; padding: 2rem; color: #777; }
.spinner { display: inline-block; width: 24px; height: 24px; border: 3px solid rgba(197, 164, 126, 0.3); border-radius: 50%; border-top-color: #c5a47e; animation: spin 1s ease-in-out infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Otomatik Kayan Şerit */
.ticker-wrap { width: 100%; overflow: hidden; position: relative; }
.ticker-wrap::before, .ticker-wrap::after { content: ''; position: absolute; top: 0; bottom: 0; width: 50px; z-index: 2; pointer-events: none; }
.ticker-wrap::before { left: 0; background: linear-gradient(to right, white, transparent); }
.ticker-wrap::after { right: 0; background: linear-gradient(to left, white, transparent); }
.ticker { display: inline-flex; white-space: nowrap; animation: ticker-scroll 80s linear infinite; }
.ticker-wrap:hover .ticker { animation-play-state: paused; }
@keyframes ticker-scroll { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }

/* Fiyat Kartı */
.price-item { flex: 0 0 auto; width: 220px; margin: 0 1rem; background-color: #fdfaf6; border: 1px solid #f0e9e0; border-radius: 12px; padding: 1.5rem; text-align: center; }
.currency-name { font-size: 1rem; font-weight: 600; color: #333; margin: 0 0 1rem 0; white-space: nowrap; }
.price-values { display: flex; justify-content: space-around; gap: 1rem; }
.price-buy, .price-sell { display: flex; flex-direction: column; }
.label { font-size: 0.8rem; color: #888; margin-bottom: 0.25rem; }
.value { font-size: 1rem; font-weight: 500; }

/* Kompakt Tablo */
.prices-table-container { max-width: 700px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.04); border: 1px solid #f0f0f0; }
.prices-table { width: 100%; border-collapse: collapse; }
.prices-table th { background-color: #f8f9fa; color: #6c757d; padding: 0.6rem 1rem; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.prices-table td { padding: 0.6rem 1rem; border-bottom: 1px solid #f0f0f0; font-size: 0.9rem; color: #333; font-weight: 500; }
.prices-table tbody tr:last-child td { border-bottom: none; }
.prices-table tbody tr:hover { background-color: #fdfaf6; }
.currency-name-td { font-weight: 600; }
.update-time { color: #6c757d; font-size: 0.85rem; }
.text-left { text-align: left; }
.text-center { text-align: center; }

/* Renkler */
.price-buy .value, .price-buy-text { color: #198754; }
.price-sell .value, .price-sell-text { color: #dc3545; }

/* Göster/Gizle Butonu */
.toggle-button-container { text-align: center; margin-top: 1.5rem; }
.toggle-btn { background: none; border: 1px solid #e0e0e0; border-radius: 20px; padding: 8px 20px; font-family: 'Poppins', sans-serif; font-size: 0.9rem; font-weight: 500; color: #555; cursor: pointer; transition: all 0.2s ease; }
.toggle-btn:hover { background-color: #f8f8f8; border-color: #ccc; }
.toggle-btn i { margin-right: 8px; transition: transform 0.3s ease; }
.toggle-btn:hover i { transform: translateY(1px); }
</style>
