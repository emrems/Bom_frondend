<template>
  <div class="order-lookup-page">
    <!-- 1. Arama Formu Bölümü -->
    <div v-if="!orderData" class="form-container">
      <h1>Sipariş Takip</h1>
      <p class="subtitle">Sipariş numaranızı ve e-posta adresinizi girerek siparişinizin durumunu ve kargo bilgilerinizi takip edebilirsiniz.</p>

      <form @submit.prevent="handleSearch" class="lookup-form">
        <div class="form-group">
          <label for="orderNumber">Sipariş Numarası</label>
          <input
            id="orderNumber"
            v-model="orderNumberInput"
            type="text"
            placeholder="Örn: SP-638901607279436015"
            required
          />
        </div>
        <div class="form-group">
          <label for="email">E-posta Adresi</label>
          <input
            id="email"
            v-model="emailInput"
            type="email"
            placeholder="siparis_verdiginiz@mail.com"
            required
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Sorgulanıyor...' : 'Siparişimi Bul' }}
        </button>
      </form>
    </div>

    <!-- 2. Sonuç Bölümü -->
    <div v-if="orderData" class="result-container">
      <!-- Özel Durum Kartı Tasarımı -->
      <div v-if="isExceptionStatus" class="exception-status-card" :class="exceptionStatusClass">
        <div class="exception-icon-wrapper">
          <i :class="exceptionStatusIcon"></i>
        </div>
        <div class="exception-content">
          <h3 class="exception-title">{{ getStatusLabel(orderData.orderStatus) }}</h3>
          <p class="exception-message">{{ getStatusMessage(orderData.orderStatus) }}</p>
          <span class="order-info">Sipariş #{{ orderData.orderNumber }}</span>
        </div>
      </div>
      
      <!-- Ana Akış İçin İlerleme Çubuğu -->
      <div v-else class="order-tracking-card">
        <div class="tracking-header">
          <div>
            <h2>Sipariş #{{ orderData.orderNumber }}</h2>
            <p>Sipariş Tarihi: {{ new Date(orderData.orderDate).toLocaleString('tr-TR') }}</p>
          </div>
          <span class="status-badge" :class="statusClass">{{ getStatusLabel(orderData.orderStatus) }}</span>
        </div>

        <div class="progress-tracker">
          <div v-for="(step, index) in progressSteps" :key="step.label" class="step" :class="{ 'completed': index < currentStepIndex, 'active': index === currentStepIndex }">
            <div class="step-icon">
              <i v-if="index < currentStepIndex" class="fas fa-check"></i>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <p class="step-label">{{ step.label }}</p>
            <div v-if="index < progressSteps.length - 1" class="step-connector"></div>
          </div>
        </div>
        
        <div class="status-description">
          <p>{{ getStatusMessage(orderData.orderStatus) }}</p>
          <div v-if="orderData.orderStatus === 'Shipped' && orderData.trackingNumber">
            Kargo Takip Numarası: <strong>{{ orderData.trackingNumber }} ({{ orderData.shippingProvider }})</strong>
          </div>
        </div>
      </div>
      
      <!-- GÜNCELLENDİ: Butonlar bir div içine alındı ve yeni buton eklendi -->
      <div class="action-buttons">
        <button @click="resetSearch" class="new-query-button">Yeni Sorgu Yap</button>
        <button @click="goToHome" class="home-button">Ana Sayfaya Dön</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // YENİ: vue-router'dan useRouter import edildi
import axios from 'axios';

