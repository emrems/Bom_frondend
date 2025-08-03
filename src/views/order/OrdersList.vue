<template>
  <div class="orders-container">
    <!-- Başlık ve Filtreleme Alanı -->
    <div class="orders-header">
      <h1 class="orders-title">Sipariş Geçmişim</h1>
      <div class="orders-filter">
        <select v-model="statusFilter" @change="filterOrders" class="filter-select">
          <option value="">Tüm Durumlar</option>
          <option v-for="status in orderStatuses" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
        <button @click="refreshOrders" class="refresh-button" title="Yenile">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
    </div>

    <!-- Yükleme ve Hata Durumları -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Sipariş bilgileriniz yükleniyor...</p>
    </div>

    <div v-if="error" class="error-state">
      <i class="fas fa-exclamation-triangle"></i>
      <p>{{ error }}</p>
      <button @click="fetchOrders" class="retry-button">Tekrar Dene</button>
    </div>

    <!-- Sipariş Listesi -->
    <div v-if="!loading && !error">
      <div v-if="filteredOrders.length > 0">
        <div class="orders-summary">
          Toplam <strong>{{ filteredOrders.length }}</strong> sipariş bulundu
        </div>

        <div class="orders-list">
          <div
            v-for="order in paginatedOrders"
            :key="order.id"
            @click="goToDetail(order.id)"
            class="order-card"
            :class="getStatusClass(order.orderStatus)"
          >
            <div class="order-header">
              <span class="order-number">#{{ order.orderNumber }}</span>
              <span class="order-status">{{ getStatusText(order.orderStatus) }}</span>
            </div>
            
            <div class="order-details">
              <div class="order-date">
                <i class="far fa-calendar-alt"></i>
                {{ formatDate(order.orderDate) }}
              </div>
              <div class="order-amount">
                <i class="fas fa-receipt"></i>
                {{ order.totalAmount.toFixed(2) }} ₺
              </div>
              <div class="order-items-count">
                <i class="fas fa-box-open"></i>
                {{ order.itemCount }} ürün
              </div>
            </div>
            
            <div class="order-actions">
              <button @click.stop="goToDetail(order.id)" class="detail-button">
                Detayları Gör <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Sayfalama -->
        <div v-if="totalPages > 1" class="pagination">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="page-button"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <span class="page-info">
            Sayfa {{ currentPage }} / {{ totalPages }}
          </span>
          
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="page-button"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-clipboard-list"></i>
        </div>
        <h3>Henüz siparişiniz bulunmamaktadır</h3>
        <p>Alışverişe başlamak için mağazamızı ziyaret edebilirsiniz.</p>
        <router-link to="/products" class="shop-button">Alışverişe Başla</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "OrdersList",
  data() {
    return {
      orders: [],
      filteredOrders: [],
      loading: false,
      error: null,
      statusFilter: "",
      currentPage: 1,
      itemsPerPage: 5,
      orderStatuses: [
        { value: "Pending", label: "Beklemede" },
        { value: "Processing", label: "Hazırlanıyor" },
        { value: "Shipped", label: "Kargolandı" },
        { value: "Delivered", label: "Teslim Edildi" },
        { value: "Cancelled", label: "İptal Edildi" }
      ]
    };
  },
  computed: {
    ...mapState(['token']),
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredOrders.slice(start, end);
    }
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      this.error = null;
      
      try {
        if (!this.token) {
          throw new Error("Oturum açmanız gerekiyor");
        }

        const response = await axios.get("https://localhost:7135/api/Orders", {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        
        this.orders = response.data.map(order => ({
          ...order,
          itemCount: order.items ? order.items.length : 0
        }));
        
        this.filterOrders();
      } catch (error) {
        console.error("Siparişler alınırken hata:", error);
        this.error = error.response?.data?.message || 
                    error.message || 
                    "Sipariş bilgileri alınırken bir hata oluştu";
      } finally {
        this.loading = false;
      }
    },

    filterOrders() {
      if (!this.statusFilter) {
        this.filteredOrders = [...this.orders];
      } else {
        this.filteredOrders = this.orders.filter(
          order => order.orderStatus === this.statusFilter
        );
      }
      this.currentPage = 1;
    },

    getStatusClass(status) {
      return `status-${status.toLowerCase()}`;
    },

    getStatusText(status) {
      const found = this.orderStatuses.find(s => s.value === status);
      return found ? found.label : status;
    },

    goToDetail(orderId) {
      this.$router.push(`/orders/${orderId}`);
    },

    formatDate(dateStr) {
      const options = { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      };
      return new Date(dateStr).toLocaleDateString('tr-TR', options);
    },

    refreshOrders() {
      this.fetchOrders();
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  },
  mounted() {
    this.fetchOrders();
  }
};
</script>

<style scoped>
/* Temel Stiller */
.orders-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
}

/* Başlık ve Filtre */
.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.orders-title {
  color: #2c3e50;
  font-size: 1.8rem;
  margin: 0;
}

.orders-filter {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 0.9rem;
}

.refresh-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #7f8c8d;
  font-size: 1rem;
  transition: transform 0.3s;
}

.refresh-button:hover {
  color: #3498db;
  transform: rotate(180deg);
}

/* Sipariş Özeti */
.orders-summary {
  margin-bottom: 1rem;
  color: #7f8c8d;
  font-size: 0.9rem;
}

/* Sipariş Kartları */
.orders-list {
  display: grid;
  gap: 1rem;
}

.order-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  align-items: center;
}

.order-number {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
}

.order-status {
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.order-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.order-details i {
  margin-right: 0.5rem;
  width: 1rem;
  text-align: center;
}

.order-actions {
  text-align: right;
}

.detail-button {
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.detail-button:hover {
  background-color: #f0f7fd;
}

.detail-button i {
  margin-left: 0.5rem;
  font-size: 0.8rem;
}

/* Durum Renkleri */
.status-pending {
  border-left-color: #f39c12;
}
.status-pending .order-status {
  background-color: #fef5e6;
  color: #f39c12;
}

.status-processing {
  border-left-color: #3498db;
}
.status-processing .order-status {
  background-color: #e8f4fc;
  color: #3498db;
}

.status-shipped {
  border-left-color: #9b59b6;
}
.status-shipped .order-status {
  background-color: #f5eef8;
  color: #9b59b6;
}

.status-delivered {
  border-left-color: #2ecc71;
}
.status-delivered .order-status {
  background-color: #e8f8f0;
  color: #2ecc71;
}

.status-cancelled {
  border-left-color: #e74c3c;
}
.status-cancelled .order-status {
  background-color: #fdedec;
  color: #e74c3c;
}

/* Sayfalama */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  gap: 1rem;
}

.page-button {
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.page-button:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: #7f8c8d;
}

/* Boş Durum */
.empty-state {
  text-align: center;
  padding: 3rem 0;
  border: 1px dashed #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.empty-icon {
  font-size: 3rem;
  color: #bdc3c7;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}

.shop-button {
  background-color: #3498db;
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
  display: inline-block;
}

.shop-button:hover {
  background-color: #2980b9;
}

/* Yükleme ve Hata Durumları */
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

.error-state {
  text-align: center;
  padding: 2rem;
  background-color: #fdedec;
  border-radius: 8px;
  color: #e74c3c;
}

.error-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.retry-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #c0392b;
}

/* Responsive */
@media (max-width: 600px) {
  .order-details {
    grid-template-columns: 1fr;
  }
  
  .orders-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>