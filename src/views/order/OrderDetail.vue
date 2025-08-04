<template>
  <div class="order-detail-container">
    <!-- Yükleme Durumu -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Sipariş detayları yükleniyor...</p>
    </div>

    <!-- Hata Durumu -->
    <div v-if="error" class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <h3>Sipariş bilgileri alınamadı</h3>
      <p>{{ error }}</p>
      <button @click="fetchOrderDetail" class="retry-button">
        <i class="fas fa-sync-alt"></i> Tekrar Deneyin
      </button>
    </div>

    <!-- Sipariş Detayları -->
    <div v-if="order" class="order-detail-card">
      <!-- Başlık ve Genel Bilgiler -->
      <div class="order-header">
        <div class="order-title">
          <h1>Sipariş Detayları</h1>
          <span class="order-number">#{{ order.orderNumber }}</span>
        </div>
        <div v-if="order.orderStatus" class="order-status-badge" :class="getStatusClass(order.orderStatus)">
          {{ getStatusText(order.orderStatus) }}
        </div>
      </div>

      <div class="order-meta">
        <div class="meta-item">
          <i class="far fa-calendar-alt"></i>
          <span>{{ formatDate(order.orderDate) }}</span>
        </div>
        <div class="meta-item">
          <i class="fas fa-receipt"></i>
          <span>{{ formatPrice(order.totalAmount) }}</span>
        </div>
      </div>

      <!-- Adres Bilgileri -->
      <div class="address-section">
        <div v-if="order.shippingAddress" class="address-card">
          <div class="address-header">
            <i class="fas fa-truck"></i>
            <h3>Teslimat Adresi</h3>
          </div>
          <div class="address-content">
            <p class="address-title">{{ order.shippingAddress.addressTitle }}</p>
            <p>{{ order.shippingAddress.contactName }}</p>
            <p>{{ order.shippingAddress.phoneNumber }}</p>
            <p>
              {{ order.shippingAddress.fullAddress }}, 
              {{ order.shippingAddress.district }}, 
              {{ order.shippingAddress.city }}
            </p>
            <p>Posta Kodu: {{ order.shippingAddress.postalCode }}</p>
          </div>
        </div>

        <div v-if="order.billingAddress" class="address-card">
          <div class="address-header">
            <i class="fas fa-file-invoice-dollar"></i>
            <h3>Fatura Adresi</h3>
          </div>
          <div class="address-content">
            <p class="address-title">{{ order.billingAddress.addressTitle }}</p>
            <p>{{ order.billingAddress.contactName }}</p>
            <p>{{ order.billingAddress.phoneNumber }}</p>
            <p>
              {{ order.billingAddress.fullAddress }}, 
              {{ order.billingAddress.district }}, 
              {{ order.billingAddress.city }}
            </p>
            <p>Posta Kodu: {{ order.billingAddress.postalCode }}</p>
          </div>
        </div>
      </div>

      <!-- Sipariş Öğeleri -->
      <div v-if="order.items && order.items.length" class="order-items-section">
        <h3><i class="fas fa-box-open"></i> Sipariş Öğeleri</h3>
        <div class="order-items-table">
          <div class="table-header">
            <div class="col-product">Ürün</div>
            <div class="col-price">Birim Fiyat</div>
            <div class="col-quantity">Adet</div>
            <div class="col-total">Toplam</div>
          </div>
          <div 
            v-for="item in order.items" 
            :key="item.productId" 
            class="table-row"
          >
            <div class="col-product">
              <span class="product-name">{{ item.productName }}</span>
              <span v-if="item.productCode" class="product-code">SKU: {{ item.productCode }}</span>
            </div>
            <div class="col-price">{{ formatPrice(item.unitPrice) }}</div>
            <div class="col-quantity">{{ item.quantity }}</div>
            <div class="col-total">{{ formatPrice(item.unitPrice * item.quantity) }}</div>
          </div>
        </div>
      </div>

      <!-- Özet Bilgiler -->
      <div v-if="order" class="order-summary">
        <div v-if="order.subTotal !== undefined" class="summary-row">
          <span>Ara Toplam:</span>
          <span>{{ formatPrice(order.subTotal) }}</span>
        </div>
        <div v-if="order.shippingFee !== undefined" class="summary-row">
          <span>Kargo Ücreti:</span>
          <span>{{ formatPrice(order.shippingFee) }}</span>
        </div>
        <div v-if="order.taxAmount !== undefined" class="summary-row">
          <span>Vergiler:</span>
          <span>{{ formatPrice(order.taxAmount) }}</span>
        </div>
        <div v-if="order.totalAmount !== undefined" class="summary-row total">
          <span>Toplam:</span>
          <span>{{ formatPrice(order.totalAmount) }}</span>
        </div>
      </div>

      <!-- İşlem Butonları -->
      <div class="action-buttons">
        <button @click="$router.back()" class="back-button">
          <i class="fas fa-arrow-left"></i> Siparişlerime Dön
        </button>
        <button 
          v-if="canCancel" 
          @click="cancelOrder" 
          class="cancel-button"
        >
          <i class="fas fa-times-circle"></i> Siparişi İptal Et
        </button>
        <button 
          v-if="canRequestReturn" 
          @click="requestReturn" 
          class="return-button"
        >
          <i class="fas fa-undo"></i> İade Talebi Oluştur
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  name: 'OrderDetail',
  data() {
    return {
      order: null,
      loading: false,
      error: null,
      orderStatuses: [
        { value: 'PendingApproval', label: 'Onay Bekliyor' },
        { value: 'Approved', label: 'Onaylandı' },
        { value: 'Rejected', label: 'Reddedildi' },
        { value: 'Shipped', label: 'Kargoya Verildi' },
        { value: 'Delivered', label: 'Teslim Edildi' },
        { value: 'Cancelled', label: 'İptal Edildi' },
        { value: 'ReturnRequested', label: 'İade Talebi' },
        { value: 'ReturnApproved', label: 'İade Onaylandı' },
        { value: 'ReturnRejected', label: 'İade Reddedildi' }
      ]
    };
  },
  computed: {
    ...mapState(['token']),
    canCancel() {
      return this.order && ['PendingApproval', 'Approved'].includes(this.order.orderStatus);
    },
    canRequestReturn() {
      return this.order && ['Shipped', 'Delivered'].includes(this.order.orderStatus);
    }
  },
  methods: {
    async fetchOrderDetail() {
      this.loading = true;
      this.error = null;
      try {
        if (!this.token) throw new Error("Oturum açmanız gerekiyor");

        const id = this.$route.params.id;
        const response = await axios.get(`https://localhost:7135/api/Orders/${id}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        this.order = response.data;
      } catch (e) {
        console.error(e);
        this.error = e.response?.data?.message || 
                   e.message || 
                   "Sipariş detayları alınırken bir hata oluştu";
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const options = { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      };
      return new Date(dateStr).toLocaleDateString('tr-TR', options);
    },
    formatPrice(amount) {
      if (amount === undefined || amount === null) return '0,00 ₺';
      return amount.toFixed(2) + ' ₺';
    },
    getStatusClass(status) {
      if (!status) return '';
      return `status-${status.toLowerCase()}`;
    },
    getStatusText(status) {
      if (!status) return '';
      const found = this.orderStatuses.find(s => s.value === status);
      return found ? found.label : status;
    },
    async cancelOrder() {
      if (!confirm('Bu siparişi iptal etmek istediğinize emin misiniz?')) return;
      
      try {
        this.loading = true;
        await axios.put(`https://localhost:7135/api/Orders/${this.order.id}/cancel`, null, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.fetchOrderDetail(); // Yenile
      } catch (e) {
        alert('İptal işlemi başarısız oldu: ' + (e.response?.data?.message || e.message));
      } finally {
        this.loading = false;
      }
    },
    async requestReturn() {
      if (!confirm('Bu ürün için iade talebi oluşturmak istediğinize emin misiniz?')) return;
      
      try {
        this.loading = true;
        await axios.post(`https://localhost:7135/api/Orders/${this.order.id}/return-request`, null, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        alert('İade talebiniz başarıyla oluşturuldu');
        this.fetchOrderDetail(); // Yenile
      } catch (e) {
        alert('İade talebi oluşturulamadı: ' + (e.response?.data?.message || e.message));
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchOrderDetail();
  }
};
</script>

<style scoped>
.order-detail-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
}

/* Yükleme Durumu */
.loading-state {
  text-align: center;
  padding: 3rem 0;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Hata Durumu */
.error-state {
  text-align: center;
  padding: 2rem;
  background-color: #fdedec;
  border-radius: 8px;
  color: #e74c3c;
  max-width: 600px;
  margin: 0 auto;
}

.error-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #e74c3c;
}

.error-state h3 {
  margin-top: 0;
}

.retry-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 500;
}

.retry-button i {
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

/* Sipariş Kartı */
.order-detail-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
}

.order-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.order-title h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

.order-number {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.order-status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
}

/* Durum Renkleri */
.status-pendingapproval {
  background-color: #fef5e6;
  color: #f39c12;
}

.status-approved {
  background-color: #e8f4fc;
  color: #3498db;
}

.status-rejected {
  background-color: #fdedec;
  color: #e74c3c;
}

.status-shipped {
  background-color: #f5eef8;
  color: #9b59b6;
}

.status-delivered {
  background-color: #e8f8f0;
  color: #2ecc71;
}

.status-cancelled {
  background-color: #ecf0f1;
  color: #7f8c8d;
}

.status-returnrequested {
  background-color: #fdf2e9;
  color: #e67e22;
}

.status-returnapproved {
  background-color: #e8f8f0;
  color: #2ecc71;
}

.status-returnrejected {
  background-color: #f9ebea;
  color: #c0392b;
}

.order-meta {
  display: flex;
  gap: 2rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.meta-item i {
  width: 1rem;
  text-align: center;
}

/* Adres Bölümü */
.address-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

.address-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #eee;
}

.address-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.address-header i {
  color: #7f8c8d;
}

.address-content {
  padding: 1rem;
  line-height: 1.6;
}

.address-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

/* Sipariş Öğeleri */
.order-items-section {
  padding: 1.5rem;
  border-top: 1px solid #eee;
}

.order-items-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #2c3e50;
}