// --- STATİK VERİLER ---
const orderStatuses = [
  { value: 'PendingApproval', label: 'Onay Bekliyor', step: 0, message: 'Siparişiniz alındı ve inceleniyor.' },
  { value: 'Approved', label: 'Onaylandı', step: 1, message: 'Siparişiniz onaylandı ve hazırlanma sürecine geçildi.' },
  { value: 'Rejected', label: 'Reddedildi', step: -1, message: 'Üzgünüz, siparişiniz reddedildi. Detaylar için müşteri hizmetleriyle iletişime geçebilirsiniz.' },
  { value: 'Shipped', label: 'Kargoya Verildi', step: 2, message: 'Siparişiniz kargoya verildi. Kargo bilgilerini aşağıda bulabilirsiniz.' },
  { value: 'Delivered', label: 'Teslim Edildi', step: 3, message: 'Siparişiniz başarıyla teslim edildi. İyi günlerde kullanın!' },
  { value: 'Cancelled', label: 'İptal Edildi', step: -1, message: 'Siparişiniz talebiniz üzerine iptal edilmiştir.' },
  { value: 'ReturnRequested', label: 'İade Talebi', step: -1, message: 'İade talebiniz alındı ve inceleniyor.' },
  { value: 'ReturnApproved', label: 'İade Onaylandı', step: -1, message: 'İade talebiniz onaylandı. Süreç hakkında bilgilendirileceksiniz.' },
  { value: 'ReturnRejected', label: 'İade Reddedildi', step: -1, message: 'Üzgünüz, iade talebiniz reddedildi.' }
];

const progressSteps = [
  { label: 'Sipariş Alındı' },
  { label: 'Onaylandı' },
  { label: 'Kargoda' },
  { label: 'Teslim Edildi' }
];

// --- REAKTİF DEĞİŞKENLER ---
const orderNumberInput = ref('');
const emailInput = ref('');
const orderData = ref(null);
const isLoading = ref(false);
const errorMessage = ref('');
const router = useRouter(); // YENİ: Router instance'ı oluşturuldu
const API_BASE_URL = 'http://localhost:5294'; // Gerekirse değiştirin

// --- COMPUTED (HESAPLANMIŞ) DEĞİŞKENLER ---

// Siparişin mevcut adım indeksini hesaplar (0'dan başlar)
const currentStepIndex = computed(() => {
  if (!orderData.value) return -1;
  const statusInfo = orderStatuses.find(s => s.value === orderData.value.orderStatus);
  return statusInfo ? statusInfo.step : -1;
});

// İptal, Red gibi ana akış dışındaki durumları kontrol eder
const isExceptionStatus = computed(() => {
    return currentStepIndex.value === -1 && orderData.value;
});

// Durum etiketine özel CSS sınıfı verir (renklendirme için)
const statusClass = computed(() => {
    if(!orderData.value) return '';
    const status = orderData.value.orderStatus.toLowerCase();
    if(status.includes('approve') || status.includes('delivered')) return 'status-success';
    if(status.includes('pending') || status.includes('shipped')) return 'status-warning';
    return 'status-default';
});

// İstisnai durum kartları için CSS sınıfı verir
const exceptionStatusClass = computed(() => {
  if (!isExceptionStatus.value) return '';
  const status = orderData.value.orderStatus.toLowerCase();
  if (status.includes('cancel') || status.includes('reject')) return 'status-danger';
  if (status.includes('return')) return 'status-info';
  return 'status-default';
});

// İstisnai durum ikonları
const exceptionStatusIcon = computed(() => {
    if (!isExceptionStatus.value) return '';
    const status = orderData.value.orderStatus.toLowerCase();
    if (status.includes('cancel') || status.includes('reject')) return 'fas fa-times-circle';
    if (status.includes('return')) return 'fas fa-undo-alt';
    return 'fas fa-info-circle';
});

// --- METOTLAR ---