.order-items-section i {
  color: #7f8c8d;
}

.order-items-table {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  background-color: #f5f5f5;
  font-weight: 600;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #eee;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.table-row:last-child {
  border-bottom: none;
}

.col-product {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-weight: 500;
}

.product-code {
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-top: 0.3rem;
}

.col-price, .col-quantity, .col-total {
  display: flex;
  align-items: center;
}

/* Özet Bölümü */
.order-summary {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
  text-align: right;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  max-width: 300px;
  margin-left: auto;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed #ddd;
}

.summary-row.total {
  font-weight: 600;
  font-size: 1.1rem;
  color: #2c3e50;
  border-bottom: none;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
  border-top: 1px dashed #ddd;
}

/* İşlem Butonları */
.action-buttons {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;
  border-top: 1px solid #eee;
  background-color: #f5f5f5;
}

.action-buttons button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.back-button {
  background-color: #7f8c8d;
  color: white;
}

.back-button:hover {
  background-color: #6c7a7d;
}

.cancel-button {
  background-color: #e74c3c;
  color: white;
}

.cancel-button:hover {
  background-color: #c0392b;
}

.return-button {
  background-color: #e67e22;
  color: white;
}

.return-button:hover {
  background-color: #d35400;
}

/* Responsive */
@media (max-width: 768px) {
  .address-section {
    grid-template-columns: 1fr;
  }
  
  .table-header, .table-row {
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .action-buttons button {
    justify-content: center;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .order-meta {
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .table-header {
    display: none;
  }
  
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 1rem;
    border-bottom: 1px solid #eee;
  }
  
  .col-product, .col-price, .col-quantity, .col-total {
    justify-content: space-between;
    flex-direction: row;
    padding: 0.3rem 0;
  }
  
  .col-product::before {
    content: "Ürün: ";
    font-weight: 500;
  }
  
  .col-price::before {
    content: "Fiyat: ";
    font-weight: 500;
  }
  
  .col-quantity::before {
    content: "Adet: ";
    font-weight: 500;
  }
  
  .col-total::before {
    content: "Toplam: ";
    font-weight: 500;
  }
}
</style>