// API'den sipariş arama
const handleSearch = async () => {
  orderData.value = null;
  errorMessage.value = '';
  isLoading.value = true;
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Orders/lookup`, {
      params: { orderNumber: orderNumberInput.value, email: emailInput.value }
    });
    orderData.value = response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = 'Bu bilgilere ait bir sipariş bulunamadı. Lütfen bilgilerinizi kontrol ediniz.';
    } else {
      errorMessage.value = 'Sipariş sorgulanırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
    }
    console.error('API Error:', error);
  } finally {
    isLoading.value = false;
  }
};

// Formu ve sonuçları sıfırlama
const resetSearch = () => {
  orderNumberInput.value = '';
  emailInput.value = '';
  orderData.value = null;
  errorMessage.value = '';
};

// YENİ: Ana sayfaya yönlendiren metot
const goToHome = () => {
  router.push('/');
};

// Gelen İngilizce status değerini Türkçe'ye çevirir
const getStatusLabel = (statusValue) => {
  const statusInfo = orderStatuses.find(s => s.value === statusValue);
  return statusInfo ? statusInfo.label : statusValue;
};

// Duruma özel açıklama mesajını getirir
const getStatusMessage = (statusValue) => {
  const statusInfo = orderStatuses.find(s => s.value === statusValue);
  return statusInfo ? statusInfo.message : 'Siparişinizin durumu hakkında bilgi bulunamadı.';
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

.order-lookup-page {
  max-width: 960px; 
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Segoe UI', sans-serif;
}

.form-container, .result-container {
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  text-align: center;
}

h1, h2 {
  color: #2c3e50;
}

.subtitle {
  color: #7f8c8d;
  margin-bottom: 2rem;
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;
}

.lookup-form .form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.lookup-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #34495e;
}

.lookup-form input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.2s;
}

.lookup-form input:focus {
  outline: none;
  border-color: #3498db;
}

.lookup-form button {
  width: 100%;
  padding: 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  transition: background-color 0.2s;
}

.lookup-form button:hover {
  background-color: #2980b9;
}

.lookup-form button:disabled {
  background-color: #a9d6f5;
  cursor: not-allowed;
}

/* YENİ: Butonları sarmalayan div için stiller */
.action-buttons {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap; /* Mobil için */
}

/* GÜNCELLENDİ: `margin-top` ana kapsayıcıya taşındığı için buradan kaldırıldı. */
.new-query-button, .home-button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.new-query-button {
  background-color: #95a5a6;
  color: white;
}

.new-query-button:hover {
  background-color: #7f8c8d;
}

/* YENİ: Ana sayfaya dön butonu için stiller */
.home-button {
  background-color: #3498db;
  color: white;
}

.home-button:hover {
  background-color: #2980b9;
}


.error-message {
  color: #e74c3c;
  background-color: #fdedec;
  border: 1px solid #f5b7b1;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

/* TAKİP KARTI STİLLERİ */
.order-tracking-card {
  text-align: left;
  background-color: #f9fafb;
  padding: 2.5rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.tracking-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.tracking-header h2 { margin: 0; }
.tracking-header p { margin: 0.2rem 0 0; color: #6b7280; }

.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  color: #fff;
  white-space: nowrap;
}
.status-success { background-color: #2ecc71; }
.status-warning { background-color: #f39c12; }
.status-danger { background-color: #e74c3c; }
.status-info { background-color: #3498db; }
.status-default { background-color: #95a5a6; }

/* İlerleme Çubuğu */
.progress-tracker {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2.5rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 25%;
  text-align: center;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e5e7eb;
  color: #9ca3af;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.2rem;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.step-label {
  margin-top: 0.8rem;
  font-weight: 500;
  color: #9ca3af;
  transition: color 0.3s ease;
}

.step-connector {
  position: absolute;
  top: 20px;
  left: 50%;
  height: 2px;
  width: 100%;
  background-color: #e5e7eb;
  z-index: -1;
  transition: background-color 0.3s ease;
}

.step.active .step-icon {
  background-color: #3498db;
  color: #fff;
  border-color: #3498db;
}
.step.active .step-label { color: #34495e; }

.step.completed .step-icon {
  background-color: #2ecc71;
  color: #fff;
  border-color: #2ecc71;
}
.step.completed .step-label { color: #34495e; }

.step.completed .step-connector {
  background-color: #2ecc71;
}

.status-description {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  text-align: center;
  color: #34495e;
  font-size: 1.1rem;
}

/* ÖZEL DURUM KARTI STİLLERİ */
.exception-status-card {
  display: flex;
  align-items: center;
  gap: 2rem;
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  text-align: left;
}

.exception-icon-wrapper {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 1.8rem;
}
.exception-status-card.status-danger .exception-icon-wrapper { background-color: #e74c3c; }
.exception-status-card.status-info .exception-icon-wrapper { background-color: #3498db; }
.exception-status-card.status-default .exception-icon-wrapper { background-color: #95a5a6; }


.exception-content {
  flex-grow: 1;
}

.exception-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: #343a40;
}

.exception-message {
  margin: 0 0 0.8rem 0;
  font-size: 1.1rem;
  color: #6c757d;
}

.order-info {
  font-size: 0.9rem;
  color: #6c757d;
  background-color: #e9ecef;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  display: inline-block;
}
</style>